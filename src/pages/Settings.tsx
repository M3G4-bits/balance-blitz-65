import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Shield, Bell, CreditCard, HelpCircle, LogOut, Globe, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBanking, countries } from "@/contexts/BankingContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { country, setCountry } = useBanking();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
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

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error loading profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (field: string, value: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          [field]: value,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setProfile(prev => ({ ...prev, [field]: value }));
      setEditingField(null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">First Name</p>
                  {editingField === 'first_name' ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={profile.first_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => updateProfile('first_name', profile.first_name)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.first_name || 'Not set'}</p>
                  )}
                </div>
                {editingField !== 'first_name' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingField('first_name')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">Last Name</p>
                  {editingField === 'last_name' ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={profile.last_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => updateProfile('last_name', profile.last_name)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.last_name || 'Not set'}</p>
                  )}
                </div>
                {editingField !== 'last_name' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingField('last_name')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">Email</p>
                  {editingField === 'email' ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => updateProfile('email', profile.email)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.email || 'Not set'}</p>
                  )}
                </div>
                {editingField !== 'email' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingField('email')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">Phone</p>
                  {editingField === 'phone' ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => updateProfile('phone', profile.phone)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.phone || 'Not set'}</p>
                  )}
                </div>
                {editingField !== 'phone' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingField('phone')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Region & Currency</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Region</p>
                <p className="text-sm text-muted-foreground">{country.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{country.currencySymbol} {country.currency}</p>
                <p className="text-sm text-muted-foreground">Currency</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="country">Change Country & Currency</Label>
              <Select value={country.code} onValueChange={(value) => {
                const selectedCountry = countries.find(c => c.code === value);
                if (selectedCountry) setCountry(selectedCountry);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.currencySymbol} {country.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
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