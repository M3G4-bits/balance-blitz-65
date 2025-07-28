import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApplyLoan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanData, setLoanData] = useState({
    amount: '',
    purpose: '',
    loanType: '',
    monthlyIncome: '',
    employmentStatus: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate loan application submission
    setTimeout(() => {
      toast({
        title: "Loan Application Submitted",
        description: "Your loan application has been submitted successfully. We'll review it within 2-3 business days.",
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
              <DollarSign className="h-5 w-5" />
              Apply for Loan
            </CardTitle>
            <CardDescription>
              Complete the form below to apply for a personal loan with Credit Stirling Bank PLC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Loan Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={loanData.amount}
                    onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select onValueChange={(value) => setLoanData({ ...loanData, loanType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="auto">Auto Loan</SelectItem>
                      <SelectItem value="home">Home Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="Enter monthly income"
                    value={loanData.monthlyIncome}
                    onChange={(e) => setLoanData({ ...loanData, monthlyIncome: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select onValueChange={(value) => setLoanData({ ...loanData, employmentStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Full-time Employed</SelectItem>
                      <SelectItem value="part-time">Part-time Employed</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="What will you use this loan for?"
                  value={loanData.purpose}
                  onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Information</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional information about your loan application"
                  value={loanData.description}
                  onChange={(e) => setLoanData({ ...loanData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Loan Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Competitive interest rates starting from 4.99%</li>
                  <li>• Flexible repayment terms up to 7 years</li>
                  <li>• No prepayment penalties</li>
                  <li>• Quick approval within 2-3 business days</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Application..." : "Submit Loan Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyLoan;