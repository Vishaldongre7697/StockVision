import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SearchIcon, MicIcon, BellIcon, PlusIcon, 
  ChevronDownIcon, ChevronUpIcon, Trash2Icon, 
  StarIcon, StarHalfIcon, EyeIcon, EyeOffIcon, 
  TrendingUpIcon, TrendingDownIcon, 
  AlertCircleIcon, BarChart2Icon
} from '../components/IconUtility';
import { FlexContainer, TouchableComponent } from '../components/CrossPlatformComponents';
import { useMediaQuery } from 'react-responsive';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  signal: 'buy' | 'sell' | 'hold' | 'strong_buy' | 'strong_sell';
  newsImpact: 'positive' | 'negative' | 'neutral';
  aiConfidence: number;
}

interface IndexItem {
  name: string;
  value: string;
  change: string;
  percent: string;
}

interface StockItemProps {
  item: Stock;
}

interface IndexCardProps {
  item: IndexItem;
}

interface TrendingStockProps {
  item: Stock;
}

export default function WatchlistScreen() {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: '1',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3580.45,
      change: 25.30,
      percentChange: 0.71,
      volume: 2456789,
      signal: 'buy',
      newsImpact: 'positive',
      aiConfidence: 85
    },
    {
      id: '2',
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      price: 2890.75,
      change: -15.20,
      percentChange: -0.52,
      volume: 3245678,
      signal: 'hold',
      newsImpact: 'neutral',
      aiConfidence: 68
    },
    {
      id: '3',
      symbol: 'INFY',
      name: 'Infosys',
      price: 1650.30,
      change: 42.80,
      percentChange: 2.66,
      volume: 1876543,
      signal: 'strong_buy',
      newsImpact: 'positive',
      aiConfidence: 92
    },
    {
      id: '4',
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      price: 1580.65,
      change: -28.40,
      percentChange: -1.77,
      volume: 2134567,
      signal: 'sell',
      newsImpact: 'negative',
      aiConfidence: 75
    }
  ]);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  
  // Market indices data
  const indices: IndexItem[] = [
    { name: 'NIFTY 50', value: '22,162.95', change: '+143.40', percent: '+0.65%' },
    { name: 'SENSEX', value: '72,651.21', change: '+535.25', percent: '+0.74%' },
    { name: 'BANKNIFTY', value: '47,293.55', change: '-124.65', percent: '-0.26%' }
  ];

  // Filter stocks based on search query
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSignalColor = (signal: Stock['signal']) => {
    switch (signal) {
      case 'buy': return 'text-green-500';
      case 'strong_buy': return 'text-emerald-600';
      case 'sell': return 'text-red-500';
      case 'strong_sell': return 'text-red-600';
      default: return 'text-yellow-500'; // hold
    }
  };

  const getNewsImpactColor = (impact: Stock['newsImpact']) => {
    switch (impact) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500'; // neutral
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      setSearchQuery('');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would update this in a global context or local storage
  };

  const handleNotificationBell = () => {
    // In a real app, this would show notifications
    alert('Notifications functionality would be shown here');
  };

  const handleExpand = (stockId: string) => {
    if (expandedStock === stockId) {
      setExpandedStock(null);
    } else {
      setExpandedStock(stockId);
    }
  };

  const handleAddStock = () => {
    // In a real app, this would open a modal or navigate to add stocks
    alert('Add stock functionality would be shown here');
  };

  const handleDelete = (stockId: string) => {
    setStocks(stocks.filter(stock => stock.id !== stockId));
  };

  const renderStockItem = ({ item }: StockItemProps) => {
    const isExpanded = expandedStock === item.id;
    
    return (
      <motion.div 
        layout
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-3"
        key={item.id}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{item.symbol}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.name}</span>
            </div>
            <div className="flex items-baseline mt-1">
              <p className="text-xl font-bold mr-2">₹{item.price.toFixed(2)}</p>
              <span className={`${item.change >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.percentChange.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.signal === 'buy' || item.signal === 'strong_buy' 
                ? 'bg-green-100 text-green-800' 
                : item.signal === 'sell' || item.signal === 'strong_sell'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {item.signal.toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              AI Confidence: {item.aiConfidence}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Vol: {(item.volume / 1000000).toFixed(2)}M
            </span>
            <span className={`ml-2 flex items-center text-sm ${getNewsImpactColor(item.newsImpact)}`}>
              {item.newsImpact === 'positive' ? (
                <TrendingUpIcon className="w-3 h-3 mr-1" />
              ) : item.newsImpact === 'negative' ? (
                <TrendingDownIcon className="w-3 h-3 mr-1" />
              ) : null}
              News: {item.newsImpact.charAt(0).toUpperCase() + item.newsImpact.slice(1)}
            </span>
          </div>
          
          <button 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={() => handleExpand(item.id)}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Technical Analysis</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>RSI (14)</span>
                    <span>65.4</span>
                  </li>
                  <li className="flex justify-between">
                    <span>MACD</span>
                    <span className="text-green-500">Bullish</span>
                  </li>
                  <li className="flex justify-between">
                    <span>20 Day MA</span>
                    <span>{(item.price * 0.97).toFixed(2)}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">AI Prediction</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>1-Week Target:</span>
                    <span className="font-medium">{(item.price * 1.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>1-Month Target:</span>
                    <span className="font-medium">{(item.price * 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.aiConfidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <BarChart2Icon className="w-5 h-5 text-blue-500" />
              </button>
              <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <AlertCircleIcon className="w-5 h-5 text-yellow-500" />
              </button>
              <button 
                className="p-2 bg-red-100 dark:bg-red-900 rounded-full"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2Icon className="w-5 h-5 text-red-500 dark:text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };
  
  const renderIndexCard = ({ item }: IndexCardProps) => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm" key={item.name}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.name}</p>
      <p className="text-xl font-bold mt-1">{item.value}</p>
      <p className={`text-sm font-medium ${
        item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
      }`}>
        {item.change} ({item.percent})
      </p>
    </div>
  );
  
  const renderTrendingStock = ({ item }: TrendingStockProps) => (
    <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 w-40" key={item.symbol}>
      <div className="flex justify-between items-start">
        <span className="font-bold">{item.symbol}</span>
        {item.percentChange >= 0 ? (
          <TrendingUpIcon className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDownIcon className="w-4 h-4 text-red-500" />
        )}
      </div>
      <p className="mt-1 text-lg font-bold">₹{item.price.toFixed(2)}</p>
      <p className={`text-xs font-medium ${
        item.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
      </p>
    </div>
  );
  
  const renderSwipeableActions = () => {
    return (
      <FlexContainer className="flex-row">
        <TouchableComponent
          onPress={() => {/* Add alert functionality */}}
          className="bg-yellow-400 p-3 mr-1 rounded"
        >
          <AlertCircleIcon size={20} color="#000" />
        </TouchableComponent>
        <TouchableComponent
          onPress={() => {/* Delete functionality */}}
          className="bg-red-500 p-3 rounded"
        >
          <Trash2Icon size={20} color="#FFF" />
        </TouchableComponent>
      </FlexContainer>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Watchlist</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SearchIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleNotificationBell}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <EyeIcon className="w-5 h-5 text-gray-300" />
              ) : (
                <EyeOffIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Search Input */}
        {searchVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pr-8 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
              />
              <div className="absolute right-2 top-2 text-gray-400">
                <MicIcon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="p-4">
        {/* Market Indices */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Market Indices</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {indices.map(index => renderIndexCard({ item: index }))}
          </div>
        </section>
        
        {/* Trending Stocks */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2">Trending Stocks</h2>
          <div className="flex overflow-x-auto pb-2 gap-3">
            {stocks.map(stock => renderTrendingStock({ item: stock }))}
          </div>
        </section>
        
        {/* Watchlist */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Your Watchlist</h2>
            <button
              onClick={handleAddStock}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              <span>Add</span>
            </button>
          </div>
          
          {filteredStocks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No stocks found. Try a different search or add new stocks to your watchlist.
              </p>
            </div>
          ) : (
            <div>
              {filteredStocks.map(stock => renderStockItem({ item: stock }))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}