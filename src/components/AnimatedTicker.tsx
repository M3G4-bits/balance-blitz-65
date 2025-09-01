import { useEffect, useState } from "react";

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const mockData: TickerItem[] = [
  { symbol: "GBP/EUR", price: "1.1951", change: "▲", isPositive: true },
  { symbol: "GBP/USD", price: "1.29455", change: "▼", isPositive: false },
  { symbol: "GBP/AUD", price: "2.06562", change: "▲", isPositive: true },
  { symbol: "GBP/CAD", price: "1.85714", change: "▲", isPositive: true },
  { symbol: "GBP/NZD", price: "2.26481", change: "▲", isPositive: true },
  { symbol: "GBP/TRY", price: "49.1", change: "▼", isPositive: false },
  { symbol: "BTC/GBP", price: "78,450", change: "▲", isPositive: true },
  { symbol: "ETH/GBP", price: "2,890", change: "▼", isPositive: false },
];

export default function AnimatedTicker() {
  const [currentData, setCurrentData] = useState(mockData);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => 
        prev.map(item => ({
          ...item,
          // Simulate small price changes
          price: (parseFloat(item.price.replace(',', '')) * (0.995 + Math.random() * 0.01)).toFixed(item.price.includes('.') ? 5 : 0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
          isPositive: Math.random() > 0.5,
          change: Math.random() > 0.5 ? "▲" : "▼"
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/80 backdrop-blur-glass border-border">
      {/* Top ticker - Currency/Crypto rates */}
      <div className="border-b border-border px-2 py-1 overflow-hidden">
        <div className="flex space-x-6 text-xs text-muted-foreground whitespace-nowrap animate-scroll">
          {currentData.concat(currentData).map((item, index) => (
            <span key={`${item.symbol}-${index}`} className={item.isPositive ? "text-green-500" : "text-red-500"}>
              {item.symbol} = {item.price} {item.change}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom ticker - Promotional message */}
      <div className="px-2 py-1 overflow-hidden">
        <div className="flex text-xs text-primary whitespace-nowrap animate-scroll-slow">
          <span className="inline-block mr-12">
            USE CSB TODAY FOR YOUR CONVENIENCE, TRANSFER MONEY TO FRIENDS AND FAMILY
          </span>
          <span className="inline-block mr-12">
            USE CSB TODAY FOR YOUR CONVENIENCE, TRANSFER MONEY TO FRIENDS AND FAMILY
          </span>
          <span className="inline-block mr-12">
            USE CSB TODAY FOR YOUR CONVENIENCE, TRANSFER MONEY TO FRIENDS AND FAMILY
          </span>
        </div>
      </div>
    </div>
  );
}
