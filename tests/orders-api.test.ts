import "dotenv/config";

import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:net";
import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { after, before, test } from "node:test";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import {
  AdminPasswordUpdateSchema,
  userSchema,
} from "../schemas/userSchema";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!databaseUrl || !jwtSecret) {
  throw new Error("DATABASE_URL and JWT_SECRET are required for API tests.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const statuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED",
] as const;

type Status = (typeof statuses)[number];

const adminTransitions: Record<Status, readonly Status[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING"],
  SHIPPING: ["COMPLETED"],
  COMPLETED: ["RETURN_REQUESTED"],
  CANCELLED: [],
  RETURN_REQUESTED: ["RETURN_APPROVED", "RETURN_REJECTED"],
  RETURN_APPROVED: [],
  RETURN_REJECTED: [],
};

const userTransitions: Record<Status, readonly Status[]> = {
  PENDING: ["CANCELLED"],
  CONFIRMED: [],
  SHIPPING: ["COMPLETED"],
  COMPLETED: ["RETURN_REQUESTED"],
  CANCELLED: [],
  RETURN_REQUESTED: [],
  RETURN_APPROVED: [],
  RETURN_REJECTED: [],
};

const runId = crypto.randomUUID();
const testEmail = (name: string) => `codex-${name}-${runId}@example.invalid`;
const password = "OrderApiTestOldPass123";
const baseUrlPromise = getAvailableBaseUrl();

let server: ChildProcess | undefined;
let baseUrl = "";
let userId: number | undefined;
let adminId: number | undefined;
let apiUserId: number | undefined;
let productId: number | undefined;
let categoryId: number | undefined;
const orderIds: number[] = [];
const extraUserIds: number[] = [];
const extraProductIds: number[] = [];
const extraCategoryIds: number[] = [];

let userToken = "";
let adminToken = "";
let productName = "";

async function getAvailableBaseUrl(): Promise<string> {
  const port = await new Promise<number>((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not allocate a local test port."));
        return;
      }
      probe.close((error) =>
        error ? reject(error) : resolve(address.port),
      );
    });
  });

  return `http://127.0.0.1:${port}`;
}

function tokenFor(id: number): string {
  return jwt.sign({ userId: id }, jwtSecret!, { expiresIn: "20m" });
}

async function createOrder(
  ownerId = userId!,
  status: Status = "PENDING",
  itemQuantity = 0,
) {
  const order = await prisma.order.create({
    data: {
      userId: ownerId,
      orderCode: `TEST-${crypto.randomUUID()}`,
      receiverName: "API Test",
      phone: "0123456789",
      address: "Temporary integration test",
      status,
      total: itemQuantity * 100,
      ...(itemQuantity > 0
        ? {
            items: {
              create: {
                productId: productId!,
                quantity: itemQuantity,
                priceAtPurchase: 100,
              },
            },
          }
        : {}),
    },
  });

  orderIds.push(order.id);
  return order;
}

