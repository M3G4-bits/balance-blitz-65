import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BankingProvider } from "./contexts/BankingContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Transfer from "./pages/Transfer";
import TransferConfirm from "./pages/TransferConfirm";
import TransferSuccess from "./pages/TransferSuccess";
import Savings from "./pages/Savings";
import PayBills from "./pages/PayBills";
import Settings from "./pages/Settings";
import KYCStatus from "./pages/KYCStatus";
import VirtualCards from "./pages/VirtualCards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BankingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transfer/confirm" element={<TransferConfirm />} />
            <Route path="/transfer/success" element={<TransferSuccess />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/pay-bills" element={<PayBills />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/kyc-status" element={<KYCStatus />} />
            <Route path="/virtual-cards" element={<VirtualCards />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BankingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
