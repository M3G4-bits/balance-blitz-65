import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [balance, setBalance] = useState(12547.83);
  const [showBalance, setShowBalance] = useState(true);
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
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
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/transfer")}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Transfer
                </Button>
                
                <Button variant="outline" className="flex-1">
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Receive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Slider */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start"
              onClick={() => navigate("/pay-bills")}
            >
              <CardContent className="p-4 text-center">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Pay Bills</p>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start"
              onClick={() => navigate("/savings")}
            >
              <CardContent className="p-4 text-center">
                <PiggyBank className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">Savings</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start">
              <CardContent className="p-4 text-center">
                <History className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">History</p>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start"
              onClick={() => navigate("/settings")}
            >
              <CardContent className="p-4 text-center">
                <Settings className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Settings</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start">
              <CardContent className="p-4 text-center">
                <div className="h-6 w-6 mx-auto mb-2 bg-success-green/20 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-success-green rounded-full"></div>
                </div>
                <p className="text-sm font-medium">KYC Status</p>
                <p className="text-xs text-success-green">Verified</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">Virtual Cards</p>
                <p className="text-xs text-muted-foreground">2 Active</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[140px] snap-start">
              <CardContent className="p-4 text-center">
                <div className="h-6 w-6 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-primary rounded-full"></div>
                </div>
                <p className="text-sm font-medium">Support</p>
                <p className="text-xs text-muted-foreground">24/7 Help</p>
              </CardContent>
            </Card>
          </div>
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