import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  PiggyBank,
  History,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

interface Transaction {
  id: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  description: string;
  date: Date;
  recipient?: string;
}

export const BankingDashboard = () => {
  const [balance, setBalance] = useState(12547.83);
  const [showBalance, setShowBalance] = useState(true);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "transfer",
      amount: -250.00,
      description: "Transfer to John Doe",
      date: new Date(2024, 6, 25),
      recipient: "John Doe"
    },
    {
      id: "2",
      type: "deposit",
      amount: 1200.00,
      description: "Salary Deposit",
      date: new Date(2024, 6, 24),
    },
    {
      id: "3",
      type: "payment",
      amount: -89.99,
      description: "Amazon Purchase",
      date: new Date(2024, 6, 23),
    }
  ]);

  const { toast } = useToast();

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

    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "Transfer amount exceeds available balance.",
        variant: "destructive"
      });
      return;
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "transfer",
      amount: -amount,
      description: `Transfer to ${transferRecipient}`,
      date: new Date(),
      recipient: transferRecipient
    };

    // Update balance and transactions
    setBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Reset form and close dialog
    setTransferAmount("");
    setTransferRecipient("");
    setIsTransferOpen(false);

    toast({
      title: "Transfer Successful",
      description: `$${amount.toFixed(2)} transferred to ${transferRecipient}`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BalanceBlitz</h1>
            <p className="text-muted-foreground">Welcome back, Alex Johnson</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="h-8 w-8"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-foreground shadow-balance-glow">
                {showBalance ? formatCurrency(balance) : "••••••"}
              </div>
              <div className="flex space-x-3">
                <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Transfer Money</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recipient">Recipient</Label>
                        <Input
                          id="recipient"
                          placeholder="Enter recipient name"
                          value={transferRecipient}
                          onChange={(e) => setTransferRecipient(e.target.value)}
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
                        />
                      </div>
                      <Button 
                        onClick={handleTransfer} 
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Send Transfer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="flex-1">
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Receive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all">
            <CardContent className="p-4 text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Pay Bills</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all">
            <CardContent className="p-4 text-center">
              <PiggyBank className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Savings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all">
            <CardContent className="p-4 text-center">
              <History className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">History</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all">
            <CardContent className="p-4 text-center">
              <Settings className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Settings</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.amount > 0 
                        ? 'bg-success-green/20' 
                        : 'bg-destructive/20'
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowDownLeft className="h-4 w-4 text-success-green" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.amount > 0 
                      ? 'text-success-green' 
                      : 'text-destructive'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};