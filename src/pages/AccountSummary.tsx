import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Building, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBanking } from "@/contexts/BankingContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AccountSummary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, transactions, formatCurrency } = useBanking();
  const [accountNumber, setAccountNumber] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchAccountNumber = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('account_number')
        .eq('user_id', user.id)
        .single();
      
      if (data?.account_number) {
        setAccountNumber(data.account_number);
      }
    };

    fetchAccountNumber();
  }, [user, navigate]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Account Summary</h1>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Primary Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-mono text-lg">{accountNumber}</p>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium">Checking Account</p>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(balance)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Linked Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="font-medium">Savings Account</p>
                  <p className="text-sm text-muted-foreground">****7892</p>
                  <p className="text-lg font-semibold">{formatCurrency(8549.23)}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="font-medium">Credit Card</p>
                  <p className="text-sm text-muted-foreground">****3456</p>
                  <p className="text-lg font-semibold">{formatCurrency(-892.45)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Cards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Joint Accounts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="outline" onClick={() => navigate("/history")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                      {transaction.status === 'pending' && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Pending</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'deposit' || (transaction.type === 'transfer' && transaction.amount > 0) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' || (transaction.type === 'transfer' && transaction.amount > 0) ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}