async function patchOrder(
  orderId: number | string,
  token: string | undefined,
  body: Record<string, unknown>,
) {
  const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(token ? { cookie: `token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: (await response.json()) as { message?: string },
  };
}

function statusPayload(status: Status): Record<string, unknown> {
  return status === "RETURN_APPROVED"
    ? { status, returnMethod: "REFUND" }
    : { status };
}

async function waitForApp() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server?.exitCode !== null && server?.exitCode !== undefined) {
      throw new Error(`Next server exited with code ${server.exitCode}.`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/products`);
      if (response.ok) return;
    } catch {
      // Wait for Next.js to bind the allocated port.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Next.js did not become ready for API tests.");
}

before(async () => {
  baseUrl = await baseUrlPromise;
  server = spawn(
    process.execPath,
    [
      join(process.cwd(), "node_modules", "next", "dist", "bin", "next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      baseUrl.split(":").at(-1)!,
    ],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: "ignore",
    },
  );

  await waitForApp();

  const category = await prisma.category.create({
    data: { name: `API Test ${runId}` },
  });
  categoryId = category.id;

  productName = `API Test Product ${runId}`;
  const product = await prisma.product.create({
    data: {
      name: productName,
      price: 100,
      quantity: 1,
      description: "Temporary API integration fixture",
      categoryId,
    },
  });
  productId = product.id;

  const passwordHash = await bcrypt.hash(password, 4);
  const user = await prisma.user.create({
    data: {
      fullname: "API Test User",
      email: testEmail("user"),
      phone: "0123456789",
      password: passwordHash,
      role: "USER",
    },
  });
  userId = user.id;

  const admin = await prisma.user.create({
    data: {
      fullname: "API Test Admin",
      email: testEmail("admin"),
      phone: "0123456789",
      password: passwordHash,
      role: "ADMIN",
    },
  });
  adminId = admin.id;

  userToken = tokenFor(user.id);
  adminToken = tokenFor(admin.id);
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill();
    await once(server, "exit");
  }

  if (orderIds.length > 0) {
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: orderIds } },
    });
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
  }

  const userIds = [userId, adminId, apiUserId, ...extraUserIds].filter(
    (id): id is number => id !== undefined,
  );
  if (userIds.length > 0) {
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: { in: userIds } } },
    });
    await prisma.cart.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  }
  if (extraProductIds.length > 0) {
    await prisma.product.deleteMany({
      where: { id: { in: extraProductIds } },
    });
  }
  if (productId) await prisma.product.delete({ where: { id: productId } });
  if (extraCategoryIds.length > 0) {
    await prisma.category.deleteMany({
      where: { id: { in: extraCategoryIds } },
    });
  }
  if (categoryId) await prisma.category.delete({ where: { id: categoryId } });

  await prisma.$disconnect();
});

