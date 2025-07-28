import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BankingProvider } from "./contexts/BankingContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Transfer from "./pages/Transfer";
import TransferConfirm from "./pages/TransferConfirm";
import TransferSuccess from "./pages/TransferSuccess";
import TransferFailure from "./pages/TransferFailure";
import Savings from "./pages/Savings";
import PayBills from "./pages/PayBills";
import Settings from "./pages/Settings";
import KYCStatus from "./pages/KYCStatus";
import VirtualCards from "./pages/VirtualCards";
import Auth from "./pages/Auth";
import MyAccount from "./pages/MyAccount";
import History from "./pages/History";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BankingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/transfer/confirm" element={<TransferConfirm />} />
              <Route path="/transfer/success" element={<TransferSuccess />} />
              <Route path="/transfer/failure" element={<TransferFailure />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/pay-bills" element={<PayBills />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/kyc-status" element={<KYCStatus />} />
              <Route path="/virtual-cards" element={<VirtualCards />} />
              <Route path="/history" element={<History />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BankingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
