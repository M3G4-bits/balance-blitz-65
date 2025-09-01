import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBanking } from "@/contexts/BankingContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, CheckCircle, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TransferStart() {
  const [transferAmount, setTransferAmount] = useState("");
  const { toast } = useToast();
  const { balance, formatCurrency } = useBanking();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleContinue = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid transfer amount.",
        variant: "destructive"
      });
      return;
    }

    // Check if user has sufficient balance
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${formatCurrency(balance)} available.`,
        variant: "destructive"
      });
      return;
    }

    // Navigate to transfer details page with amount
    navigate("/transfer", {
      state: { amount }
    });
  };

  const formatAmountInput = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmountInput(e.target.value);
    setTransferAmount(formatted);
  };

  const displayAmount = () => {
    if (!transferAmount) return "0.00";
    const num = parseFloat(transferAmount);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Credit Point Bank Online Banking Transfer</h1>
        </div>

        {/* Account Selection Card */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Select Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Checking Account (USD)</p>
                  <p className="text-sm text-muted-foreground">
                    Available Balance: {formatCurrency(balance)}
                  </p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Amount Input Card */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Amount to Transfer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="amount" className="text-base font-medium">
                Enter Amount
              </Label>
              <div className="mt-2 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">
                  $
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={handleAmountChange}
                  className="pl-8 text-lg h-12"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Amount: ${displayAmount()}
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Available Balance: {formatCurrency(balance)}
              </p>
            </div>

            <Button 
              onClick={handleContinue} 
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              disabled={!transferAmount || parseFloat(transferAmount) <= 0}
            >
              Continue to Transfer Details
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Use CSB today for your convenience, transfer money to friends and family</p>
        </div>
      </div>
    </div>
  );
}