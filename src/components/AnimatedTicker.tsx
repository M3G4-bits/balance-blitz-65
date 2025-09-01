import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const AnimatedTicker = () => {
  const [tickerData] = useState<TickerItem[]>([
    { symbol: 'BTC/USD', price: '43,250.00', change: '+2.45%', isPositive: true },
    { symbol: 'ETH/USD', price: '2,650.50', change: '-1.23%', isPositive: false },
    { symbol: 'GBP/EUR', price: '1.1551', change: '+0.12%', isPositive: true },
    { symbol: 'GBP/AUD', price: '2.06562', change: '+0.87%', isPositive: true },
    { symbol: 'GBP/CAD', price: '1.85714', change: '-0.34%', isPositive: false },
    { symbol: 'AAPL', price: '195.32', change: '+1.78%', isPositive: true },
    { symbol: 'TSLA', price: '245.67', change: '-0.92%', isPositive: false },
    { symbol: 'NVDA', price: '875.21', change: '+3.45%', isPositive: true },
  ]);

  return (
    <div className="w-full bg-muted/20 backdrop-blur-sm border-y border-border/50">
      {/* Top Ticker */}
      <div className="relative overflow-hidden h-10 flex items-center">
        <div className="animate-[scroll-left_60s_linear_infinite] flex items-center space-x-8 whitespace-nowrap">
          {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-foreground">{item.symbol}</span>
              <span className="text-muted-foreground">{item.price}</span>
              <div className={`flex items-center space-x-1 ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {item.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="font-medium">{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Animated Text */}
      <div className="relative overflow-hidden h-8 flex items-center bg-primary/5">
        <div className="animate-[scroll-right_45s_linear_infinite] flex items-center whitespace-nowrap">
          <span className="text-sm font-medium text-primary px-8">
            USE CSB TODAY FOR YOUR CONVENIENCE, TRANSFER MONEY TO FRIENDS AND FAMILY
          </span>
          <span className="text-sm font-medium text-primary px-8">
            USE CSB TODAY FOR YOUR CONVENIENCE, TRANSFER MONEY TO FRIENDS AND FAMILY
          </span>
          <span className="text-sm font-medium text-primary px-8">
            USE CSB TODAY FOR YOUR CONVENIENCE, TRANSFER MONEY TO FRIENDS AND FAMILY
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTicker;