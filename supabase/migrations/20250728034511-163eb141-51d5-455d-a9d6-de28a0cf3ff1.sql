-- Add account_number to profiles table
ALTER TABLE public.profiles 
ADD COLUMN account_number text UNIQUE;

-- Add status to transactions table
ALTER TABLE public.transactions 
ADD COLUMN status text NOT NULL DEFAULT 'completed';

-- Function to generate unique 10-digit account number
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS text AS $$
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
$$ LANGUAGE plpgsql;

-- Update existing profiles to have account numbers
UPDATE public.profiles 
SET account_number = generate_account_number() 
WHERE account_number IS NULL;

-- Update the handle_new_user function to include account number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, account_number)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    generate_account_number()
  );
  
  INSERT INTO public.user_balances (user_id, balance)
  VALUES (NEW.id, 12547.83);
  
  RETURN NEW;
END;
$function$