-- CreateEnum
CREATE TYPE "ConsentFormType" AS ENUM ('GENERAL_TREATMENT', 'BOTOX', 'FILLER');

-- CreateTable
CREATE TABLE "ConsentForm" (
    "id" TEXT NOT NULL,
    "type" "ConsentFormType" NOT NULL,
    "signature" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "ConsentForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsentForm_clientId_idx" ON "ConsentForm"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentForm_clientId_type_key" ON "ConsentForm"("clientId", "type");

-- AddForeignKey
ALTER TABLE "ConsentForm" ADD CONSTRAINT "ConsentForm_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
