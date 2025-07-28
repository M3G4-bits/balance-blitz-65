import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useBanking } from "@/contexts/BankingContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Transfer() {
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { balance, formatCurrency } = useBanking();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || !transferRecipient || !accountNumber || !bankName || !sortCode) {
      toast({
        title: "Invalid Transfer",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate account number (10 digits)
    if (accountNumber.length !== 10 || !/^\d+$/.test(accountNumber)) {
      toast({
        title: "Invalid Account Number",
        description: "Account number must be exactly 10 digits.",
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

    // Navigate to confirmation page with transfer data
    navigate("/transfer/confirm", {
      state: {
        amount,
        recipient: transferRecipient,
        accountNumber,
        bankName,
        sortCode,
        description
      }
    });
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Transfer Money</h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpRight className="h-5 w-5 text-primary" />
              <span>Send Transfer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="recipient">Recipient Name</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient name"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-2"
                maxLength={10}
              />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="sortCode">Sort Code</Label>
              <Input
                id="sortCode"
                placeholder="Enter sort code"
                value={sortCode}
                onChange={(e) => setSortCode(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this transfer for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button 
              onClick={handleTransfer} 
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Send Transfer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}