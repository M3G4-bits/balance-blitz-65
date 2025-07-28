-- Create admin user account with specific credentials
-- Note: This creates a user profile and balance, but the actual auth user must be created through Supabase Auth UI

-- Insert admin role for the admin user (using a known UUID that we'll use for the admin)
INSERT INTO public.admin_roles (user_id, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin');

-- Insert profile for admin user
INSERT INTO public.profiles (
  user_id, 
  email, 
  first_name, 
  last_name, 
  account_number
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'adminuser@gmail.com',
  'Admin',
  'User',
  '1234567890'
);

-- Insert huge balance for admin user
INSERT INTO public.user_balances (user_id, balance, currency)
VALUES ('00000000-0000-0000-0000-000000000001', 1000000000000000.00, 'USD');