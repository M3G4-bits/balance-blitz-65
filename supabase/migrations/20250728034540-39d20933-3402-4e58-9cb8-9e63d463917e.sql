-- Fix function search path security issue
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    new_account_number text;
    counter integer := 0;
BEGIN
    LOOP
        -- Generate random 10-digit number starting with 1-9
        new_account_number := (1 + floor(random() * 9))::text || 
                             lpad(floor(random() * 1000000000)::text, 9, '0');
        
        -- Check if this number already exists
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE account_number = new_account_number) THEN
            RETURN new_account_number;
        END IF;
        
        counter := counter + 1;
        -- Prevent infinite loop
        IF counter > 100 THEN
            RAISE EXCEPTION 'Unable to generate unique account number after 100 attempts';
        END IF;
    END LOOP;
END;
$$;