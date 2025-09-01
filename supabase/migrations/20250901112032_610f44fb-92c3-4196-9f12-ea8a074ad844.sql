-- Add is_read column to support_messages table
ALTER TABLE public.support_messages 
ADD COLUMN is_read boolean DEFAULT false;