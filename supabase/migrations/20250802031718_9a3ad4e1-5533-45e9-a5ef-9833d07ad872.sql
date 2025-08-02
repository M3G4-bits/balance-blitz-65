-- Add specific user as admin
INSERT INTO public.admin_roles (user_id, role) 
VALUES ('a5e9d980-fadc-48d4-a767-dfefe6347850', 'admin')
ON CONFLICT (user_id) DO NOTHING;