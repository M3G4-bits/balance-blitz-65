import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSupportNotifications = () => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setHasUnreadMessages(false);
      setUnreadCount(0);
      return;
    }

    const checkUnreadMessages = async () => {
      try {
        // Get user's conversations
        const { data: conversations } = await supabase
          .from('support_conversations')
          .select('id')
          .eq('user_id', user.id);

        if (!conversations || conversations.length === 0) return;

        const conversationIds = conversations.map(c => c.id);

        // Count unread admin messages using raw SQL to avoid type issues
        const { count } = await supabase
          .from('support_messages')
          .select('id', { count: 'exact', head: true })
          .in('conversation_id', conversationIds)
          .eq('sender_type', 'admin')
          .eq('is_read', false);

        setUnreadCount(count || 0);
        setHasUnreadMessages((count || 0) > 0);
      } catch (error) {
        console.error('Error checking unread messages:', error);
        // For now, assume no unread messages if there's an error
        setUnreadCount(0);
        setHasUnreadMessages(false);
      }
    };

    checkUnreadMessages();

    // Subscribe to new admin messages
    const channel = supabase
      .channel('support-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (newMessage.sender_type === 'admin') {
            checkUnreadMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      // Use raw update to bypass TypeScript type checking
      const { error } = await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'admin');

      if (error) {
        console.error('Error marking messages as read:', error);
        return;
      }

      setHasUnreadMessages(false);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    hasUnreadMessages,
    unreadCount,
    markMessagesAsRead
  };
};