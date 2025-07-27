import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Transfer() {
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || !transferRecipient) {
      toast({
        title: "Invalid Transfer",
        description: "Please enter a valid amount and recipient.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transfer Successful",
      description: `$${amount.toFixed(2)} transferred to ${transferRecipient}`,
    });

    // Navigate back to dashboard
    navigate("/");
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
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient name or email"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
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
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="What's this for?"
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