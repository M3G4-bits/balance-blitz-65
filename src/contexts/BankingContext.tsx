import { createContext, useContext, useState, ReactNode } from "react";

interface Transaction {
  id: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  description: string;
  date: Date;
  recipient?: string;
}

interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
}

interface BankingContextType {
  balance: number;
  transactions: Transaction[];
  country: Country;
  setBalance: (balance: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setCountry: (country: Country) => void;
  formatCurrency: (amount: number) => string;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£' },
  { code: 'EU', name: 'European Union', currency: 'EUR', currencySymbol: '€' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦' },
];

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};

export const BankingProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(12547.83);
  const [country, setCountry] = useState<Country>(countries[0]); // Default to US
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "transfer",
      amount: -250.00,
      description: "Transfer to John Doe",
      date: new Date(2024, 6, 25),
      recipient: "John Doe"
    },
    {
      id: "2",
      type: "deposit",
      amount: 1200.00,
      description: "Salary Deposit",
      date: new Date(2024, 6, 24),
    },
    {
      id: "3",
      type: "payment",
      amount: -89.99,
      description: "Amazon Purchase",
      date: new Date(2024, 6, 23),
    }
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `TXN${Date.now()}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(country.code === 'US' ? 'en-US' : country.code === 'GB' ? 'en-GB' : 'en-EU', {
      style: 'currency',
      currency: country.currency,
    }).format(amount);
  };

  return (
    <BankingContext.Provider value={{
      balance,
      transactions,
      country,
      setBalance,
      addTransaction,
      setCountry,
      formatCurrency,
    }}>
      {children}
    </BankingContext.Provider>
  );
};

export { countries };