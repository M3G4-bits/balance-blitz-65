import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  DollarSign, 
  MessageSquare, 
  Activity,
  Send,
  RefreshCw
} from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  account_number: string;
  avatar_url: string;
  balance: number;
  last_seen: string;
  is_online: boolean;
}

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  user_name: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
  }, [user]);

  const checkAdminAccess = async () => {
    console.log('Checking admin access for user:', user?.id);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    try {
      console.log('Making admin check request for user ID:', user.id);
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id);

      console.log('Admin check response:', { data, error });

      if (error) {
        console.error('Admin check error:', error);
        toast({
          title: "Access Denied", 
          description: "Error checking admin privileges.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (!data || data.length === 0) {
        console.log('No admin role found for user');
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      console.log('Admin access granted!');
    } catch (error) {
      console.error('Admin check error:', error);
      navigate('/');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: balances, error: balancesError } = await supabase
        .from('user_balances')
        .select('*');

      if (balancesError) throw balancesError;

      const usersWithBalances = profiles?.map(profile => {
        const balance = balances?.find(b => b.user_id === profile.user_id);
        return {
          ...profile,
          balance: Number(balance?.balance || 0),
          last_seen: new Date().toISOString(),
          is_online: Math.random() > 0.5 // Simulate online status
        };
      }) || [];

      setUsers(usersWithBalances);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive"
      });
    }
  };

  const updateUserBalance = async () => {
    if (!selectedUser || !newBalance) {
      toast({
        title: "Error",
        description: "Please select a user and enter a balance.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('user_balances')
        .upsert({
          user_id: selectedUser.user_id,
          balance: parseFloat(newBalance),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${selectedUser.first_name}'s balance to $${newBalance}`,
      });

      setNewBalance("");
      fetchUsers();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: "Error",
        description: "Failed to update balance.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // In a real app, you'd save this to a chat messages table
      const message: ChatMessage = {
        id: Date.now().toString(),
        user_id: selectedUser.user_id,
        message: newMessage,
        is_admin: true,
        created_at: new Date().toISOString(),
        user_name: "Admin"
      };

      setChatMessages(prev => [...prev, message]);
      setNewMessage("");

      toast({
        title: "Message Sent",
        description: `Message sent to ${selectedUser.first_name}`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.is_online).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${users.reduce((sum, user) => sum + user.balance, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="balance">Balance Control</TabsTrigger>
            <TabsTrigger value="chat">Customer Support</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Account: {user.account_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.is_online ? "default" : "secondary"}>
                          {user.is_online ? "Online" : "Offline"}
                        </Badge>
                        <span className="font-semibold">${user.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
              <CardHeader>
                <CardTitle>Update User Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select User</Label>
                  <select 
                    className="w-full p-2 rounded border"
                    onChange={(e) => {
                      const user = users.find(u => u.id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                  >
                    <option value="">Choose a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} - Current: ${user.balance}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedUser && (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p><strong>Selected:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                      <p><strong>Current Balance:</strong> ${selectedUser.balance.toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newBalance">New Balance</Label>
                      <Input
                        id="newBalance"
                        type="number"
                        placeholder="0.00"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={updateUserBalance} 
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Updating..." : "Update Balance"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
                <CardHeader>
                  <CardTitle>Select User to Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div 
                        key={user.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedUser?.id === user.id ? 'bg-primary/10 border-primary' : 'hover:bg-secondary/50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                            <Badge variant={user.is_online ? "default" : "secondary"} className="text-xs">
                              {user.is_online ? "Online" : "Offline"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedUser && (
                <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Chat with {selectedUser.first_name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-64 border rounded-lg p-4 overflow-y-auto space-y-2">
                      {chatMessages.length === 0 ? (
                        <p className="text-muted-foreground text-center">No messages yet</p>
                      ) : (
                        chatMessages.map((msg) => (
                          <div 
                            key={msg.id}
                            className={`p-2 rounded-lg ${
                              msg.is_admin ? 'bg-primary text-primary-foreground ml-8' : 'bg-secondary mr-8'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70">
                              {msg.is_admin ? 'Admin' : selectedUser.first_name} • {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}