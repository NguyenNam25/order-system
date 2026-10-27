import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function seedCategory(name: string) {
  const existing = await prisma.category.findFirst({
    where: { name },
  });

  if (existing) {
    return existing;
  }

  return prisma.category.create({
    data: { name },
  });
}

type ProductSeed = {
  name: string;
  price: number;
  categoryId: number;
  quantity: number;
  description: string;
  ProductImage?: string[];
};

async function seedProduct(data: ProductSeed) {
  const { ProductImage, ...productData } = data;

  return prisma.product.upsert({
    where: {
      name: data.name,
    },
    update: {
      ...productData,
      ...(ProductImage !== undefined && {
        images: {
          deleteMany: {},
          create: ProductImage.map((imageUrl) => ({
            imageUrl,
          })),
        },
      }),
    },
    create: {
      ...productData,
      ...(ProductImage !== undefined && {
        images: {
          create: ProductImage.map((imageUrl) => ({
            imageUrl,
          })),
        },
      }),
    },
  });
}
async function main() {
  // 1. Category
  const category1 = await seedCategory("Motherboard & Components");
  const category2 = await seedCategory("Display & Router");
  const category3 = await seedCategory("Gaming Handheld");
  const category4 = await seedCategory("Gaming Gear");
  const category5 = await seedCategory("Mini PC & Desktop");
  const category6 = await seedCategory("ROG SAGA");

  // 2. Product
  const products: ProductSeed[] = [
    {
      name: "ROG Crosshair X870E Edition 20",
      price: 399000000,
      categoryId: category1.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578374773-ba102118-d0c9-4834-8d9c-9c3e654828d4.png",
        "/api/uploads/products/1790578375654-1d2076b7-985a-4eaf-adab-be37590b219f.png",
        "/api/uploads/products/1790578375697-83f32104-78e2-4565-a597-200453413af9.png",
        "/api/uploads/products/1790578375736-b0262139-40b0-454b-bc89-94187f7dde4e.png",
        "/api/uploads/products/1790578375771-07a2acb0-567c-4d15-b8f1-50f74aa7b386.png",
        "/api/uploads/products/1790578375812-b5ce5a0d-fd42-4952-8d85-80d8f050c991.png",
        "/api/uploads/products/1790578375846-616df4d3-8156-4e58-a5a0-ddd03e16d162.png",
      ],
    },
    {
      name: "ROG Astral GeForce RTX 5090 Edition 20",
      price: 189000000,
      categoryId: category1.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578431902-cdaa534a-a104-45c1-b18d-1400faf0f79e.png",
        "/api/uploads/products/1790578431994-ab832304-7b97-4bee-bf3e-671555bf3eaa.png",
        "/api/uploads/products/1790578432046-29f1de87-0a61-4ae3-a1a0-e73ab59514b7.png",
        "/api/uploads/products/1790578432084-1302b59e-9f94-4acf-b6ee-b1e843fcb655.png",
        "/api/uploads/products/1790578432132-840d3298-490f-48bc-bdc4-9c6131035ab1.png",
        "/api/uploads/products/1790578432180-6a4a616e-95ee-4310-8bb7-ebd3fddad53f.png",
        "/api/uploads/products/1790578432215-4a6af700-0617-47be-b4fb-d9d4ca3b16d2.png",
      ],
    },
    {
      name: "ROG Thor 3000W Titanium III Edition 20",
      price: 29900000,
      categoryId: category1.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578514518-21025e81-1917-4f44-98f2-e23d622a690d.png",
        "/api/uploads/products/1790578514600-2aff9a82-be92-43df-845b-ff5aa66c897b.png",
        "/api/uploads/products/1790578514644-e110ac8d-80bf-4a97-98aa-a1f419bfc321.png",
        "/api/uploads/products/1790578514678-0bb0b74f-99bd-4c64-abec-8f3f503ad55b.png",
        "/api/uploads/products/1790578514710-5c0508ad-209d-4f87-b917-473634593803.png",
        "/api/uploads/products/1790578514763-c4ad5edc-f74d-41f3-acef-51b198cd49dc.png",
        "/api/uploads/products/1790578514796-14a30895-6746-483a-a5ee-59c1245701f3.png",
      ],
    },
    {
      name: "ROG GR20 Edition 20",
      price: 20000000,
      categoryId: category1.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578564407-f0232611-c8c0-4da7-9297-098cf2b7f1ff.png",
        "/api/uploads/products/1790578564503-b531344b-c440-454a-a3bb-0e0df65d08c1.png",
        "/api/uploads/products/1790578564557-299b6371-d8bc-45f3-b907-ef2daa5861b8.png",
        "/api/uploads/products/1790578564597-a3895a41-0fe6-4ce8-9beb-146b625570f4.png",
        "/api/uploads/products/1790578564627-abbf5b68-e8d9-4f21-8e9b-5c548513f0aa.png",
        "/api/uploads/products/1790578564660-c165687a-cddd-4200-90bc-e5791b7ce0e2.png",
        "/api/uploads/products/1790578564709-c076245b-8f97-49bb-8556-ad0d154a8c5f.png",
        "/api/uploads/products/1790578564738-4cc270fc-749e-49a5-a554-383f6caca5de.png",
        "/api/uploads/products/1790578564770-07b13c42-22e7-45b2-b27e-66027ce04788.png",
        "/api/uploads/products/1790578564798-724c2438-338f-46fe-90e9-c6b1779f5a57.png",
      ],
    },
    {
      name: "ROG Swift OLED PG27AQWP-G Edition 20",
      price: 39990000,
      categoryId: category2.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578609055-b1419c75-eb90-430c-b26f-ed475c952139.png",
        "/api/uploads/products/1790578609141-503d2748-74c7-4b95-8207-b88641f62b6a.png",
        "/api/uploads/products/1790578609195-d509f976-df4f-4127-84e1-6e97a9981b70.png",
      ],
    },
    {
      name: "ROG Rapture GT-BE98 Pro Edition 20",
      price: 17690000,
      categoryId: category2.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578660735-c0e2eb00-2d23-4128-87d5-fad42188e3e7.png",
        "/api/uploads/products/1790578660841-e1b71c7c-2a64-4625-8250-1586cbabb272.png",
        "/api/uploads/products/1790578660917-fa5ff687-c791-4567-b40a-131f3a3ff622.png",
        "/api/uploads/products/1790578660957-68532c56-e6a4-4f1d-8fee-13982803c870.png",
        "/api/uploads/products/1790578660991-5516cefa-5880-45a2-a9a8-560c4d46bc30.png",
        "/api/uploads/products/1790578661024-bcaba2eb-19cc-45b4-b018-e253d6383363.png",
      ],
    },
    {
      name: "ROG Xbox Ally X20 Bundle",
      price: 64990000,
      categoryId: category3.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578691974-575fd42e-ea04-4643-a9d2-935aed2cfa36.png",
        "/api/uploads/products/1790578692054-fb0ccb6e-0ee3-4c5c-9926-0beb4f90622b.png",
        "/api/uploads/products/1790578692105-742a06f2-0de2-40a5-9344-8896b8b17bd2.png",
        "/api/uploads/products/1790578692136-130607dc-19f8-4429-b174-5c8fdd9d04d8.png",
        "/api/uploads/products/1790578692166-cac0d5c7-3189-414a-8bbd-744456dd6716.png",
        "/api/uploads/products/1790578692200-8919d143-7d64-471c-93df-530730ded29b.png",
      ],
    },
    {
      name: "ROG Azoth Extreme Edition 20",
      price: 19990000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578729920-562f24fc-b49f-4ffe-9536-656f6fa4f6d7.png",
        "/api/uploads/products/1790578730003-b52cf434-adf7-4f5d-9942-28ad2fb66cd6.png",
        "/api/uploads/products/1790578730052-c457f8e3-19c1-45a6-a64b-c40cdee98a74.png",
        "/api/uploads/products/1790578730090-07bbc773-9cad-42c9-aa9e-9e9d10f3509a.png",
        "/api/uploads/products/1790578730135-42260c4b-929a-4f23-88a5-8b91c1ae6762.png",
        "/api/uploads/products/1790578730185-6f1fb8cb-8881-467c-b5b0-132e0d2af311.png",
      ],
    },
    {
      name: "ROG Keycap Mystery Box Edition 20",
      price: 1590000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578769916-80420a8c-ae1d-4c20-9a37-d2e3e2518f3a.png",
        "/api/uploads/products/1790578770021-d10ed893-dd66-47e1-b3e9-3919fc33c0e9.png",
        "/api/uploads/products/1790578770074-79d5f56c-0c9a-4122-a308-ed34a56aa086.png",
        "/api/uploads/products/1790578770103-a5c07bf5-4e02-4d08-969c-215bdb032dc0.png",
        "/api/uploads/products/1790578770137-dd00a425-ddde-4ed3-a80f-5de7396b6d15.png",
        "/api/uploads/products/1790578770184-d5af4717-b916-41a7-a9c7-32af9099c7dd.png",
        "/api/uploads/products/1790578770218-6fbf23d3-cad4-4963-bf2a-6d4c4126cdbe.png",
        "/api/uploads/products/1790578770249-ca6b5f94-765c-4e98-84c3-0561a67dedfd.png",
      ],
    },
    {
      name: "ROG Harpe II Extreme Edition 20",
      price: 8990000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578797332-8e3913b2-b04f-4a64-bed2-00c7440715cc.png",
        "/api/uploads/products/1790578797421-552fc243-c9f7-4b3a-9d74-ac64755cb0b3.png",
        "/api/uploads/products/1790578797466-524c5968-d4dd-452b-a405-ed23cc53aa30.png",
        "/api/uploads/products/1790578797499-b99b7c64-7dfa-414c-9c6d-6946590b6058.png",
      ],
    },
    {
      name: "ROG Scabbard II XXL Edition 20",
      price: 1990000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578819148-3116b41b-c0f3-4ed9-9f88-d9139d27fb31.png",
        "/api/uploads/products/1790578819220-432285de-8392-47dc-8a55-93a9fa489071.png",
        "/api/uploads/products/1790578819275-bd1e2867-8908-435d-8921-9c747051cc84.png",
        "/api/uploads/products/1790578819320-63330125-2041-4015-a37f-9578952453f8.png",
        "/api/uploads/products/1790578819351-7301ab09-2e62-4fab-8883-6c8b56e26617.png",
      ],
    },
    {
      name: "ROG Destrier Edition 20",
      price: 24990000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578843594-d2fbc98e-cb23-4453-a134-9797f10460b1.png",
        "/api/uploads/products/1790578843676-78dc6291-2eac-46d7-a38f-301b256f4e28.png",
        "/api/uploads/products/1790578843730-a18519e1-7c4e-46aa-851e-769d7e679351.png",
        "/api/uploads/products/1790578843765-6eb1acc4-14b1-4579-97c6-93dbaef8c0bf.png",
        "/api/uploads/products/1790578843799-e98d13f3-3d6d-4d3a-ac9f-de0f595bce73.png",
      ],
    },
    {
      name: "ROG SLASH Hard Case Luggage Edition 20",
      price: 18200000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578870844-5d252105-e51e-4f00-b31c-7c55fb0dbc05.png",
        "/api/uploads/products/1790578870949-e428289b-bd10-460e-bb8a-0619782f3750.png",
        "/api/uploads/products/1790578870999-9877e8c3-82b0-4c85-bea9-48d27d03c726.png",
        "/api/uploads/products/1790578871041-aecb9495-5ca5-4f57-aa68-0dab48462e25.png",
        "/api/uploads/products/1790578871071-d97e7d47-a47f-4c14-aba8-2bb8c9fb1e29.png",
        "/api/uploads/products/1790578871107-4e43389f-60a0-4bb5-b34f-ef494061cc84.png",
        "/api/uploads/products/1790578871158-8974abf5-13cf-4e9b-949b-75016ca31607.png",
        "/api/uploads/products/1790578871206-76257c71-5744-4a17-ac81-755959ad33a5.png",
      ],
    },
    {
      name: "ROG SLASH Backpack Edition 20",
      price: 12900000,
      categoryId: category4.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578906771-3b5f8a39-9038-49e1-95b3-6702ec255f79.png",
        "/api/uploads/products/1790578906854-071d5f53-f942-4e63-b24b-9635d82c5828.png",
        "/api/uploads/products/1790578906914-6fef354c-8760-48ef-8a2a-05114b0d2ff9.png",
        "/api/uploads/products/1790578906945-e46a68f5-6081-40d3-8d43-6c20e23b1f2d.png",
        "/api/uploads/products/1790578907003-5fc6caa2-4fce-4cbc-a09f-760effba95c6.png",
        "/api/uploads/products/1790578907051-a83d2f87-5cab-4be0-9e65-9a444f9facfa.png",
        "/api/uploads/products/1790578907082-2d7621f0-a3e0-43bc-b39e-b08f5ae68865.png",
        "/api/uploads/products/1790578907114-96989222-cc4d-4632-8f97-8b8470bb7b97.png",
        "/api/uploads/products/1790578907149-967edcd9-a484-42ec-8d0d-849d6f51db97.png",
      ],
    },
    {
      name: "ROG NUC 16 Edition 20",
      price: 186000000,
      categoryId: category5.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578955621-9fab77a5-9e3a-431f-9d87-e0938fa3dcfe.png",
        "/api/uploads/products/1790578955688-d26994cb-e70d-445e-a4e4-d12cec880dc0.png",
        "/api/uploads/products/1790578955779-07097bc4-9b88-4f1d-a06b-9d810d6b5caf.png",
        "/api/uploads/products/1790578955827-f564a2ca-3b78-4a71-bbdd-dbea1301cef6.png",
        "/api/uploads/products/1790578955866-64d01778-99b7-4571-8738-d38c6d01254a.png",
        "/api/uploads/products/1790578955903-5545bebc-fc97-4093-8577-df2e5a46b0ee.png",
      ],
    },
    {
      name: "ROG G1000 Edition 20",
      price: 402990000,
      categoryId: category5.id,
      quantity: 10,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790578989541-5d5dbf22-5206-45af-82d1-ea16d5eff5a8.png",
        "/api/uploads/products/1790578989642-c582fa37-22d2-4bd9-96c9-1a47a4effbee.png",
        "/api/uploads/products/1790578989699-30ffc502-b388-4be8-892d-d3da8c157239.png",
        "/api/uploads/products/1790578989732-a47b302c-5daa-4607-a1ba-6faf7af12877.png",
        "/api/uploads/products/1790578989768-d43032f4-8828-4174-8a45-351b9fe96adf.png",
      ],
    },
    {
      name: "ROG SAGA OMNI Edition 20 Action Figure",
      price: 4160000,
      categoryId: category6.id,
      quantity: 0,
      description: "",
      ProductImage: [
        "/api/uploads/products/1790579036687-7bcae236-17e1-4510-a5cf-5e3d05f5ae1c.png",
        "/api/uploads/products/1790579036763-7f32c152-df24-4343-a7eb-50da6084ccb7.png",
        "/api/uploads/products/1790579036823-18370553-1cf3-48cd-b723-a530bf089e47.png",
        "/api/uploads/products/1790579036865-e3bfa04d-b18e-4431-a792-692eff3176e3.png",
        "/api/uploads/products/1790579036903-c90f70f3-21a2-4d67-9bf8-fd9090bed03d.png",
        "/api/uploads/products/1790579036966-4be17eb3-7d8a-43f6-a864-10e1bc228a40.png",
        "/api/uploads/products/1790579037026-45c5b103-4fd6-48ea-8511-ac360c9bf4d4.png",
        "/api/uploads/products/1790579037107-c5edd46d-061b-4f33-a369-60f6ccfda4cd.png",
        "/api/uploads/products/1790579037141-50ff140d-469b-47a7-94d0-a7a4eafa28b1.png",
        "/api/uploads/products/1790579037176-78031b2c-88cf-4cb1-9b5a-6cebbbb3c2ed.png",
        "/api/uploads/products/1790579037208-71377fdc-9617-498f-a19b-d78fdac2ef71.png",
        "/api/uploads/products/1790579037239-dcecd670-66b7-459c-b493-b34fa9a5a4d0.png",
      ],
    },
  ];

  for (const product of products) {
    await seedProduct(product);
  }

  const hashedPassword = await bcrypt.hash("t123456", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      fullname: "Admin",
      email: "admin@gmail.com",
      phone: "0983746564",
      role: "ADMIN",
      password: hashedPassword,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
