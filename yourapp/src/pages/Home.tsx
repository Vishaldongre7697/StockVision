import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Search, Mic, Plus, Eye, EyeOff, Settings, LogOut, 
  TrendingUp, Bell, AlertCircle, ChevronDown, ChevronUp,
  Volume2, Brain, DollarSign, BarChart3, ArrowRight
} from 'lucide-react';

// Types
type ListItemType = 'stock' | 'index' | null;
type VolumeAnalysis = 'High Buy' | 'High Sell' | 'Neutral';
type Indicator = 'BUY' | 'SELL' | 'HOLD';

interface Stock {
  id: string;
  name: string;
  price: string;
  change: string;
  percentChange: string;
  indicator: Indicator;
  aiConfidence: number;
  predictedRange: {
    min: string;
    max: string;
  };
  fiiDii: {
    fii: string;
    dii: string;
  };
  volumeAnalysis: VolumeAnalysis;
  blockDeals?: string[];
}

interface Index {
  id: string;
  name: string;
  price: string;
  change: string;
  percentChange: string;
}

interface TrendingStock {
  name: string;
  price: string;
  change: string;
  volume: 'High' | 'Medium' | 'Low';
  sentiment: number;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

const HomePage: React.FC = () => {
  const [showListModal, setShowListModal] = useState<{ type: ListItemType }>({ type: null });
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80"
  };

  const [indices, setIndices] = useState<Index[]>([
    {
      id: '1',
      name: 'NIFTY 50',
      price: '22,212.70',
      change: '+125.30',
      percentChange: '0.57%'
    },
    {
      id: '2',
      name: 'SENSEX',
      price: '73,158.24',
      change: '+417.87',
      percentChange: '0.58%'
    },
    {
      id: '3',
      name: 'BANK NIFTY',
      price: '46,751.15',
      change: '-213.25',
      percentChange: '-0.45%'
    }
  ]);

  const [watchlist, setWatchlist] = useState<Stock[]>([
    {
      id: '1',
      name: 'TCS',
      price: '4,012.55',
      change: '+45.80',
      percentChange: '1.15%',
      indicator: 'BUY',
      aiConfidence: 85,
      predictedRange: {
        min: '3,950',
        max: '4,150'
      },
      fiiDii: {
        fii: '+250',
        dii: '+150'
      },
      volumeAnalysis: 'High Buy',
      blockDeals: ['Morgan Stanley bought 2.5L shares', 'Goldman Sachs sold 1.8L shares']
    },
    {
      id: '2',
      name: 'Reliance',
      price: '2,957.85',
      change: '-23.45',
      percentChange: '-0.79%',
      indicator: 'SELL',
      aiConfidence: 78,
      predictedRange: {
        min: '2,900',
        max: '3,050'
      },
      fiiDii: {
        fii: '-180',
        dii: '+220'
      },
      volumeAnalysis: 'High Sell'
    }
  ]);

  const trendingStocks: TrendingStock[] = [
    { name: 'HDFC Bank', price: '1,678.45', change: '+2.5%', volume: 'High', sentiment: 0.8 },
    { name: 'Infosys', price: '1,567.30', change: '-1.2%', volume: 'Medium', sentiment: 0.4 },
    { name: 'Bharti Airtel', price: '876.25', change: '+3.1%', volume: 'High', sentiment: 0.9 }
  ];

  const marketSummary = {
    text: "Nifty 50 is showing strong momentum with a 1.2% gain, primarily driven by IT and Banking stocks. FIIs have net bought ₹1,200 Cr today. Market breadth remains positive with 2:1 advance-decline ratio.",
    sentiment: 'positive'
  };