test("catalog, product detail, and protected list APIs respond", async () => {
  const [productsResponse, categoriesResponse, productResponse, categoryResponse] =
    await Promise.all([
      fetch(`${baseUrl}/api/products`),
      fetch(`${baseUrl}/api/categories`),
      fetch(`${baseUrl}/api/products/${productId}`),
      fetch(`${baseUrl}/api/categories/${categoryId}`),
    ]);

  assert.equal(productsResponse.status, 200);
  assert.equal(categoriesResponse.status, 200);
  assert.equal(productResponse.status, 200);
  assert.equal(categoryResponse.status, 200);

  const products = (await productsResponse.json()) as { id: number }[];
  const categories = (await categoriesResponse.json()) as { id: number }[];
  assert.ok(products.some((product) => product.id === productId));
  assert.ok(categories.some((category) => category.id === categoryId));

  const adminHeaders = {
    "content-type": "application/json",
    cookie: `token=${adminToken}`,
  };
  const duplicateCategoryCreate = await fetch(`${baseUrl}/api/categories`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({ name: `API Test ${runId}` }),
  });
  assert.equal(duplicateCategoryCreate.status, 409);

  const categoryForDuplicateUpdate = await prisma.category.create({
    data: { name: `API Test Duplicate ${runId}` },
  });
  extraCategoryIds.push(categoryForDuplicateUpdate.id);
  const duplicateCategoryUpdate = await fetch(
    `${baseUrl}/api/categories/${categoryId}`,
    {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({ name: categoryForDuplicateUpdate.name }),
    },
  );
  assert.equal(duplicateCategoryUpdate.status, 409);

  const duplicateProductCreate = await fetch(`${baseUrl}/api/products`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      name: productName,
      price: 100,
      categoryId,
      quantity: 1,
      description: "Duplicate product regression case",
    }),
  });
  assert.equal(duplicateProductCreate.status, 409);

  const productForDuplicateUpdate = await prisma.product.create({
    data: {
      name: `API Test Duplicate Product ${runId}`,
      price: 100,
      quantity: 1,
      description: "Duplicate product update regression fixture",
      categoryId: categoryId!,
    },
  });
  extraProductIds.push(productForDuplicateUpdate.id);
  const duplicateProductUpdate = await fetch(
    `${baseUrl}/api/products/${productForDuplicateUpdate.id}`,
    {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({
        name: productName,
        price: 100,
        categoryId,
        quantity: 1,
        description: "Duplicate product regression case",
      }),
    },
  );
  assert.equal(duplicateProductUpdate.status, 409);

  assert.equal((await fetch(`${baseUrl}/api/me`)).status, 401);
  assert.equal((await fetch(`${baseUrl}/api/cart`)).status, 401);
  assert.equal((await fetch(`${baseUrl}/api/orders/me`)).status, 401);
  assert.equal((await fetch(`${baseUrl}/api/users`)).status, 401);

  const [usersResponse, ordersResponse] = await Promise.all([
    fetch(`${baseUrl}/api/users`, { headers: { cookie: `token=${adminToken}` } }),
    fetch(`${baseUrl}/api/orders`, {
      headers: { cookie: `token=${adminToken}` },
    }),
  ]);
  assert.equal(usersResponse.status, 200);
  assert.equal(ordersResponse.status, 200);

  const emptyStatusResponse = await fetch(`${baseUrl}/api/orders?status=`, {
    headers: { cookie: `token=${adminToken}` },
  });
  assert.equal(emptyStatusResponse.status, 200);

  const invalidProductBodies = ["{", "null", "[]", "{}"];
  for (const body of invalidProductBodies) {
    const createResponse = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `token=${adminToken}`,
      },
      body,
    });
    assert.equal(createResponse.status, 400);

    const updateResponse = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: `token=${adminToken}`,
      },
      body,
    });
    assert.equal(updateResponse.status, 400);
  }

  const missingCategoryProduct = await fetch(`${baseUrl}/api/products`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: JSON.stringify({
      name: "API Test Product With Missing Category",
      price: 100,
      categoryId: 2147483647,
      quantity: 1,
      description: "Invalid category regression case",
    }),
  });
  assert.equal(missingCategoryProduct.status, 400);

  for (const body of ["{", "null", "[]", JSON.stringify({ imageUrl: 42 })]) {
    const invalidImage = await fetch(
      `${baseUrl}/api/products/${productId}/images`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: `token=${adminToken}`,
        },
        body,
      },
    );
    assert.equal(invalidImage.status, 400);
  }

  for (const body of ["{", "null", "[]", "{}", JSON.stringify({ name: " " }), JSON.stringify({ name: 123 })]) {
    const invalidCategoryUpdate = await fetch(
      `${baseUrl}/api/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          cookie: `token=${adminToken}`,
        },
        body,
      },
    );
    assert.equal(invalidCategoryUpdate.status, 400);
  }

  for (const method of ["PUT", "PATCH"] as const) {
    for (const body of ["{", "null", "[]", "{}", JSON.stringify({ fullname: " " })]) {
      const invalidUserUpdate = await fetch(`${baseUrl}/api/users/${userId}`, {
        method,
        headers: {
          "content-type": "application/json",
          cookie: `token=${adminToken}`,
        },
        body,
      });
      assert.equal(invalidUserUpdate.status, 400);
    }

    const duplicateEmailUpdate = await fetch(`${baseUrl}/api/users/${userId}`, {
      method,
      headers: {
        "content-type": "application/json",
        cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({
        fullname: "API Test User",
        email: testEmail("admin"),
        phone: "0123456789",
      }),
    });
    assert.equal(duplicateEmailUpdate.status, 409);
  }

  const userUpdateResponse = await fetch(`${baseUrl}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: JSON.stringify({
      fullname: "API Test User Updated",
      email: testEmail("user"),
      phone: "0987654321",
    }),
  });
  assert.equal(userUpdateResponse.status, 200);
  const updatedUser = (await userUpdateResponse.json()) as { phone: string };
  assert.equal(updatedUser.phone, "0987654321");

  const missingUserId = 2147483647;
  const missingUserRequests = await Promise.all([
    fetch(`${baseUrl}/api/users/${missingUserId}`, {
      headers: { cookie: `token=${adminToken}` },
    }),
    fetch(`${baseUrl}/api/users/${missingUserId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({
        fullname: "Missing User",
        email: testEmail("missing-user"),
        phone: "0123456789",
      }),
    }),
    fetch(`${baseUrl}/api/users/${missingUserId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({
        fullname: "Missing User",
        email: testEmail("missing-user"),
        phone: "0123456789",
      }),
    }),
    fetch(`${baseUrl}/api/users/${missingUserId}`, {
      method: "DELETE",
      headers: { cookie: `token=${adminToken}` },
    }),
  ]);
  assert.deepEqual(
    missingUserRequests.map((response) => response.status),
    [404, 404, 404, 404],
  );

  const invalidStatusResponse = await fetch(
    `${baseUrl}/api/orders?status=NOT_A_STATUS`,
    { headers: { cookie: `token=${adminToken}` } },
  );
  assert.equal(invalidStatusResponse.status, 400);

  const invalidUserGetResponse = await fetch(
    `${baseUrl}/api/users/not-an-id`,
    { headers: { cookie: `token=${adminToken}` } },
  );
  assert.equal(invalidUserGetResponse.status, 400);

  const invalidUserDeleteResponse = await fetch(
    `${baseUrl}/api/users/not-an-id`,
    {
      method: "DELETE",
      headers: { cookie: `token=${adminToken}` },
    },
  );
  assert.equal(invalidUserDeleteResponse.status, 400);

  const invalidCreateBody = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: "{",
  });
  assert.equal(invalidCreateBody.status, 400);

  const nullCreateBody = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: "null",
  });
  assert.equal(nullCreateBody.status, 400);

  const invalidRoleCreate = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: JSON.stringify({
      fullname: "API Create User",
      email: testEmail("invalid-role-create"),
      phone: "0112345678",
      password: "CreateTestPass123",
      role: "NOT_A_ROLE",
    }),
  });
  assert.equal(invalidRoleCreate.status, 400);

  const validCreateResponse = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: JSON.stringify({
      fullname: "API Create User",
      email: testEmail("valid-admin-create"),
      phone: "0112345678",
      password: "CreateTestPass123",
      role: "USER",
    }),
  });
  assert.equal(validCreateResponse.status, 201);
  const createdUser = (await validCreateResponse.json()) as { id: number };
  extraUserIds.push(createdUser.id);

  const invalidRoleResponse = await fetch(`${baseUrl}/api/users?role=abc`, {
    headers: { cookie: `token=${adminToken}` },
  });
  assert.equal(invalidRoleResponse.status, 400);

  for (const body of [
    "{",
    "null",
    "[]",
    JSON.stringify({ name: " " }),
    JSON.stringify({ name: "A" }),
    JSON.stringify({ name: 123 }),
  ]) {
    const invalidCategoryCreate = await fetch(`${baseUrl}/api/categories`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `token=${adminToken}`,
      },
      body,
    });
    assert.equal(invalidCategoryCreate.status, 400);
  }
});

