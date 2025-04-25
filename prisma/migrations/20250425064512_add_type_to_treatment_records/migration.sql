-- First, add the column as nullable
ALTER TABLE "TreatmentRecord" ADD COLUMN "type" TEXT;

-- Set default value for existing records
UPDATE "TreatmentRecord" SET "type" = 'TREATMENT';

-- Now make it non-nullable
ALTER TABLE "TreatmentRecord" ALTER COLUMN "type" SET NOT NULL;

-- Create index on type column
CREATE INDEX "TreatmentRecord_type_idx" ON "TreatmentRecord"("type");
