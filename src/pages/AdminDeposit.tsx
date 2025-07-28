import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, User, CreditCard } from "lucide-react";

export default function AdminDeposit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleDeposit = async () => {
    if (!user || !accountNumber || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Error", 
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('admin_deposit', {
        target_account_number: accountNumber,
        deposit_amount: parseFloat(amount),
        admin_user_id: user.id
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'error' in data) {
        toast({
          title: "Error",
          description: String(data.error),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Successfully deposited $${amount} to account ${accountNumber}`,
      });

      setAccountNumber("");
      setAmount("");
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Checking admin access...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-destructive">Access Denied</CardTitle>
              <CardDescription>
                You do not have admin privileges to access this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Deposit</CardTitle>
            <CardDescription>
              Deposit funds to any user account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="account-number"
                  type="text"
                  placeholder="Enter 10-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Deposit Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <Button 
              onClick={handleDeposit} 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Deposit Funds"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}