test("registration and password update schemas share password rules", () => {
  const registrationFields = {
    fullname: "Password Validation Test",
    email: "password-validation@example.invalid",
    phone: "0123456789",
  };

  for (const invalidPassword of [
    "",
    "A",
    "Ab123",
    "123456",
    "      ",
    "Ab 123",
    "Ab\t123",
  ]) {
    assert.equal(
      userSchema.safeParse({
        ...registrationFields,
        password: invalidPassword,
      }).success,
      false,
      `registration rejects ${JSON.stringify(invalidPassword)}`,
    );
    assert.equal(
      AdminPasswordUpdateSchema.safeParse({
        newPassword: invalidPassword,
        confirmPassword: invalidPassword,
      }).success,
      false,
      `password update rejects ${JSON.stringify(invalidPassword)}`,
    );
  }

  for (const validPassword of ["Ab1234", "Abc12345"]) {
    assert.equal(
      userSchema.safeParse({
        ...registrationFields,
        password: validPassword,
      }).success,
      true,
    );
    assert.equal(
      AdminPasswordUpdateSchema.safeParse({
        newPassword: validPassword,
        confirmPassword: validPassword,
      }).success,
      true,
    );
  }

  assert.equal(
    AdminPasswordUpdateSchema.safeParse({
      newPassword: "Ab1234",
      confirmPassword: "Ab1235",
    }).success,
    false,
  );
});

