-- Add balanceAfter column as nullable first
ALTER TABLE "TreatmentRecord" ADD COLUMN "balanceAfter" DECIMAL(10,2);

-- Create a temporary function to calculate balances
CREATE OR REPLACE FUNCTION calculate_balances() RETURNS void AS $$
DECLARE
    client_record RECORD;
    treatment_record RECORD;
    current_balance DECIMAL(10,2);
BEGIN
    -- Loop through each client
    FOR client_record IN SELECT DISTINCT "clientId" FROM "TreatmentRecord" LOOP
        -- Reset balance for each client
        current_balance := 0;
        
        -- Process each treatment record in chronological order
        FOR treatment_record IN 
            SELECT id, type, "totalAmount"
            FROM "TreatmentRecord"
            WHERE "clientId" = client_record."clientId"
            ORDER BY date ASC
        LOOP
            -- Update balance based on record type
            IF treatment_record.type = 'FUND_ADDITION' THEN
                current_balance := current_balance + treatment_record."totalAmount";
            ELSE
                current_balance := current_balance - treatment_record."totalAmount";
            END IF;
            
            -- Update balanceAfter for this record
            UPDATE "TreatmentRecord"
            SET "balanceAfter" = current_balance
            WHERE id = treatment_record.id;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate balances
SELECT calculate_balances();

-- Drop the temporary function
DROP FUNCTION calculate_balances();

-- Make balanceAfter required
ALTER TABLE "TreatmentRecord" ALTER COLUMN "balanceAfter" SET NOT NULL;
