import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TransferTIN() {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state;
  const { user } = useAuth();
  const { toast } = useToast();
  const [tinNumber, setTinNumber] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (!transferData) {
      navigate("/");
    }
  }, [user, transferData, navigate]);

  if (!transferData) {
    return null;
  }

  const handleSubmit = () => {
    if (tinNumber.length < 10) {
      toast({
        title: "Invalid TIN",
        description: "Please enter a valid Tax Identification Number",
        variant: "destructive",
      });
      return;
    }

    // Navigate to OTP page
    navigate("/transfer/otp", { state: { ...transferData, tinNumber } });
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/transfer/security")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Tax Verification</h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Enter Tax Identification Number</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Please enter the Tax Identification Number (TIN) provided by your administrator
              </p>
              
              <div className="space-y-2">
                <label htmlFor="tin" className="text-sm font-medium">
                  TIN Number
                </label>
                <Input
                  id="tin"
                  type="text"
                  placeholder="Enter TIN number"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="text-center text-lg tracking-wider"
                />
              </div>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Your TIN is required for tax compliance and transfer verification purposes.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/transfer/security")}
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
                disabled={tinNumber.length < 10}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}