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

async function main() {
  // 1. Category
  const category1 = await prisma.category.create({
    data: {
      name: "Motherboard & Components",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "Display & Router",
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: "Gaming Handheld",
    },
  });

  const category4 = await prisma.category.create({
    data: {
      name: "Gaming Gear",
    },
  });

  const category5 = await prisma.category.create({
    data: {
      name: "Mini PC & Desktop",
    },
  });

  const category6 = await prisma.category.create({
    data: {
      name: "ROG SAGA",
    },
  });

  // 2. Product
  const product1 = await prisma.product.create({
    data: {
      name: "ROG Crosshair X870E Edition 20",
      price: 399000000,
      categoryId: category1.id,
      quantity: 10,
      description: ""
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "ROG Astral GeForce RTX 5090 Edition 20",
      price: 189000000,
      categoryId: category1.id,
      quantity: 10,
      description: ""
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "ROG Thor 3000W Titanium III Edition 20",
      price: 29900000,
      categoryId: category1.id,
      quantity: 10,
      description: ""
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: "ROG GR20 Edition 20",
      price: 20000000,
      categoryId: category1.id,
      quantity: 10,
      description: ""
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: "ROG Swift OLED PG27AQWP-G Edition 20",
      price: 39990000,
      categoryId: category2.id,
      quantity: 10,
      description: ""
    },
  });

  const product6 = await prisma.product.create({
    data: {
      name: "ROG XREAL R1 Edition 20",
      price: 20900000,
      categoryId: category2.id,
      quantity: 10,
      description: ""
    },
  });

  const product7 = await prisma.product.create({
    data: {
      name: "ROG Rapture GT-BE98 Pro Edition 20",
      price: 17690000,
      categoryId: category2.id,
      quantity: 10,
      description: ""
    },
  });

  const product8 = await prisma.product.create({
    data: {
      name: "ROG Xbox Ally X20 Bundle",
      price: 64990000,
      categoryId: category3.id,
      quantity: 10,
      description: ""
    },
  });

  const product9 = await prisma.product.create({
    data: {
      name: "ROG Azoth Extreme Edition 20",
      price: 19990000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product10 = await prisma.product.create({
    data: {
      name: "ROG Keycap Mystery Box Edition 20",
      price: 1590000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product11 = await prisma.product.create({
    data: {
      name: "ROG Harpe II Extreme Edition 20",
      price: 8990000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product12 = await prisma.product.create({
    data: {
      name: "ROG Scabbard II XXL Edition 20",
      price: 1990000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product13 = await prisma.product.create({
    data: {
      name: "ROG Destrier Edition 20",
      price: 24990000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product14 = await prisma.product.create({
    data: {
      name: "ROG SLASH Hard Case Luggage Edition 20",
      price: 18200000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product15 = await prisma.product.create({
    data: {
      name: "ROG SLASH Backpack Edition 20",
      price: 12900000,
      categoryId: category4.id,
      quantity: 10,
      description: ""
    },
  });

  const product16 = await prisma.product.create({
    data: {
      name: "ROG NUC 16 Edition 20",
      price: 186000000,
      categoryId: category5.id,
      quantity: 10,
      description: ""
    },
  });

  const product17 = await prisma.product.create({
    data: {
      name: "ROG G1000 Edition 20",
      price: 402990000 ,
      categoryId: category5.id,
      quantity: 10,
      description: ""
    },
  });

  const product18 = await prisma.product.create({
    data: {
      name: "ROG SAGA OMNI Edition 20 Action Figure",
      price: 4160000,
      categoryId: category6.id,
      quantity: 0,
      description: ""
    },
  });

  const hashedPassword = await bcrypt.hash("t123456", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "test@gmail.com",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      fullname: "test",
      email: "test@gmail.com",
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
