import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Shield, Bell, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: true
  });

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">Alex Johnson</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">alex.johnson@email.com</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch 
                  id="two-factor" 
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="biometric">Biometric Login</Label>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                </div>
                <Switch 
                  id="biometric" 
                  checked={security.biometric}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, biometric: checked }))}
                />
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get alerts via text message</p>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive app notifications</p>
                </div>
                <Switch 
                  id="push-notifications" 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Account Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}