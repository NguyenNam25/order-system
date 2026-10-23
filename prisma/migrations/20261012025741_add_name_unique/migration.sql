/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/

-- Kiểm tra Product có tên trùng không
SELECT "name", COUNT(*) AS total
FROM "Product"
GROUP BY "name"
HAVING COUNT(*) > 1;

-- Kiểm tra Category có tên trùng không
SELECT "name", COUNT(*) AS total
FROM "Category"
GROUP BY "name"

HAVING COUNT(*) > 1;
-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
