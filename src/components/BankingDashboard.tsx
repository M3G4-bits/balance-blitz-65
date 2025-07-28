import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useBanking } from "@/contexts/BankingContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  LogOut,
  DollarSign,
  ArrowLeftRight,
  Plane
} from "lucide-react";

export const BankingDashboard = () => {
  const navigate = useNavigate();
  const { balance, transactions, formatCurrency } = useBanking();
  const { user, signOut } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchProfile();
    }
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, first_name, last_name')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (data) {
        setAvatarUrl(data.avatar_url);
        setUserName(data.first_name || 'User');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">BalanceBlitz</h1>
            <p className="text-muted-foreground">{getTimeGreeting()}, {userName}!</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/my-account")}
              className="relative"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || ''} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
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
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/transfer")}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Transfer
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/deposit")}
                >
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans & Credit Section */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle>Loans & Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Credit Score</h3>
                <div className="text-3xl font-bold text-success-green">870</div>
                <p className="text-sm text-muted-foreground">Excellent</p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Available Credit</h3>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(25000)}</div>
                <p className="text-sm text-muted-foreground">Line of Credit</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1">
                Apply for Loan
              </Button>
              <Button variant="outline" className="flex-1">
                Increase Credit Line
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Slider */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-1">
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
            
            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/history")}
            >
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

            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/account-summary")}
            >
              <CardContent className="p-3 text-center">
                <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Account Summary</p>
                <p className="text-[10px] text-muted-foreground">Overview</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/transfer")}
            >
              <CardContent className="p-3 text-center">
                <ArrowLeftRight className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-xs font-medium">Local Transfer</p>
                <p className="text-[10px] text-muted-foreground">Send Money</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/80 backdrop-blur-glass border-border shadow-glass cursor-pointer hover:bg-card/90 transition-all min-w-[120px] snap-start"
              onClick={() => navigate("/travel-leisure")}
            >
              <CardContent className="p-3 text-center">
                <Plane className="h-5 w-5 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-medium">Travel & Leisure</p>
                <p className="text-[10px] text-muted-foreground">Visa & Booking</p>
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
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors"
                  onClick={() => handleTransactionClick(transaction)}
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

        {/* Transaction Modal */}
        {showTransactionModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-card/95 backdrop-blur-glass border-border shadow-glass max-w-md w-full">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className={`font-semibold ${
                    selectedTransaction.amount > 0 ? 'text-success-green' : 'text-destructive'
                  }`}>
                    {selectedTransaction.amount > 0 ? '+' : ''}{formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {selectedTransaction.amount > 0 ? 'Credit' : 'Debit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedTransaction.date.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTransaction.date.toLocaleTimeString()}</span>
                </div>
                {selectedTransaction.recipient && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium">{selectedTransaction.bank_name || 'BalanceBlitz Bank'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium">{selectedTransaction.description}</span>
                </div>
                <Button 
                  onClick={() => setShowTransactionModal(false)}
                  className="w-full mt-4"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};