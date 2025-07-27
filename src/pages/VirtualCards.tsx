import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Plus, Eye, EyeOff, Copy, Pause, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBanking } from "@/contexts/BankingContext";

interface VirtualCard {
  id: string;
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  status: 'active' | 'paused' | 'expired';
  type: 'shopping' | 'subscriptions' | 'travel';
}

export default function VirtualCards() {
  const navigate = useNavigate();
  const { formatCurrency } = useBanking();
  const [showCardDetails, setShowCardDetails] = useState<string | null>(null);
  
  const [cards] = useState<VirtualCard[]>([
    {
      id: "1",
      name: "Online Shopping",
      cardNumber: "4532 1234 5678 9012",
      expiryDate: "12/27",
      cvv: "123",
      balance: 500.00,
      status: 'active',
      type: 'shopping'
    },
    {
      id: "2", 
      name: "Subscriptions",
      cardNumber: "4532 9876 5432 1098",
      expiryDate: "08/26",
      cvv: "456",
      balance: 150.00,
      status: 'active',
      type: 'subscriptions'
    }
  ]);

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails(showCardDetails === cardId ? null : cardId);
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'shopping': return 'bg-primary';
      case 'subscriptions': return 'bg-accent';
      case 'travel': return 'bg-success-green';
      default: return 'bg-primary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-green';
      case 'paused': return 'text-yellow-500';
      case 'expired': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Virtual Cards</h1>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Card
          </Button>
        </div>

        <div className="grid gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getCardTypeColor(card.type)}/20`}>
                      <CreditCard className={`h-5 w-5 ${getCardTypeColor(card.type).replace('bg-', 'text-')}`} />
                    </div>
                    <span>{card.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(card.status)}`}>
                      {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Virtual Card Design */}
                <div className={`${getCardTypeColor(card.type)} rounded-xl p-6 text-white relative overflow-hidden`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm opacity-80">Balance</p>
                      <p className="text-2xl font-bold">{formatCurrency(card.balance)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">BalanceBlitz</p>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-6 h-4 bg-white/30 rounded"></div>
                        <div className="w-6 h-4 bg-white/50 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs opacity-80 mb-1">Card Number</p>
                      <p className="font-mono text-lg tracking-wider">
                        {showCardDetails === card.id ? card.cardNumber : "•••• •••• •••• " + card.cardNumber.slice(-4)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs opacity-80 mb-1">Expires</p>
                        <p className="font-mono">{card.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80 mb-1">CVV</p>
                        <p className="font-mono">
                          {showCardDetails === card.id ? card.cvv : "•••"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                </div>

                {/* Card Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCardDetails(card.id)}
                    className="flex-1"
                  >
                    {showCardDetails === card.id ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Show Details
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                  
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Card Creation CTA */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass border-dashed">
          <CardContent className="p-8 text-center">
            <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Create a New Virtual Card</h3>
            <p className="text-muted-foreground mb-4">
              Generate instant virtual cards for secure online transactions
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Virtual Card
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}