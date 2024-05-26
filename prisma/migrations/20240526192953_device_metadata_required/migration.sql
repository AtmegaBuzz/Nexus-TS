/*
  Warnings:

  - Made the column `category` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manufacturer` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `region` on table `Device` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "manufacturer" SET NOT NULL,
ALTER COLUMN "region" SET NOT NULL;
