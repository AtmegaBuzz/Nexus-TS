/*
  Warnings:

  - Changed the type of `temprature` on the `NotarizedData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "NotarizedData" DROP COLUMN "temprature",
ADD COLUMN     "temprature" DECIMAL(65,30) NOT NULL;
