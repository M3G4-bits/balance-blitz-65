import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PiggyBank, Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Savings() {
  const navigate = useNavigate();
  const [savingsGoals] = useState([
    { id: 1, name: "Emergency Fund", current: 8500, target: 10000, color: "bg-primary" },
    { id: 2, name: "Vacation", current: 2300, target: 5000, color: "bg-accent" },
    { id: 3, name: "New Car", current: 15000, target: 25000, color: "bg-secondary" }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Savings</h1>
              <p className="text-muted-foreground">Manage your savings goals</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <span>Total Savings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(savingsGoals.reduce((sum, goal) => sum + goal.current, 0))}
              </div>
              <p className="text-muted-foreground mt-2">
                Across {savingsGoals.length} savings goals
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Savings Goals</h2>
            {savingsGoals.map((goal) => (
              <Card key={goal.id} className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${goal.color}/20`}>
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(goal.target - goal.current)} to go
                      </div>
                    </div>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}