import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBanking } from "@/contexts/BankingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function TransferConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state;
  const { addTransaction, formatCurrency } = useBanking();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transferCount, setTransferCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
    
    // Get transfer count from localStorage
    const count = parseInt(localStorage.getItem('transferCount') || '0', 10);
    setTransferCount(count);
  }, [user, navigate]);

  if (!transferData) {
    navigate("/transfer");
    return null;
  }

  const { amount, recipient, accountNumber, bankName, sortCode, description } = transferData;

  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let shouldSucceed = false; // Default to failure flow
    let hasAdminSetting = false;
    
    // Check if admin has set specific transfer settings for this user
    if (user) {
      try {
        const { data: transferSetting, error } = await supabase
          .from('admin_transfer_settings')
          .select('force_success')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!error && transferSetting) {
          // Admin has set a specific setting for this user - this ALWAYS takes priority
          console.log('Admin setting found:', transferSetting.force_success);
          shouldSucceed = transferSetting.force_success;
          hasAdminSetting = true;
        }
      } catch (error) {
        console.error('Error checking transfer settings:', error);
      }
    }

    // Only use alternating pattern if NO admin setting exists
    if (!hasAdminSetting) {
      shouldSucceed = transferCount % 2 === 0;
      console.log('No admin setting, using alternating pattern. Count:', transferCount, 'shouldSucceed:', shouldSucceed);
    }

    // Update transfer count only if no admin setting (to preserve alternating pattern for normal users)
    if (!hasAdminSetting) {
      const newCount = transferCount + 1;
      localStorage.setItem('transferCount', newCount.toString());
    }
    
    setIsLoading(false);
    
    console.log('Final routing decision - shouldSucceed:', shouldSucceed, 'hasAdminSetting:', hasAdminSetting);
    
    // Route based on transfer mode
    if (shouldSucceed) {
      // Success mode: go directly to OTP
      navigate("/transfer/otp", { state: transferData });
    } else {
      // Failure mode: go through TAC → Security → TIN → OTP flow
      navigate("/transfer/tac", { state: transferData });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/transfer")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Confirm Transfer</h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Review Transfer Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From Account:</span>
                <span className="font-medium">Checking Account - ****1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold text-2xl">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-medium">{recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-medium">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">{bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sort Code:</span>
                <span className="font-medium">{sortCode}</span>
              </div>
              {description && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium">{description}</span>
                </div>
              )}
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Transfer Fee:</p>
              <p className="font-semibold">Free</p>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Transfer...
                  </>
                ) : (
                  'Proceed with Transfer'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}