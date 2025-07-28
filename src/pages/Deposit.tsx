import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBanking } from "@/contexts/BankingContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Deposit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTransaction, formatCurrency } = useBanking();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleDeposit = async () => {
    if (!amount || !depositMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await addTransaction({
        amount: depositAmount,
        type: 'deposit',
        description: `Deposit via ${depositMethod}`,
        date: new Date(),
        recipient: 'Your Account',
        status: 'completed'
      });

      toast({
        title: "Deposit Successful",
        description: `${formatCurrency(depositAmount)} has been added to your account`,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Deposit Funds</h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Make a Deposit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit-method">Deposit Method</Label>
              <Select value={depositMethod} onValueChange={setDepositMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deposit method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="check-deposit">Check Deposit</SelectItem>
                  <SelectItem value="cash-deposit">Cash Deposit (ATM)</SelectItem>
                  <SelectItem value="wire-transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {depositMethod === 'check-deposit' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Take photos of your check</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20">
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs">Front of Check</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-20">
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs">Back of Check</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Deposit Information</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Bank transfers typically take 1-3 business days</p>
                <p>• Debit card deposits are usually instant</p>
                <p>• Check deposits may take 1-5 business days to clear</p>
                <p>• Daily deposit limits may apply</p>
              </div>
            </div>

            <Button 
              onClick={handleDeposit}
              disabled={loading || !amount || !depositMethod}
              className="w-full"
              size="lg"
            >
              {loading ? "Processing..." : `Deposit ${amount ? formatCurrency(parseFloat(amount) || 0) : "Funds"}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}