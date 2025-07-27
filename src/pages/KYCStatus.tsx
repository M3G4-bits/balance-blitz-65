import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Upload, FileText, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KYCStatus() {
  const navigate = useNavigate();

  const kycItems = [
    {
      title: "Personal Information",
      status: "completed",
      icon: User,
      description: "Name, date of birth, address verified"
    },
    {
      title: "Identity Document",
      status: "completed", 
      icon: FileText,
      description: "Government ID verified"
    },
    {
      title: "Address Proof",
      status: "completed",
      icon: Shield,
      description: "Utility bill verified"
    },
    {
      title: "Financial Information",
      status: "completed",
      icon: CheckCircle,
      description: "Income source verified"
    }
  ];

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">KYC Status</h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-success-green" />
                <span>Verification Complete</span>
              </CardTitle>
              <div className="bg-success-green/20 px-3 py-1 rounded-full">
                <span className="text-success-green text-sm font-medium">Verified</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Your account has been fully verified. You can now access all banking features.
            </p>
            
            <div className="grid gap-4">
              {kycItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
                  <div className="bg-success-green/20 p-2 rounded-full">
                    <item.icon className="h-5 w-5 text-success-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success-green" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Benefits of Verification</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Higher transaction limits</li>
                <li>• Access to premium features</li>
                <li>• Enhanced security protection</li>
                <li>• Priority customer support</li>
              </ul>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Update Documents
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                <FileText className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}