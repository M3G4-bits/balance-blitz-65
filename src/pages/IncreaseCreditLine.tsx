import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IncreaseCreditLine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditData, setCreditData] = useState({
    requestedIncrease: '',
    currentIncome: '',
    reason: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate credit line increase request submission
    setTimeout(() => {
      toast({
        title: "Credit Line Increase Request Submitted",
        description: "Your request has been submitted. We'll review your application and respond within 1-2 business days.",
      });
      setIsSubmitting(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Increase Credit Line
            </CardTitle>
            <CardDescription>
              Request an increase to your current credit line with Credit Stirling Bank PLC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Current Credit Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Available Credit:</span>
                  <div className="font-semibold">$25,000</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Credit Score:</span>
                  <div className="font-semibold text-success-green">870</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requestedIncrease">Requested Credit Increase</Label>
                <Input
                  id="requestedIncrease"
                  type="number"
                  placeholder="Enter requested increase amount"
                  value={creditData.requestedIncrease}
                  onChange={(e) => setCreditData({ ...creditData, requestedIncrease: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentIncome">Current Annual Income</Label>
                <Input
                  id="currentIncome"
                  type="number"
                  placeholder="Enter your current annual income"
                  value={creditData.currentIncome}
                  onChange={(e) => setCreditData({ ...creditData, currentIncome: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Increase</Label>
                <Select onValueChange={(value) => setCreditData({ ...creditData, reason: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income-increase">Income Increase</SelectItem>
                    <SelectItem value="major-purchase">Planning Major Purchase</SelectItem>
                    <SelectItem value="emergency-fund">Emergency Fund</SelectItem>
                    <SelectItem value="business-expenses">Business Expenses</SelectItem>
                    <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional information to support your request"
                  value={creditData.description}
                  onChange={(e) => setCreditData({ ...creditData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What to Expect</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Review typically takes 1-2 business days</li>
                  <li>• No impact on credit score for review</li>
                  <li>• Decision based on current income and credit history</li>
                  <li>• Instant approval available for qualified customers</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Request..." : "Submit Credit Increase Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncreaseCreditLine;