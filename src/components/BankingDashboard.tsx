import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useBanking } from "@/contexts/BankingContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  PiggyBank,
  History,
  Settings,
  Eye,
  EyeOff,
  Shield,
  HeadphonesIcon,
  User,
  LogOut
} from "lucide-react";

export const BankingDashboard = () => {
  const navigate = useNavigate();
  const { balance, transactions, formatCurrency } = useBanking();
  const { user, signOut } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BalanceBlitz</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
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
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/pay-bills")}
            >
              <CardContent className="p-3 text-center">
                <CreditCard className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Pay Bills</p>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/savings")}
            >
              <CardContent className="p-3 text-center">
                <PiggyBank className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-xs font-medium">Savings</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start">
              <CardContent className="p-3 text-center">
                <History className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium">History</p>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/settings")}
            >
              <CardContent className="p-3 text-center">
                <Settings className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium">Settings</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/kyc-status")}
            >
              <CardContent className="p-3 text-center">
                <Shield className="h-5 w-5 mx-auto mb-2 text-success-green" />
                <p className="text-xs font-medium">KYC Status</p>
                <p className="text-[10px] text-success-green">Verified</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/virtual-cards")}
            >
              <CardContent className="p-3 text-center">
                <CreditCard className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-xs font-medium">Virtual Cards</p>
                <p className="text-[10px] text-muted-foreground">2 Active</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/my-account")}
            >
              <CardContent className="p-3 text-center">
                <User className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">My Account</p>
                <p className="text-[10px] text-muted-foreground">Profile</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start">
              <CardContent className="p-3 text-center">
                <HeadphonesIcon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Support</p>
                <p className="text-[10px] text-muted-foreground">24/7 Help</p>
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