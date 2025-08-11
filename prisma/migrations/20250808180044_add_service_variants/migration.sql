/*
  Warnings:

  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "duration",
DROP COLUMN "price",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ServiceVariant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ServiceVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientIntake" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skinType" TEXT,
    "wrinkleType" TEXT,
    "skinTone" TEXT,
    "bloodCirculation" TEXT,
    "skinThickness" TEXT,
    "poreSize" TEXT,
    "skinElasticity" TEXT,
    "laser" BOOLEAN NOT NULL DEFAULT false,
    "ipl" BOOLEAN NOT NULL DEFAULT false,
    "radiofrequency" BOOLEAN NOT NULL DEFAULT false,
    "electricalCurrent" BOOLEAN NOT NULL DEFAULT false,
    "peel" BOOLEAN NOT NULL DEFAULT false,
    "hydrafacial" BOOLEAN NOT NULL DEFAULT false,
    "aestheticTreatmentDate" TEXT,
    "hyaluronicAcid" BOOLEAN NOT NULL DEFAULT false,
    "botulinumToxin" BOOLEAN NOT NULL DEFAULT false,
    "growthFactors" BOOLEAN NOT NULL DEFAULT false,
    "lacticAcid" BOOLEAN NOT NULL DEFAULT false,
    "microInvasiveOther" TEXT,
    "microInvasiveDate" TEXT,
    "satisfactionLevel" TEXT,
    "facelift" BOOLEAN NOT NULL DEFAULT false,
    "prosthesis" BOOLEAN NOT NULL DEFAULT false,
    "doubleEyelid" BOOLEAN NOT NULL DEFAULT false,
    "boneShaving" BOOLEAN NOT NULL DEFAULT false,
    "breastImplants" BOOLEAN NOT NULL DEFAULT false,
    "liposuction" BOOLEAN NOT NULL DEFAULT false,
    "plasticSurgeryOther" TEXT,
    "plasticSurgeryDate" TEXT,
    "heartDisease" BOOLEAN NOT NULL DEFAULT false,
    "highBloodPressure" BOOLEAN NOT NULL DEFAULT false,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "pacemaker" BOOLEAN NOT NULL DEFAULT false,
    "cancer" BOOLEAN NOT NULL DEFAULT false,
    "cancerName" TEXT,
    "cancerDate" TEXT,
    "orthodontics" BOOLEAN NOT NULL DEFAULT false,
    "orthodonticsName" TEXT,
    "orthodonticsDate" TEXT,
    "immuneSystemCondition" BOOLEAN NOT NULL DEFAULT false,
    "immuneSystemDetails" TEXT,
    "surgery" BOOLEAN NOT NULL DEFAULT false,
    "surgeryName" TEXT,
    "surgeryDate" TEXT,
    "currentlyPregnant" BOOLEAN NOT NULL DEFAULT false,
    "sensitiveToLight" BOOLEAN NOT NULL DEFAULT false,
    "lightSensitivityDetails" TEXT,
    "substanceAllergies" BOOLEAN NOT NULL DEFAULT false,
    "allergyDetails" TEXT,
    "longTermMedication" BOOLEAN NOT NULL DEFAULT false,
    "medicationDetails" TEXT,
    "implants" BOOLEAN NOT NULL DEFAULT false,
    "metalStent" BOOLEAN NOT NULL DEFAULT false,
    "threadLifting" BOOLEAN NOT NULL DEFAULT false,
    "hypertrophicScar" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "PatientIntake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceVariant_serviceId_idx" ON "ServiceVariant"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientIntake_clientId_key" ON "PatientIntake"("clientId");

-- CreateIndex
CREATE INDEX "PatientIntake_clientId_idx" ON "PatientIntake"("clientId");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- AddForeignKey
ALTER TABLE "ServiceVariant" ADD CONSTRAINT "ServiceVariant_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientIntake" ADD CONSTRAINT "PatientIntake_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
