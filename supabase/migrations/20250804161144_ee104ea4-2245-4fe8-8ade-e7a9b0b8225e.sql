-- Create table for admin transfer settings
CREATE TABLE public.admin_transfer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  force_success BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_transfer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin transfer settings
CREATE POLICY "Admins can view all transfer settings" 
ON public.admin_transfer_settings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

CREATE POLICY "Admins can insert transfer settings" 
ON public.admin_transfer_settings 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

CREATE POLICY "Admins can update transfer settings" 
ON public.admin_transfer_settings 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

-- Update admin_deposit function to include custom fields
CREATE OR REPLACE FUNCTION public.admin_deposit(
  target_account_number text, 
  deposit_amount numeric, 
  admin_user_id uuid,
  custom_date timestamp with time zone DEFAULT now(),
  custom_bank text DEFAULT 'Admin Bank',
  custom_sender text DEFAULT 'Admin Deposit',
  custom_description text DEFAULT 'Admin deposit'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id uuid;
  current_balance numeric;
  new_balance numeric;
  transaction_id uuid;
BEGIN
  -- Check if user is admin
  IF NOT is_admin(admin_user_id) THEN
    RETURN json_build_object('error', 'Unauthorized: Admin access required');
  END IF;

  -- Find target user by account number
  SELECT user_id INTO target_user_id 
  FROM public.profiles 
  WHERE account_number = target_account_number;

  IF target_user_id IS NULL THEN
    RETURN json_build_object('error', 'Account not found');
  END IF;

  -- Get current balance
  SELECT balance INTO current_balance 
  FROM public.user_balances 
  WHERE user_id = target_user_id;

  -- Calculate new balance
  new_balance := current_balance + deposit_amount;

  -- Update balance
  UPDATE public.user_balances 
  SET balance = new_balance, updated_at = now()
  WHERE user_id = target_user_id;

  -- Insert transaction with custom fields
  INSERT INTO public.transactions (
    user_id, type, amount, description, status, bank_name, recipient, created_at
  ) VALUES (
    target_user_id, 
    'deposit', 
    deposit_amount, 
    custom_description,
    'completed',
    custom_bank,
    custom_sender,
    custom_date
  ) RETURNING id INTO transaction_id;

  RETURN json_build_object(
    'success', true,
    'transaction_id', transaction_id,
    'new_balance', new_balance
  );
END;
$function$;

-- Create trigger for updating updated_at
CREATE TRIGGER update_admin_transfer_settings_updated_at
BEFORE UPDATE ON public.admin_transfer_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();