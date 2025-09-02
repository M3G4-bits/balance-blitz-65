import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSupportNotifications } from "@/hooks/useSupportNotifications";
import CustomerSupportChatEnhanced from "./CustomerSupportChatEnhanced";

const GlobalCustomerSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasUnreadMessages, unreadCount } = useSupportNotifications();

  // Show welcome message on login
  useEffect(() => {
    if (user && !hasShownWelcome) {
      const timer = setTimeout(() => {
        if (!isOpen) {
          toast({
            title: "Welcome to Credit Stirling Bank!",
            description: "Need help? Click the chat icon for customer support.",
            duration: 5000,
          });
        }
        setHasShownWelcome(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, hasShownWelcome, isOpen, toast]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button - Fixed bottom right */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50 relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {hasUnreadMessages && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </Button>
      )}

      {/* Customer Support Chat */}
      <CustomerSupportChatEnhanced isOpen={isOpen} onToggle={toggleChat} />
    </>
  );
};

export default GlobalCustomerSupport;