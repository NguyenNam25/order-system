/*
  Warnings:

  - The `role` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "role",
ADD COLUMN     "role" "Role";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "Role" NOT NULL;

-- DropEnum
DROP TYPE "OrderRole";
