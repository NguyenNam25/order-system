-- CreateEnum
CREATE TYPE "OnCancelRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelRole" "OnCancelRole";
