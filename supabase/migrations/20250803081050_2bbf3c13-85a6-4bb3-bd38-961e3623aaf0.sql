-- Add admin policies for profiles table
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);

-- Add admin policies for user_balances table  
CREATE POLICY "Admins can view all balances"
ON public.user_balances
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);

-- Add admin policies for user_balances updates (for balance control feature)
CREATE POLICY "Admins can update all balances"
ON public.user_balances
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);