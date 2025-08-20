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
  const [depositAmount, setDepositAmount] = useState("");
  const [balanceOperation, setBalanceOperation] = useState<"set" | "deposit">("deposit");
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // New states for enhanced deposit functionality
  const [customDate, setCustomDate] = useState("");
  const [customBank, setCustomBank] = useState("Admin Bank");
  const [customSender, setCustomSender] = useState("Admin Deposit");
  const [customDescription, setCustomDescription] = useState("Admin deposit");
  
  // Transfer settings state
  const [transferSettings, setTransferSettings] = useState<Record<string, boolean>>({});
  
  // Transaction editing state
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editTransactionForm, setEditTransactionForm] = useState({
    description: '',
    bank_name: '',
    recipient: '',
    created_at: ''
  });
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  // Code generation functions
  const generateTAC = (userId: string) => {
    // Generate consistent 6-character alphanumeric code based on userId
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 0; i < 6; i++) {
      result += chars[(seed + i) % chars.length];
    }
    return result;
  };

  const generateSecurityCode = (userId: string) => {
    // Generate consistent 6-character alphanumeric security code
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const seed = userId.split('').reverse().join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 0; i < 6; i++) {
      result += chars[(seed + i * 7) % chars.length];
    }
    return result;
  };

  const generateTIN = (userId: string) => {
    // Generate consistent 12-digit TIN based on userId
    const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += ((seed + i * 3) % 10).toString();
    }
    return result;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

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
    console.log('Admin: Starting to fetch users...');
    try {
      // Fetch profiles
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

      console.log('Admin: Profiles data:', profiles);
      if (profilesError) {
        console.error('Admin: Profiles error:', profilesError);
        throw profilesError;
      }

      // Fetch balances
      const { data: balances, error: balancesError } = await supabase
        .from('user_balances')
        .select('user_id, balance');

      console.log('Admin: Balances data:', balances);
      if (balancesError) {
        console.error('Admin: Balances error:', balancesError);
        throw balancesError;
      }

      // Fetch presence - create records if they don't exist
      const { data: presence, error: presenceError } = await supabase
        .from('user_presence')
        .select('user_id, is_online');

      console.log('Admin: Presence data:', presence);
      if (presenceError) {
        console.error('Admin: Presence error:', presenceError);
        throw presenceError;
      }

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

      console.log('Admin: Final users data:', usersWithBalances);
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
      // First get conversations - use simpler query since admin can see all
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

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        // Continue with conversations even if profiles fail
      }

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

  const depositToUserAccount = async () => {
    if (!selectedUser || !depositAmount || !selectedUser.account_number) {
      toast({
        title: "Error",
        description: "Please select a user and enter a deposit amount.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the date parameter
      const depositDate = customDate ? new Date(customDate).toISOString() : new Date().toISOString();
      
      const { data, error } = await supabase.rpc('admin_deposit', {
        target_account_number: selectedUser.account_number,
        deposit_amount: parseFloat(depositAmount),
        admin_user_id: user?.id,
        custom_date: depositDate,
        custom_bank: customBank,
        custom_sender: customSender,
        custom_description: customDescription
      });

      if (error) throw error;

      // Parse the JSON response
      const result = data as any;
      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: `Deposited $${depositAmount} to ${selectedUser.first_name}'s account. New balance: $${result?.new_balance || 'Updated'}`,
      });

      setDepositAmount("");
      setCustomDate("");
      setCustomBank("Admin Bank");
      setCustomSender("Admin Deposit");
      setCustomDescription("Admin deposit");
      fetchUsers();
    } catch (error) {
      console.error('Error depositing funds:', error);
      toast({
        title: "Error",
        description: "Failed to deposit funds.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransferSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_transfer_settings')
        .select('user_id, force_success');

      if (error) throw error;

      const settings: Record<string, boolean> = {};
      data?.forEach(setting => {
        settings[setting.user_id] = setting.force_success;
      });
      setTransferSettings(settings);
    } catch (error) {
      console.error('Error fetching transfer settings:', error);
    }
  };

  const updateTransferSetting = async (userId: string, forceSuccess: boolean) => {
    try {
      // Check if a setting already exists for this user
      const { data: existing, error: selectError } = await supabase
        .from('admin_transfer_settings')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing?.id) {
        // Update existing row
        const { error: updateError } = await supabase
          .from('admin_transfer_settings')
          .update({
            force_success: forceSuccess,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        // Insert new row
        const { error: insertError } = await supabase
          .from('admin_transfer_settings')
          .insert({
            user_id: userId,
            force_success: forceSuccess,
          });
        if (insertError) throw insertError;
      }

      setTransferSettings(prev => ({
        ...prev,
        [userId]: forceSuccess,
      }));

      toast({
        title: "Success",
        description: `Transfer setting updated to ${forceSuccess ? 'Force Success' : 'Force Failure'}`,
      });
    } catch (error) {
      console.error('Error updating transfer setting:', error);
      toast({
        title: "Error",
        description: "Failed to update transfer setting",
        variant: "destructive",
      });
    }
  };

  const removeTransferSetting = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_transfer_settings')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setTransferSettings(prev => {
        const newSettings = { ...prev };
        delete newSettings[userId];
        return newSettings;
      });

      toast({
        title: "Success",
        description: `Transfer setting updated for user`,
      });
    } catch (error) {
      console.error('Error updating transfer setting:', error);
      toast({
        title: "Error",
        description: "Failed to update transfer setting.",
        variant: "destructive"
      });
    }
  };

  const fetchUserTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const editTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setEditTransactionForm({
      description: transaction.description || '',
      bank_name: transaction.bank_name || '',
      recipient: transaction.recipient || '',
      created_at: new Date(transaction.created_at).toISOString().slice(0, 16)
    });
  };

  const updateTransaction = async () => {
    if (!editingTransaction) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          description: editTransactionForm.description,
          bank_name: editTransactionForm.bank_name,
          recipient: editTransactionForm.recipient,
          created_at: new Date(editTransactionForm.created_at).toISOString()
        })
        .eq('id', editingTransaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      setEditingTransaction(null);
      setEditTransactionForm({
        description: '',
        bank_name: '',
        recipient: '',
        created_at: ''
      });

      // Refresh transactions for selected user
      if (selectedUser) {
        fetchUserTransactions(selectedUser.user_id);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
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
    const initData = async () => {
      if (!loading && user) {
        await checkAdminAccess();
        await fetchUsers();
        await fetchConversations();
        await fetchTransferSettings();
        setIsLoading(false);
      }
    };
    initData();
  }, [user, loading]);

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
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto gap-2 sm:grid sm:grid-cols-5">
            <TabsTrigger value="users" className="shrink-0">User Management</TabsTrigger>
            <TabsTrigger value="balance" className="shrink-0">Balance Control</TabsTrigger>
            <TabsTrigger value="transfers" className="shrink-0">Transfer Control</TabsTrigger>
            <TabsTrigger value="transactions" className="shrink-0">Transaction Manager</TabsTrigger>
            <TabsTrigger value="support" className="shrink-0">Customer Support</TabsTrigger>
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
                <CardTitle>Balance Management</CardTitle>
                <CardDescription>Deposit funds or set user account balances</CardDescription>
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
                      <p><strong>Account Number:</strong> {selectedUser.account_number}</p>
                      <p><strong>Current Balance:</strong> ${selectedUser.balance.toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Operation Type</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={balanceOperation === "deposit" ? "default" : "outline"}
                          onClick={() => setBalanceOperation("deposit")}
                          className="flex-1"
                        >
                          Deposit Money
                        </Button>
                        <Button
                          variant={balanceOperation === "set" ? "default" : "outline"}
                          onClick={() => setBalanceOperation("set")}
                          className="flex-1"
                        >
                          Set Balance
                        </Button>
                      </div>
                    </div>

                     {balanceOperation === "deposit" ? (
                       <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label htmlFor="depositAmount">Deposit Amount</Label>
                             <Input
                               id="depositAmount"
                               type="number"
                               placeholder="0.00"
                               value={depositAmount}
                               onChange={(e) => setDepositAmount(e.target.value)}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="customDate">Transaction Date</Label>
                             <Input
                               id="customDate"
                               type="datetime-local"
                               value={customDate}
                               onChange={(e) => setCustomDate(e.target.value)}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="customBank">Bank Name</Label>
                             <Input
                               id="customBank"
                               type="text"
                               value={customBank}
                               onChange={(e) => setCustomBank(e.target.value)}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="customSender">Sender Name</Label>
                             <Input
                               id="customSender"
                               type="text"
                               value={customSender}
                               onChange={(e) => setCustomSender(e.target.value)}
                             />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="customDescription">Description</Label>
                           <Input
                             id="customDescription"
                             type="text"
                             value={customDescription}
                             onChange={(e) => setCustomDescription(e.target.value)}
                           />
                         </div>
                         <Button 
                           onClick={depositToUserAccount} 
                           disabled={isLoading}
                           className="w-full"
                         >
                           {isLoading ? "Processing..." : "Deposit Funds"}
                         </Button>
                       </div>
                    ) : (
                      <div className="space-y-4">
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
                          {isLoading ? "Updating..." : "Set Balance"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
              <CardHeader>
                <CardTitle>Transfer Success Control</CardTitle>
                <CardDescription>Control whether user transfers succeed or fail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">Account: {user.account_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={transferSettings[user.user_id] === true ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateTransferSetting(user.user_id, true)}
                          >
                            Success Mode
                          </Button>
                          <Button
                            variant={transferSettings[user.user_id] === false ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => updateTransferSetting(user.user_id, false)}
                          >
                            Failure Mode
                          </Button>
                          <Button
                            variant={transferSettings[user.user_id] === undefined ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => removeTransferSetting(user.user_id)}
                          >
                            Reset
                          </Button>
                          <Badge variant={transferSettings[user.user_id] === true ? "default" : transferSettings[user.user_id] === false ? "destructive" : "secondary"}>
                            {transferSettings[user.user_id] === true ? "Success" : transferSettings[user.user_id] === false ? "Failure" : "Random"}
                          </Badge>
                        </div>
                      </div>
                      
                      {transferSettings[user.user_id] === false && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-3 border-t border-border/50">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">TAC Code</label>
                            <div className="flex items-center space-x-2">
                              <code className="bg-muted p-2 rounded text-sm font-mono select-all flex-1">
                                {generateTAC(user.user_id)}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(generateTAC(user.user_id), "TAC code")}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Security Code</label>
                            <div className="flex items-center space-x-2">
                              <code className="bg-muted p-2 rounded text-sm font-mono select-all flex-1">
                                {generateSecurityCode(user.user_id)}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(generateSecurityCode(user.user_id), "Security code")}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">TIN Number</label>
                            <div className="flex items-center space-x-2">
                              <code className="bg-muted p-2 rounded text-sm font-mono select-all flex-1">
                                {generateTIN(user.user_id)}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(generateTIN(user.user_id), "TIN number")}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
              <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>Edit existing user transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select User</Label>
                  <select 
                    className="w-full p-2 rounded border"
                    onChange={(e) => {
                      const user = users.find(u => u.id === e.target.value);
                      setSelectedUser(user || null);
                      if (user) {
                        fetchUserTransactions(user.user_id);
                      } else {
                        setUserTransactions([]);
                      }
                    }}
                  >
                    <option value="">Choose a user to view transactions...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} - {user.account_number}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedUser && userTransactions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Transactions for {selectedUser.first_name} {selectedUser.last_name}</h3>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {userTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1 space-y-1">
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                Amount: ${transaction.amount} | Date: {new Date(transaction.created_at).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Bank: {transaction.bank_name || 'N/A'} | From: {transaction.recipient || 'N/A'}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editTransaction(transaction)}
                            >
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {selectedUser && userTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found for this user
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Transaction Modal */}
            {editingTransaction && (
              <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
                <CardHeader>
                  <CardTitle>Edit Transaction</CardTitle>
                  <CardDescription>Modify transaction details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p><strong>Transaction ID:</strong> {editingTransaction.id}</p>
                    <p><strong>Amount:</strong> ${editingTransaction.amount}</p>
                    <p><strong>Type:</strong> {editingTransaction.type}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editDescription">Description</Label>
                      <Input
                        id="editDescription"
                        type="text"
                        value={editTransactionForm.description}
                        onChange={(e) => setEditTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editBankName">Bank Name</Label>
                      <Input
                        id="editBankName"
                        type="text"
                        value={editTransactionForm.bank_name}
                        onChange={(e) => setEditTransactionForm(prev => ({ ...prev, bank_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editRecipient">Sender/Recipient</Label>
                      <Input
                        id="editRecipient"
                        type="text"
                        value={editTransactionForm.recipient}
                        onChange={(e) => setEditTransactionForm(prev => ({ ...prev, recipient: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editDate">Transaction Date</Label>
                      <Input
                        id="editDate"
                        type="datetime-local"
                        value={editTransactionForm.created_at}
                        onChange={(e) => setEditTransactionForm(prev => ({ ...prev, created_at: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={updateTransaction} 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Updating..." : "Update Transaction"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEditingTransaction(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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