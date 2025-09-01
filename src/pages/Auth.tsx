// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// const Auth = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [signupData, setSignupData] = useState({ 
//     email: '', 
//     password: '', 
//     firstName: '', 
//     lastName: '' 
//   });
  
//   const { signIn, signUp, user } = useAuth();
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/');
//     }
//   }, [user, navigate]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     const { error } = await signIn(loginData.email, loginData.password);
    
//     if (error) {
//       toast({
//         title: "Login Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } else {
//       toast({
//         title: "Welcome back!",
//         description: "You have been logged in successfully.",
//       });
//       navigate('/');
//     }
    
//     setIsLoading(false);
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     const { error } = await signUp(
//       signupData.email, 
//       signupData.password, 
//       signupData.firstName, 
//       signupData.lastName
//     );
    
//     if (error) {
//       toast({
//         title: "Registration Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } else {
//       toast({
//         title: "Welcome to Credit Stirling Bank PLC!",
//         description: "Your account has been created successfully.",
//       });
//       navigate('/');
//     }
    
//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Credit Stirling Bank PLC</CardTitle>
//           <CardDescription>
//             Access your account or create a new one
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="login" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="login">Login</TabsTrigger>
//               <TabsTrigger value="signup">Sign Up</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="login">
//               <form onSubmit={handleLogin} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="login-email">Email</Label>
//                   <Input
//                     id="login-email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={loginData.email}
//                     onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="login-password">Password</Label>
//                   <Input
//                     id="login-password"
//                     type="password"
//                     placeholder="Enter your password"
//                     value={loginData.password}
//                     onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//               </form>
//             </TabsContent>
            
//             <TabsContent value="signup">
//               <form onSubmit={handleSignup} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="signup-firstName">First Name</Label>
//                     <Input
//                       id="signup-firstName"
//                       placeholder="First name"
//                       value={signupData.firstName}
//                       onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="signup-lastName">Last Name</Label>
//                     <Input
//                       id="signup-lastName"
//                       placeholder="Last name"
//                       value={signupData.lastName}
//                       onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-email">Email</Label>
//                   <Input
//                     id="signup-email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={signupData.email}
//                     onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-password">Password</Label>
//                   <Input
//                     id="signup-password"
//                     type="password"
//                     placeholder="Create a password"
//                     value={signupData.password}
//                     onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Creating account..." : "Create Account"}
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Auth;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CustomerSupportChat from '@/components/CustomerSupportChat';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingLoginData, setPendingLoginData] = useState<{email: string; password: string} | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const sendLoginOTP = async () => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send OTP via email
      const { error } = await supabase.functions.invoke('send-login-otp', {
        body: { 
          email: loginData.email,
          otp: otp
        }
      });

      if (error) throw error;

      // Store OTP and expiry in localStorage for verification
      localStorage.setItem('loginOTP', JSON.stringify({
        otp,
        email: loginData.email,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      }));

      setPendingLoginData(loginData);
      setShowOTPVerification(true);
      
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Send OTP instead of direct login
    await sendLoginOTP();
    setIsLoading(false);
  };

  const handleOTPVerification = async () => {
    if (!pendingLoginData) return;
    
    setIsLoading(true);
    
    try {
      // Verify OTP
      const storedData = localStorage.getItem('loginOTP');
      if (!storedData) throw new Error('No OTP found');
      
      const { otp: storedOTP, expires, email } = JSON.parse(storedData);
      
      if (Date.now() > expires) {
        throw new Error('OTP expired');
      }
      
      if (otpCode !== storedOTP || email !== pendingLoginData.email) {
        throw new Error('Invalid OTP');
      }

      // Clear stored OTP
      localStorage.removeItem('loginOTP');
      
      // Proceed with actual login
      const { error } = await signIn(pendingLoginData.email, pendingLoginData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        setShowWelcomeMessage(true);
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {!showOTPVerification ? (
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
                    {isLoading ? "Sending OTP..." : "Send Verification Code"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit verification code sent to:<br />
                      <span className="font-medium">{pendingLoginData?.email}</span>
                    </p>
                    
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otpCode}
                        onChange={(value) => setOtpCode(value)}
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
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowOTPVerification(false);
                        setOtpCode('');
                        setPendingLoginData(null);
                      }}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleOTPVerification}
                      className="flex-1" 
                      disabled={otpCode.length !== 6 || isLoading}
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </Button>
                  </div>
                </div>
              )}
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
      
      {showWelcomeMessage && <CustomerSupportChat showWelcomeMessage={true} />}
    </div>
  );
};

export default Auth;
