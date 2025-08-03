import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Users, DollarSign, MessageSquare, Activity } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_number: string;
  balance: number;
  is_online: boolean;
}

interface SupportConversation {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  user_profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
  latest_message?: {
    message: string;
    created_at: string;
  };
}

interface SupportMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      // Fetch profiles with balances and presence
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          email,
          account_number
        `);

      if (profilesError) throw profilesError;

      // Fetch balances
      const { data: balances, error: balancesError } = await supabase
        .from('user_balances')
        .select('user_id, balance');

      if (balancesError) throw balancesError;

      // Fetch presence
      const { data: presence, error: presenceError } = await supabase
        .from('user_presence')
        .select('user_id, is_online');

      if (presenceError) throw presenceError;

      // Combine data
      const usersWithBalances: UserProfile[] = profiles.map(profile => {
        const userBalance = balances.find(b => b.user_id === profile.user_id);
        const userPresence = presence.find(p => p.user_id === profile.user_id);
        return {
          ...profile,
          balance: userBalance?.balance || 0,
          is_online: userPresence?.is_online || false,
        };
      });

      setUsers(usersWithBalances);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchConversations = async () => {
    try {
      // First get conversations
      const { data: conversations, error: convError } = await supabase
        .from('support_conversations')
        .select('id, user_id, status, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      if (!conversations || conversations.length === 0) {
        setConversations([]);
        return;
      }

      // Get user profiles for the conversations
      const userIds = conversations.map(conv => conv.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // Combine the data
      const conversationsWithProfile = conversations.map(conv => {
        const profile = profiles?.find(p => p.user_id === conv.user_id);
        return {
          ...conv,
          user_profile: profile || {
            first_name: 'Unknown',
            last_name: 'User',
            email: 'unknown@example.com'
          }
        };
      });

      setConversations(conversationsWithProfile);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]); // Set empty array instead of showing error for now
    }
  };

  const fetchConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setConversationMessages((data || []) as SupportMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
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
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          sender_type: 'admin',
          message: newMessage,
        });

      if (error) throw error;

      setNewMessage("");
      fetchConversationMessages(selectedConversation);

      toast({
        title: "Message sent",
        description: "Reply sent to customer",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!loading && user) {
      checkAdminAccess();
      fetchUsers();
      fetchConversations();
      setIsLoading(false); // Set loading to false after initial data fetch
    }
  }, [user, loading, navigate, toast]);

  // Subscribe to real-time presence updates
  useEffect(() => {
    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
        },
        () => {
          fetchUsers(); // Refresh users when presence changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Subscribe to new conversations and messages
  useEffect(() => {
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
        },
        (payload) => {
          if (payload.new.conversation_id === selectedConversation) {
            fetchConversationMessages(selectedConversation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedConversation]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const onlineUsers = users.filter(user => user.is_online).length;
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlineUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="balance">Balance Control</TabsTrigger>
            <TabsTrigger value="support">Customer Support</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Real-time user status and account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
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
                <CardDescription>Modify account balances for users</CardDescription>
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

          <TabsContent value="support" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversations List */}
              <Card>
                <CardHeader>
                  <CardTitle>Support Conversations</CardTitle>
                  <CardDescription>
                    Active customer support conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {conversations.map(conversation => (
                        <div
                          key={conversation.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                            selectedConversation === conversation.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => {
                            setSelectedConversation(conversation.id);
                            fetchConversationMessages(conversation.id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {conversation.user_profile.first_name} {conversation.user_profile.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {conversation.user_profile.email}
                              </div>
                            </div>
                            <Badge variant={conversation.status === 'open' ? 'default' : 'secondary'}>
                              {conversation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedConversation ? 'Customer Chat' : 'Select a Conversation'}
                  </CardTitle>
                  <CardDescription>
                    {selectedConversation ? 'Respond to customer messages' : 'Choose a conversation to start chatting'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedConversation ? (
                    <div className="space-y-4">
                      <ScrollArea className="h-64 border rounded p-3">
                        <div className="space-y-2">
                          {conversationMessages.map(message => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-2 text-sm ${
                                  message.sender_type === 'admin'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <div className="font-medium text-xs mb-1">
                                  {message.sender_type === 'admin' ? 'Admin' : 'Customer'}
                                </div>
                                {message.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button onClick={sendMessage} className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Select a conversation to view messages
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;