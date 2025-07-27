import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PayBills() {
  const navigate = useNavigate();
  const [bills] = useState([
    { 
      id: 1, 
      name: "Electric Bill", 
      amount: 125.50, 
      dueDate: "2024-08-05", 
      status: "due", 
      company: "City Power Co." 
    },
    { 
      id: 2, 
      name: "Internet", 
      amount: 79.99, 
      dueDate: "2024-08-08", 
      status: "upcoming", 
      company: "FastNet ISP" 
    },
    { 
      id: 3, 
      name: "Phone Bill", 
      amount: 65.00, 
      dueDate: "2024-08-12", 
      status: "upcoming", 
      company: "Mobile Plus" 
    },
    { 
      id: 4, 
      name: "Water Bill", 
      amount: 45.30, 
      dueDate: "2024-08-01", 
      status: "overdue", 
      company: "City Water Dept." 
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "due":
        return <Badge variant="secondary" className="bg-warning-orange/20 text-warning-orange">Due Soon</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pay Bills</h1>
            <p className="text-muted-foreground">Manage and pay your bills</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-warning-orange" />
                <span>Bills Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {formatCurrency(bills.filter(b => b.status === "overdue").reduce((sum, b) => sum + b.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-orange">
                    {formatCurrency(bills.filter(b => b.status === "due").reduce((sum, b) => sum + b.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">Due Soon</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {formatCurrency(bills.filter(b => b.status === "upcoming").reduce((sum, b) => sum + b.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Your Bills</h2>
            {bills.map((bill) => (
              <Card key={bill.id} className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-primary/20">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{bill.name}</h3>
                        <p className="text-sm text-muted-foreground">{bill.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-foreground">{formatCurrency(bill.amount)}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {new Date(bill.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(bill.status)}
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}