test("registration, duplicate registration, login, and profile flow", async () => {
  const email = testEmail("signup");
  const registration = {
    fullname: "API Registration Test",
    email,
    password: "OrderApiSignupPass123",
    phone: "0123456789",
  };

  for (const body of [
    "{",
    "null",
    "[]",
    JSON.stringify({ email: 123, password: null }),
    JSON.stringify({ email: "", password: "" }),
  ]) {
    const invalidLogin = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    assert.equal(invalidLogin.status, 400);
  }

  const malformedRegistration = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(malformedRegistration.status, 400);

  const nullRegistration = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "null",
  });
  assert.equal(nullRegistration.status, 400);

  for (const [index, invalidPassword] of [
    "",
    "Ab123",
    "123456",
    "      ",
    "Ab 123",
    "Ab\t123",
    null,
    123456,
    [],
    {},
  ].entries()) {
    const invalidPasswordRegistration = await fetch(
      `${baseUrl}/api/register`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...registration,
          email: testEmail(`invalid-password-${index}`),
          password: invalidPassword,
        }),
      },
    );
    assert.equal(invalidPasswordRegistration.status, 400);
  }

  const minimumPasswordRegistration = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...registration,
      email: testEmail("minimum-password"),
      password: "Ab1234",
    }),
  });
  assert.equal(minimumPasswordRegistration.status, 201);
  const minimumPasswordUser = (await minimumPasswordRegistration.json()) as {
    id: number;
  };
  extraUserIds.push(minimumPasswordUser.id);

  const invalidRegistration = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...registration, phone: "bad-phone" }),
  });
  assert.equal(invalidRegistration.status, 400);

  const firstRegistration = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(registration),
  });
  assert.equal(firstRegistration.status, 201);
  const registeredUser = (await firstRegistration.json()) as { id: number };
  apiUserId = registeredUser.id;

  const duplicateRegistration = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(registration),
  });
  assert.equal(duplicateRegistration.status, 400);

  const wrongPassword = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: "WrongPassword123" }),
  });
  assert.equal(wrongPassword.status, 401);

  const loginWithEmailWhitespace = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: `  ${email}  `,
      password: registration.password,
    }),
  });
  assert.equal(loginWithEmailWhitespace.status, 200);

  const login = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: registration.password }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  if (!cookie?.startsWith("token=")) {
    throw new Error("Login did not set the authentication cookie.");
  }

  const me = await fetch(`${baseUrl}/api/me`, {
    headers: { cookie },
  });
  assert.equal(me.status, 200);
  const profile = (await me.json()) as { user: { id: number; role: string } };
  assert.equal(profile.user.id, apiUserId);
  assert.equal(profile.user.role, "USER");

});

test("cart add/read/update, checkout, and owner order history flow", async () => {
  await prisma.product.update({
    where: { id: productId! },
    data: { quantity: 5 },
  });

  const invalidCartRequests = [
    "{",
    "null",
    JSON.stringify({ productId: String(productId), quantity: 1 }),
    JSON.stringify({ productId, quantity: 1.5 }),
    JSON.stringify({ productId: 0, quantity: 1 }),
  ];

  for (const body of invalidCartRequests) {
    const invalidAdd = await fetch(`${baseUrl}/api/cart`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `token=${userToken}`,
      },
      body,
    });
    assert.equal(invalidAdd.status, 400);
  }

  const add = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${userToken}`,
    },
    body: JSON.stringify({ productId, quantity: 2 }),
  });
  assert.equal(add.status, 201);
  const addData = (await add.json()) as { cartItem: { id: number } };
  const cartItemId = addData.cartItem.id;

  for (const body of ["{", "null", "[]", "{}", JSON.stringify({ quantity: "2" })]) {
    const invalidUpdate = await fetch(
      `${baseUrl}/api/cart/items/${cartItemId}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          cookie: `token=${userToken}`,
        },
        body,
      },
    );
    assert.equal(invalidUpdate.status, 400);
  }

  const readCart = await fetch(`${baseUrl}/api/cart`, {
    headers: { cookie: `token=${userToken}` },
  });
  assert.equal(readCart.status, 200);
  const cartData = (await readCart.json()) as {
    cart: { items: { id: number }[] };
  };
  assert.ok(cartData.cart.items.some((item) => item.id === cartItemId));

  const updateQuantity = await fetch(
    `${baseUrl}/api/cart/items/${cartItemId}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: `token=${userToken}`,
      },
      body: JSON.stringify({ quantity: 3 }),
    },
  );
  assert.equal(updateQuantity.status, 200);

  for (const body of ["{", "null", "[]", "{}"] ) {
    const invalidCheckout = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `token=${userToken}`,
      },
      body,
    });
    assert.equal(invalidCheckout.status, 400);
  }

  const checkout = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token=${userToken}`,
    },
    body: JSON.stringify({
      receiverName: "API Test Receiver",
      phone: "0123456789",
      address: "Temporary API test address",
      itemIds: [cartItemId],
    }),
  });
  assert.equal(checkout.status, 201);
  const checkoutData = (await checkout.json()) as {
    order: { id: number; status: Status; total: number };
  };
  orderIds.push(checkoutData.order.id);
  assert.equal(checkoutData.order.status, "PENDING");
  assert.equal(checkoutData.order.total, 300);

  const history = await fetch(`${baseUrl}/api/orders/me`, {
    headers: { cookie: `token=${userToken}` },
  });
  assert.equal(history.status, 200);
  const historyData = (await history.json()) as {
    orders: { id: number }[];
  };
  assert.ok(historyData.orders.some((order) => order.id === checkoutData.order.id));

  const emptiedCart = await fetch(`${baseUrl}/api/cart`, {
    headers: { cookie: `token=${userToken}` },
  });
  const emptiedCartData = (await emptiedCart.json()) as {
    cart: { items: unknown[] };
  };
  assert.equal(emptiedCartData.cart.items.length, 0);

  const deleteOrder = await fetch(`${baseUrl}/api/orders/${checkoutData.order.id}`, {
    method: "DELETE",
    headers: { cookie: `token=${adminToken}` },
  });
  assert.equal(deleteOrder.status, 200);
  const deleteOrderData = (await deleteOrder.json()) as { message: string };
  assert.equal(deleteOrderData.message, "Xóa đơn hàng thành công");
});

