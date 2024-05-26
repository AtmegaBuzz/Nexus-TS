/*
  Warnings:

  - Added the required column `category` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL;
