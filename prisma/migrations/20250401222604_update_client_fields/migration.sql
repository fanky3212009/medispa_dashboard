/*
  Warnings:

  - Added the required column `consultant` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredBy` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "consultant" TEXT NOT NULL,
ADD COLUMN     "dob" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "occupation" TEXT NOT NULL,
ADD COLUMN     "referredBy" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
