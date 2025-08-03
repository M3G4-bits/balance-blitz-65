import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePresence = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Update presence to online when component mounts
    const updatePresence = async (isOnline: boolean) => {
      try {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: user.id,
            is_online: isOnline,
            last_seen: new Date().toISOString(),
          });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    // Set user as online
    updatePresence(true);

    // Handle visibility change
    const handleVisibilityChange = () => {
      updatePresence(!document.hidden);
    };

    // Handle beforeunload
    const handleBeforeUnload = () => {
      updatePresence(false);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Heartbeat to keep presence alive
    const heartbeat = setInterval(() => {
      if (!document.hidden) {
        updatePresence(true);
      }
    }, 30000); // Every 30 seconds

    // Cleanup
    return () => {
      updatePresence(false);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(heartbeat);
    };
  }, [user]);
};
