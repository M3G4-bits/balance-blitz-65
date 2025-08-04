-- Add admin policies for updating transactions
CREATE POLICY "Admins can update all transactions" 
ON public.transactions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE admin_roles.user_id = auth.uid()
));

CREATE POLICY "Admins can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE admin_roles.user_id = auth.uid()
));