import { 
  Settings, 
  User, 
  DollarSign, 
  History, 
  Shield, 
  HeadphonesIcon,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBanking } from "@/contexts/BankingContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "My Account", url: "/my-account", icon: User },
  { title: "Account Summary", url: "/account-summary", icon: DollarSign },
  { title: "History", url: "/history", icon: History },
  { title: "KYC Status", url: "/kyc-status", icon: Shield },
  { title: "Support", url: "/support", icon: HeadphonesIcon },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut, user } = useAuth();
  const { balance } = useBanking();
  const location = useLocation();
  const currentPath = location.pathname;
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium rounded-lg" : "hover:bg-muted/50 rounded-lg";

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      collapsible="icon"
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <SidebarContent>
        {/* Profile Section */}
        {state !== "collapsed" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="flex items-center gap-3 p-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfile?.avatar_url || ""} />
                  <AvatarFallback>{userProfile?.display_name?.charAt(0) || 'G'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userProfile?.display_name || 'Guest'}</span>
                  <span className="text-xs text-muted-foreground">Account: {userProfile?.account_number || 'N/A'}</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              {state !== "collapsed" && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {state !== "collapsed" && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            <p>© 2024 Credit Stirling Bank PLC</p>
            <p>All rights reserved</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}