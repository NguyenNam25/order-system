/*
  Warnings:

  - You are about to drop the column `cancelRole` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cancelRole",
ADD COLUMN     "role" "OrderRole";

-- DropEnum
DROP TYPE "OnCancelRole";
