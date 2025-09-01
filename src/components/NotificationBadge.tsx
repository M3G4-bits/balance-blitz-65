import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationBadgeProps {
  children: React.ReactNode;
}

export default function NotificationBadge({ children }: NotificationBadgeProps) {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Check for unread messages on mount
    checkUnreadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('new-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
        },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.sender_type === 'admin') {
            // Check if this message is for the current user's conversation
            checkIfMessageForUser(newMessage.conversation_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const checkUnreadMessages = async () => {
    if (!user) return;

    try {
      // Get user's conversations
      const { data: conversations } = await supabase
        .from('support_conversations')
        .select('id')
        .eq('user_id', user.id);

      if (!conversations || conversations.length === 0) return;

      // Check for admin messages in user's conversations
      const conversationIds = conversations.map(c => c.id);
      
      const { data: adminMessages } = await supabase
        .from('support_messages')
        .select('id')
        .in('conversation_id', conversationIds)
        .eq('sender_type', 'admin')
        .limit(1);

      setHasUnreadMessages(!!adminMessages && adminMessages.length > 0);
    } catch (error) {
      console.error('Error checking unread messages:', error);
    }
  };

  const checkIfMessageForUser = async (conversationId: string) => {
    if (!user) return;

    try {
      const { data: conversation } = await supabase
        .from('support_conversations')
        .select('user_id')
        .eq('id', conversationId)
        .single();

      if (conversation && conversation.user_id === user.id) {
        setHasUnreadMessages(true);
      }
    } catch (error) {
      console.error('Error checking message conversation:', error);
    }
  };

  const clearNotification = () => {
    setHasUnreadMessages(false);
  };

  return (
    <div className="relative" onClick={clearNotification}>
      {children}
      {hasUnreadMessages && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          1
        </span>
      )}
    </div>
  );
}
