import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '@/contexts/BankingContext';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const History = () => {
  const navigate = useNavigate();
  const { transactions, formatCurrency } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.recipient && t.recipient.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'income') {
        filtered = filtered.filter(t => t.amount > 0);
      } else if (filterType === 'expense') {
        filtered = filtered.filter(t => t.amount < 0);
      }
    }

    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (filterPeriod) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = subDays(now, 7);
          break;
        case 'month':
          startDate = startOfMonth(now);
          break;
        case '3months':
          startDate = subDays(now, 90);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(t => t.date >= startDate);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const filteredTransactions = filterTransactions();

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Type', 'Recipient'].join(','),
      ...filteredTransactions.map(t => [
        format(t.date, 'yyyy-MM-dd'),
        `"${t.description}"`,
        t.amount,
        t.amount > 0 ? 'Income' : 'Expense',
        `"${t.recipient || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background bg-banking-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transaction History</h1>
            <p className="text-muted-foreground">View and manage your transaction history</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportTransactions} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground">{filteredTransactions.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-success-green">
                  {formatCurrency(filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found matching your filters.</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-secondary/50 gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        transaction.amount > 0 
                          ? 'bg-success-green/20' 
                          : 'bg-destructive/20'
                      }`}>
                        {transaction.amount > 0 ? (
                          <ArrowDownLeft className="h-4 w-4 text-success-green" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {transaction.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm text-muted-foreground">
                          <span>{format(transaction.date, 'MMM dd, yyyy')}</span>
                          {transaction.recipient && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate">To: {transaction.recipient}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold text-right flex-shrink-0 ${
                      transaction.amount > 0 
                        ? 'text-success-green' 
                        : 'text-destructive'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;