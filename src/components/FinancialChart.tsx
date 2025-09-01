import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data mimicking the EURUSD chart from the image
const generateChartData = () => {
  const data = [];
  let value = 1.16847;
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  
  months.forEach((month, index) => {
    // Simulate realistic forex movements
    const volatility = 0.002;
    const trend = index < 4 ? -0.0001 : 0.0002; // Down then up trend
    value += (Math.random() - 0.5) * volatility + trend;
    
    data.push({
      month,
      value: value,
      displayValue: value.toFixed(5)
    });
  });
  
  return data;
};

export const FinancialChart = () => {
  const data = generateChartData();
  const currentValue = data[data.length - 1]?.value || 1.16847;
  const change = currentValue - 1.16826; // Previous close
  const changePercent = (change / 1.16826) * 100;

  return (
    <Card className="bg-card/80 backdrop-blur-glass border-border shadow-glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">EU</span>
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">EURUSD</CardTitle>
              <p className="text-xs text-muted-foreground">EURO / U.S. DOLLAR</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {currentValue.toFixed(5)}
            </div>
            <div className={`text-sm ${change >= 0 ? 'text-success-green' : 'text-destructive'}`}>
              {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}% ({change >= 0 ? '+' : ''}{change.toFixed(5)})
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">EURUSD Rates</p>
        </div>
      </CardContent>
    </Card>
  );
};