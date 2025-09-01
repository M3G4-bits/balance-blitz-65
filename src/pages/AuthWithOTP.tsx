import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthWithOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPEmail = async (email: string, otp: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-login-otp', {
        body: { email, otp }
      });
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP email",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Generate and send OTP
    const otp = generateOTP();
    const otpSent = await sendOTPEmail(loginData.email, otp);
    
    if (otpSent) {
      // Store OTP temporarily (in real app, this would be server-side)
      sessionStorage.setItem('login_otp', otp);
      sessionStorage.setItem('login_otp_expires', (Date.now() + 3 * 60 * 1000).toString());
      setCurrentEmail(loginData.email);
      setCurrentPassword(loginData.password);
      setShowOTP(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    }
    
    setIsLoading(false);
  };

  const handleOTPVerification = async () => {
    if (otpCode.length !== 6) return;
    
    setIsLoading(true);
    
    try {
      // Verify OTP
      const storedOTP = sessionStorage.getItem('login_otp');
      const expiryTime = sessionStorage.getItem('login_otp_expires');
      
      if (!storedOTP || !expiryTime || Date.now() > parseInt(expiryTime)) {
        toast({
          title: "OTP Expired",
          description: "Please request a new OTP",
          variant: "destructive",
        });
        setShowOTP(false);
        setOtpCode("");
        setIsLoading(false);
        return;
      }
      
      if (otpCode !== storedOTP) {
        toast({
          title: "Invalid OTP",
          description: "Please enter the correct verification code",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // OTP verified, now sign in
      const { error } = await signIn(currentEmail, currentPassword);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Clear OTP data
        sessionStorage.removeItem('login_otp');
        sessionStorage.removeItem('login_otp_expires');
        
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(
      signupData.email, 
      signupData.password, 
      signupData.firstName, 
      signupData.lastName
    );
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Credit Stirling Bank PLC!",
        description: "Your account has been created successfully.",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    const otp = generateOTP();
    const otpSent = await sendOTPEmail(currentEmail, otp);
    
    if (otpSent) {
      sessionStorage.setItem('login_otp', otp);
      sessionStorage.setItem('login_otp_expires', (Date.now() + 3 * 60 * 1000).toString());
      setOtpCode("");
      toast({
        title: "New OTP Sent",
        description: "Please check your email for the new verification code",
      });
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verify Your Login</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {currentEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button 
              onClick={handleOTPVerification}
              disabled={otpCode.length !== 6 || isLoading}
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>
            
            <div className="text-center space-y-2">
              <Button 
                variant="ghost" 
                onClick={handleResendOTP}
                className="text-sm"
              >
                Resend OTP
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowOTP(false);
                  setOtpCode("");
                  sessionStorage.removeItem('login_otp');
                  sessionStorage.removeItem('login_otp_expires');
                }}
                className="w-full text-sm"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Credit Stirling Bank PLC</CardTitle>
          <CardDescription>
            Access your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Send Login OTP"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstName">First Name</Label>
                    <Input
                      id="signup-firstName"
                      placeholder="First name"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastName">Last Name</Label>
                    <Input
                      id="signup-lastName"
                      placeholder="Last name"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthWithOTP;