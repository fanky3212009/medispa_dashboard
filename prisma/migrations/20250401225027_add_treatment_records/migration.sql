-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "consultant" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "maritalStatus" DROP NOT NULL,
ALTER COLUMN "occupation" DROP NOT NULL,
ALTER COLUMN "referredBy" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TreatmentRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "staffName" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "TreatmentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "treatmentRecordId" TEXT NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkinAssessment" (
    "id" TEXT NOT NULL,
    "skinType" TEXT NOT NULL,
    "skinTexture" TEXT NOT NULL,
    "skinTone" TEXT NOT NULL,
    "treatments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "SkinAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TreatmentRecord_clientId_idx" ON "TreatmentRecord"("clientId");

-- CreateIndex
CREATE INDEX "Treatment_treatmentRecordId_idx" ON "Treatment"("treatmentRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "SkinAssessment_clientId_key" ON "SkinAssessment"("clientId");

-- CreateIndex
CREATE INDEX "SkinAssessment_clientId_idx" ON "SkinAssessment"("clientId");

-- AddForeignKey
ALTER TABLE "TreatmentRecord" ADD CONSTRAINT "TreatmentRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_treatmentRecordId_fkey" FOREIGN KEY ("treatmentRecordId") REFERENCES "TreatmentRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinAssessment" ADD CONSTRAINT "SkinAssessment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
