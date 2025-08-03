-- Create support conversations table
CREATE TABLE public.support_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user presence table for online status
CREATE TABLE public.user_presence (
  user_id UUID NOT NULL PRIMARY KEY,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Support conversations policies
CREATE POLICY "Users can view their own conversations"
ON public.support_conversations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.support_conversations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations"
ON public.support_conversations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update conversations"
ON public.support_conversations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  )
);

-- Support messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.support_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_conversations 
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON public.support_messages
FOR INSERT
WITH CHECK (
  sender_type = 'user' AND
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.support_conversations 
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all messages"
ON public.support_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can create messages"
ON public.support_messages
FOR INSERT
WITH CHECK (
  sender_type = 'admin' AND
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  )
);

-- User presence policies
CREATE POLICY "Users can update their own presence"
ON public.user_presence
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all presence"
ON public.user_presence
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_support_conversations_updated_at
BEFORE UPDATE ON public.support_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_presence_updated_at
BEFORE UPDATE ON public.user_presence
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_support_conversations_user_id ON public.support_conversations(user_id);
CREATE INDEX idx_support_conversations_status ON public.support_conversations(status);
CREATE INDEX idx_support_messages_conversation_id ON public.support_messages(conversation_id);
CREATE INDEX idx_support_messages_created_at ON public.support_messages(created_at);
CREATE INDEX idx_user_presence_is_online ON public.user_presence(is_online);