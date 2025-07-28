-- Create admin roles table
CREATE TABLE public.admin_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Admin can view their own role
CREATE POLICY "Admins can view their own role" 
ON public.admin_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = $1
  )
$$;

-- Admin deposit function
CREATE OR REPLACE FUNCTION public.admin_deposit(
  target_account_number text,
  deposit_amount numeric,
  admin_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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

  -- Insert transaction
  INSERT INTO public.transactions (
    user_id, type, amount, description, status
  ) VALUES (
    target_user_id, 
    'deposit', 
    deposit_amount, 
    'Admin deposit to account ' || target_account_number,
    'completed'
  ) RETURNING id INTO transaction_id;

  RETURN json_build_object(
    'success', true,
    'transaction_id', transaction_id,
    'new_balance', new_balance
  );
END;
$$;