test("transition matrix permits/rejects every status pair for ADMIN", async () => {
  for (const from of statuses) {
    for (const to of statuses) {
      const order = await createOrder(adminId, from);
      const result = await patchOrder(order.id, adminToken, statusPayload(to));
      const expected = adminTransitions[from].includes(to) ? 200 : 400;

      assert.equal(
        result.status,
        expected,
        `ADMIN ${from} -> ${to}: ${result.body.message ?? "no message"}`,
      );
    }
  }
});

test("transition matrix permits/rejects every status pair for USER", async () => {
  for (const from of statuses) {
    for (const to of statuses) {
      const order = await createOrder(userId, from);
      const result = await patchOrder(order.id, userToken, statusPayload(to));
      const expected = userTransitions[from].includes(to) ? 200 : 403;

      assert.equal(
        result.status,
        expected,
        `USER ${from} -> ${to}: ${result.body.message ?? "no message"}`,
      );
    }
  }
});

test("status API rejects missing auth, invalid id/status, and missing return method", async () => {
  const order = await createOrder();

  const malformedBody = await fetch(`${baseUrl}/api/orders/${order.id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: "{",
  });
  assert.equal(malformedBody.status, 400);

  assert.equal(
    (await patchOrder(order.id, undefined, { status: "CANCELLED" })).status,
    401,
  );
  assert.equal(
    (await patchOrder("not-an-id", userToken, { status: "CANCELLED" })).status,
    400,
  );
  assert.equal(
    (await patchOrder(order.id, userToken, { status: "NOT_A_STATUS" })).status,
    400,
  );
  assert.equal(
    (await patchOrder(order.id, adminToken, { status: "RETURN_APPROVED" }))
      .status,
    400,
  );
});

test("USER cannot update another user's order", async () => {
  const order = await createOrder(adminId, "PENDING");
  const result = await patchOrder(order.id, userToken, {
    status: "CANCELLED",
    cancelNote: "not the owner",
  });

  assert.equal(result.status, 403);
});

test("concurrent USER cancellation and ADMIN confirmation have one winner and consistent stock", async () => {
  await prisma.product.update({
    where: { id: productId! },
    data: { quantity: 1 },
  });
  const order = await createOrder(userId, "PENDING", 1);

  const [cancel, confirm] = await Promise.all([
    patchOrder(order.id, userToken, {
      status: "CANCELLED",
      cancelNote: "race test",
    }),
    patchOrder(order.id, adminToken, { status: "CONFIRMED" }),
  ]);

  assert.deepEqual([cancel.status, confirm.status].sort(), [200, 400]);

  const storedOrder = await prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    select: { status: true },
  });
  const storedProduct = await prisma.product.findUniqueOrThrow({
    where: { id: productId! },
    select: { quantity: true },
  });

  assert.ok(
    (storedOrder.status === "CANCELLED" && storedProduct.quantity === 1) ||
      (storedOrder.status === "CONFIRMED" && storedProduct.quantity === 0),
    `status=${storedOrder.status}, quantity=${storedProduct.quantity}`,
  );
});

test("out-of-stock confirmation returns product message and rolls back status", async () => {
  await prisma.product.update({
    where: { id: productId! },
    data: { quantity: 0 },
  });
  const order = await createOrder(userId, "PENDING", 1);
  const result = await patchOrder(order.id, adminToken, {
    status: "CONFIRMED",
  });

  assert.equal(result.status, 400);
  assert.match(result.body.message ?? "", new RegExp(productName));
  assert.equal(
    (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status,
    "PENDING",
  );
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: productId! } }))
      .quantity,
    0,
  );
});

test("refund restocks while exchange does not", async () => {
  await prisma.product.update({
    where: { id: productId! },
    data: { quantity: 5 },
  });
  const refundOrder = await createOrder(userId, "RETURN_REQUESTED", 2);
  const refund = await patchOrder(refundOrder.id, adminToken, {
    status: "RETURN_APPROVED",
    returnMethod: "REFUND",
  });
  assert.equal(refund.status, 200);
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: productId! } }))
      .quantity,
    7,
  );

  await prisma.product.update({
    where: { id: productId! },
    data: { quantity: 5 },
  });
  const exchangeOrder = await createOrder(userId, "RETURN_REQUESTED", 2);
  const exchange = await patchOrder(exchangeOrder.id, adminToken, {
    status: "RETURN_APPROVED",
    returnMethod: "EXCHANGE",
  });
  assert.equal(exchange.status, 200);
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: productId! } }))
      .quantity,
    5,
  );
});

test("admin self password requires old password, can reset USER, but not another ADMIN", async () => {
  const selfUrl = `${baseUrl}/api/users/${adminId}/password`;
  const patchPassword = (url: string, token: string, body: unknown) =>
    fetch(url, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie: `token=${token}`,
      },
      body: JSON.stringify(body),
    });

  const malformedJsonResponse = await fetch(selfUrl, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      cookie: `token=${adminToken}`,
    },
    body: "{",
  });
  assert.equal(malformedJsonResponse.status, 400);

  const nullBodyResponse = await patchPassword(selfUrl, adminToken, null);
  assert.equal(nullBodyResponse.status, 400);

  for (const [index, invalidPassword] of [
    "",
    "Ab123",
    "123456",
    "      ",
    "Ab 123",
    "Ab\t123",
    null,
    123456,
    [],
    {},
  ].entries()) {
    const invalidPasswordResponse = await patchPassword(
      selfUrl,
      adminToken,
      {
        currentPassword: password,
        newPassword: invalidPassword,
      },
    );
    assert.equal(invalidPasswordResponse.status, 400, `invalid password ${index}`);
  }

  assert.equal(
    (
      await patchPassword(selfUrl, adminToken, {
        newPassword: "OrderApiTestNewPass123",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await patchPassword(selfUrl, adminToken, {
        currentPassword: "WrongOldPass123",
        newPassword: "OrderApiTestNewPass123",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await patchPassword(selfUrl, adminToken, {
        currentPassword: password,
        newPassword: "OrderApiTestNewPass123",
      })
    ).status,
    200,
  );

  const otherUserUrl = `${baseUrl}/api/users/${userId}/password`;
  const minimumPasswordUpdate = await patchPassword(
    otherUserUrl,
    adminToken,
    { newPassword: "Ab1234" },
  );
  assert.equal(minimumPasswordUpdate.status, 200);

  assert.equal(
    (
      await patchPassword(otherUserUrl, adminToken, {
        newPassword: "OrderApiTestResetPass123",
      })
    ).status,
    200,
  );

  const peerAdmin = await prisma.user.create({
    data: {
      fullname: "API Test Peer Admin",
      email: testEmail("peer-admin"),
      phone: "0123456789",
      password: await bcrypt.hash(password, 4),
      role: "ADMIN",
    },
  });
  extraUserIds.push(peerAdmin.id);

  const peerAdminReset = await patchPassword(
    `${baseUrl}/api/users/${peerAdmin.id}/password`,
    adminToken,
    { newPassword: "OrderApiTestResetPass123" },
  );
  assert.equal(peerAdminReset.status, 403);

  const unchangedPeerAdmin = await prisma.user.findUniqueOrThrow({
    where: { id: peerAdmin.id },
  });
  assert.equal(await bcrypt.compare(password, unchangedPeerAdmin.password), true);
});