  useEffect(() => {
    // Simulate notifications
    const timer = setInterval(() => {
      const randomStock = watchlist[Math.floor(Math.random() * watchlist.length)];
      setNotification(`${randomStock.name} just hit ₹${randomStock.price}! ${randomStock.change} today. AI suggests ${randomStock.indicator}.`);
      setTimeout(() => setNotification(null), 5000);
    }, 30000);

    return () => clearInterval(timer);
  }, [watchlist]);

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Implement voice recognition logic here
    setTimeout(() => setIsListening(false), 3000);
  };

  const handleAddItem = (item: Stock | Index) => {
    if ('indicator' in item) {
      setWatchlist(prev => [...prev, item]);
    } else {
      setIndices(prev => [...prev, item]);
    }
    setShowListModal({ type: null });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 text-gray-800 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md relative z-20">
        <div className="flex items-center gap-3">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full text-blue-500 relative"
            onClick={() => setShowProfilePanel(!showProfilePanel)}
          >
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-blue-500"
            />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search stocks..."
              className="pl-10 pr-12 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button 
              className={`absolute right-3 top-2.5 p-0.5 rounded-full ${isListening ? 'text-red-500' : 'text-gray-400'}`}
              onClick={handleVoiceSearch}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h1 className="text-xl font-bold text-black">Market Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Profile Panel */}
      <AnimatePresence>
        {showProfilePanel && (
          <motion.div
            className="absolute top-16 left-4 w-80 bg-white rounded-lg shadow-xl z-30 border border-gray-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="p-4">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full border-4 border-blue-500"
                />
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value="********"
                    className="w-full p-2 border rounded-lg pr-10"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button className="w-full p-2 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className="w-full p-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 hover:bg-red-100">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Market Summary */}
      <div className="mx-4 mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-500" />
          <h2 className="text-lg font-bold">AI Market Summary</h2>
          {marketSummary.sentiment === 'positive' ? '📈🔥' : '📉⚠️'}
        </div>
        <p className="mt-2 text-gray-600">{marketSummary.text}</p>
      </div>

      {/* Trending Stocks */}
      <div className="mx-4 mt-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold">Trending Stocks</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {trendingStocks.map(stock => (
            <div key={stock.name} className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-64">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{stock.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  stock.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stock.change}
                </span>
              </div>
              <p className="text-xl font-bold mt-2">₹{stock.price}</p>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-500">Volume: {stock.volume}</span>
                <span className="text-purple-600">AI Score: {stock.sentiment * 100}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Indices Section */}
      <section className="mb-8 px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Market Indices</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            onClick={() => setShowListModal({ type: 'index' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Index
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {indices.map(index => (
            <div key={index.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-black">{index.name}</h3>
              <p className="text-2xl font-bold text-black my-2">₹{index.price}</p>
              <span className={`px-3 py-1 rounded-full text-sm ${
                index.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {index.change} ({index.percentChange})
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Watchlist Section */}
      <section className="mb-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Your Watchlist</h2>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
            onClick={() => setShowListModal({ type: 'stock' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </button>
        </div>
        <div className="space-y-4">
          {watchlist.map(stock => (
            <motion.div 
              key={stock.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              animate={{ height: expandedStock === stock.id ? 'auto' : 'fit-content' }}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedStock(expandedStock === stock.id ? null : stock.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-black">{stock.name}</h3>
                    <p className="text-2xl font-bold text-black my-2">₹{stock.price}</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      stock.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stock.change} ({stock.percentChange})
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold block ${
                      stock.indicator === 'BUY' ? 'bg-green-100 text-green-800' :
                      stock.indicator === 'SELL' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {stock.indicator}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-purple-600 font-semibold">
                        AI Confidence
                      </div>
                      <div className="text-lg font-bold">
                        {stock.aiConfidence}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">
                      Predicted: ₹{stock.predictedRange.min} - ₹{stock.predictedRange.max}
                    </span>
                  </div>
                  {expandedStock === stock.id ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> :
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </div>

              {/* Expanded Content */}
              {expandedStock === stock.id && (
                <motion.div 
                  className="px-4 pb-4 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">FII/DII Data</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>FII</span>
                          <span className={stock.fiiDii.fii.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                            {stock.fiiDii.fii} Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>DII</span>
                          <span className={stock.fiiDii.dii.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                            {stock.fiiDii.dii} Cr
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">Volume Analysis</span>
                      </div>
                      <div className="text-sm">
                        <span className={`px-3 py-1 rounded-full ${
                          stock.volumeAnalysis === 'High Buy' ? 'bg-green-100 text-green-800' :
                          stock.volumeAnalysis === 'High Sell' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {stock.volumeAnalysis}
                        </span>
                      </div>
                    </div>
                  </div>

                  {stock.blockDeals && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold">Block Deals</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {stock.blockDeals.map((deal, index) => (
                          <li key={index} className="text-gray-600">• {deal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{notification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Modal */}
      {showListModal.type && (
        <ListModal
          type={showListModal.type}
          onClose={() => setShowListModal({ type: null })}
          onAddItem={handleAddItem}
        />
      )}
    </motion.div>
  );
};

// ListModal Component (same as before)
const ListModal: React.FC<{
  type: ListItemType;
  onClose: () => void;
  onAddItem: (item: Stock | Index) => void;
}> = ({ type, onClose, onAddItem }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const dummyItems = type === 'stock' 
    ? [
        { 
          id: '3', 
          name: 'HDFC Bank', 
          price: '1,456.30', 
          change: '+12.45', 
          percentChange: '0.86%', 
          indicator: 'BUY' as const,
          aiConfidence: 82,
          predictedRange: {
            min: '1,400',
            max: '1,500'
          },
          fiiDii: {
            fii: '+150',
            dii: '+80'
          },
          volumeAnalysis: 'High Buy' as const
        },
        { 
          id: '4', 
          name: 'Infosys', 
          price: '1,567.85', 
          change: '-8.90', 
          percentChange: '-0.57%', 
          indicator: 'HOLD' as const,
          aiConfidence: 65,
          predictedRange: {
            min: '1,500',
            max: '1,600'
          },
          fiiDii: {
            fii: '-50',
            dii: '+120'
          },
          volumeAnalysis: 'Neutral' as const
        }
      ]
    : [
        { id: '4', name: 'NIFTY IT', price: '33,567.80', change: '+256.70', percentChange: '0.77%' },
        { id: '5', name: 'NIFTY BANK', price: '44,789.25', change: '-123.45', percentChange: '-0.28%' }
      ];

  const filteredItems = dummyItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div 
        className="relative w-full max-w-4xl bg-white rounded-t-2xl p-6 h-[70vh] flex flex-col shadow-xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
      >
        <h2 className="text-xl font-bold text-black mb-4">
          {type === 'stock' ? 'Top 50 Stocks' : 'Top 50 Indices'}
        </h2>
        
        <div className="relative mb-4">
          <input
            className="w-full p-2 bg-gray-100 rounded-lg text-black placeholder-gray-400 font-bold"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg">
              <div>
                <h3 className="font-bold text-black">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
              <button 
                className="p-2 hover:bg-blue-100 rounded-full text-blue-500"
                onClick={() => onAddItem(item)}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;