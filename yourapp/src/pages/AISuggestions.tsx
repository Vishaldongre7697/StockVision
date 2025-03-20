"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Mic, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"

// Mock data
const mockStockData = [
  {
    id: "1",
    name: "Reliance Industries",
    symbol: "RELIANCE",
    price: 2750.45,
    change: 2.34,
    recommendation: "Buy",
    confidence: 85,
    predictedRange: {
      min: 2700,
      max: 2950,
    },
    fundamentals: {
      fiiFlow: 234.5,
      diiFlow: 156.8,
      blockDeal: "Yes",
      revenue: 7920,
    },
    technical: {
      rsi: "65.4",
      sma: "2680.25",
      ema: "2710.50",
      volume: "High Buy",
    },
  },
  {
    id: "2",
    name: "Tata Consultancy Services",
    symbol: "TCS",
    price: 3450.75,
    change: -0.87,
    recommendation: "Hold",
    confidence: 65,
    predictedRange: {
      min: 3350,
      max: 3550,
    },
    fundamentals: {
      fiiFlow: -120.3,
      diiFlow: 89.5,
      blockDeal: "No",
      revenue: 5640,
    },
    technical: {
      rsi: "48.2",
      sma: "3480.10",
      ema: "3460.75",
      volume: "Moderate",
    },
  },
  {
    id: "3",
    name: "HDFC Bank",
    symbol: "HDFCBANK",
    price: 1680.3,
    change: 1.25,
    recommendation: "Buy",
    confidence: 78,
    predictedRange: {
      min: 1650,
      max: 1750,
    },
    fundamentals: {
      fiiFlow: 178.2,
      diiFlow: 145.6,
      blockDeal: "Yes",
      revenue: 4230,
    },
    technical: {
      rsi: "62.8",
      sma: "1650.45",
      ema: "1670.20",
      volume: "High Buy",
    },
  },
  {
    id: "4",
    name: "Infosys",
    symbol: "INFY",
    price: 1450.6,
    change: -1.45,
    recommendation: "Sell",
    confidence: 72,
    predictedRange: {
      min: 1380,
      max: 1480,
    },
    fundamentals: {
      fiiFlow: -98.5,
      diiFlow: -45.2,
      blockDeal: "No",
      revenue: 3560,
    },
    technical: {
      rsi: "38.5",
      sma: "1480.30",
      ema: "1460.15",
      volume: "High Sell",
    },
  },
  {
    id: "5",
    name: "Bharti Airtel",
    symbol: "BHARTIARTL",
    price: 875.25,
    change: 0.95,
    recommendation: "Hold",
    confidence: 60,
    predictedRange: {
      min: 850,
      max: 910,
    },
    fundamentals: {
      fiiFlow: 56.8,
      diiFlow: 78.3,
      blockDeal: "No",
      revenue: 2840,
    },
    technical: {
      rsi: "52.4",
      sma: "870.15",
      ema: "880.50",
      volume: "Moderate",
    },
  },
]

const trendingStocks = [
  {
    id: "t1",
    symbol: "TATASTEEL",
    price: 145.75,
    change: 3.25,
    volume: 15000000,
  },
  {
    id: "t2",
    symbol: "ICICIBANK",
    price: 960.3,
    change: 1.85,
    volume: 8500000,
  },
  {
    id: "t3",
    symbol: "SBIN",
    price: 625.45,
    change: 2.1,
    volume: 12000000,
  },
  {
    id: "t4",
    symbol: "ADANIENT",
    price: 2450.8,
    change: -1.75,
    volume: 5600000,
  },
  {
    id: "t5",
    symbol: "HCLTECH",
    price: 1280.6,
    change: 0.85,
    volume: 3200000,
  },
  {
    id: "t6",
    symbol: "WIPRO",
    price: 420.35,
    change: -0.65,
    volume: 4800000,
  },
  {
    id: "t7",
    symbol: "SUNPHARMA",
    price: 1150.9,
    change: 1.45,
    volume: 2900000,
  },
  {
    id: "t8",
    symbol: "BAJFINANCE",
    price: 7250.25,
    change: 2.8,
    volume: 1800000,
  },
]

// Utility function to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

// StockCard Component
const StockCard = ({ stock }: { stock: any }) => {
  const [expanded, setExpanded] = useState(false)

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case "buy":
        return "bg-green-500 hover:bg-green-600"
      case "sell":
        return "bg-red-500 hover:bg-red-600"
      case "hold":
        return "bg-amber-500 hover:bg-amber-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500"
    if (confidence >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  const getVolumeColor = (volume: string) => {
    if (volume.toLowerCase().includes("high buy")) return "bg-green-500"
    if (volume.toLowerCase().includes("high sell")) return "bg-red-500"
    return "bg-amber-500"
  }

  return (
    <div className="overflow-hidden transition-all duration-300 hover:shadow-md rounded-lg border border-border bg-card text-card-foreground shadow mb-4">
      <div className="p-0">
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{stock.name}</h3>
            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
          </div>

          <div className="flex flex-col items-end mx-4">
            <p className="font-semibold text-lg">₹{stock.price.toLocaleString("en-IN")}</p>
            <p className={cn("text-sm font-medium", getPriceChangeColor(stock.change))}>
              {stock.change >= 0 ? "+" : ""}
              {stock.change}%{stock.change >= 0 ? " ▲" : " ▼"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span
              className={cn(
                "mb-2 px-3 py-1 text-white rounded-full text-xs font-semibold",
                getRecommendationColor(stock.recommendation),
              )}
            >
              {stock.recommendation}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {expanded && (
          <div className="p-4 border-t border-border animate-in fade-in-50 duration-300">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <span className="text-sm font-medium">{stock.confidence}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", getConfidenceColor(stock.confidence))}
                  style={{ width: `${stock.confidence}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Predicted Range:</span>
              <span className="text-sm font-medium">
                ₹{stock.predictedRange.min.toLocaleString("en-IN")} - ₹
                {stock.predictedRange.max.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Fundamental Data</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">FII Flow</p>
                  <p className={cn("font-medium", stock.fundamentals.fiiFlow > 0 ? "text-green-500" : "text-red-500")}>
                    {stock.fundamentals.fiiFlow > 0 ? "+" : ""}₹{stock.fundamentals.fiiFlow} Cr
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DII Flow</p>
                  <p className={cn("font-medium", stock.fundamentals.diiFlow > 0 ? "text-green-500" : "text-red-500")}>
                    {stock.fundamentals.diiFlow > 0 ? "+" : ""}₹{stock.fundamentals.diiFlow} Cr
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Block Deal</p>
                  <p className="font-medium">{stock.fundamentals.blockDeal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-medium">₹{stock.fundamentals.revenue.toLocaleString("en-IN")} Cr</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Technical Data</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">RSI</p>
                  <p className="font-medium">{stock.technical.rsi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SMA (50)</p>
                  <p className="font-medium">{stock.technical.sma}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">EMA (20)</p>
                  <p className="font-medium">{stock.technical.ema}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <div className="flex items-center">
                    <div className={cn("h-3 w-3 rounded-full mr-2", getVolumeColor(stock.technical.volume))} />
                    <p className="font-medium">{stock.technical.volume}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// TrendingStocksWidget Component
const TrendingStocksWidget = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll animation
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout
    let position = 0
    const scrollWidth = scrollRef.current?.scrollWidth || 0
    const clientWidth = scrollRef.current?.clientWidth || 0

    // Start auto-scrolling after a delay
    const timer = setTimeout(() => {
      scrollInterval = setInterval(() => {
        position += 1
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = position

          // Reset position if we've scrolled through most items
          if (position > scrollWidth - clientWidth) {
            position = 0
            scrollRef.current.scrollLeft = 0
          }
        }
      }, 30)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(scrollInterval)
    }
  }, [])

  // Helper to format volume numbers
  const formatVolume = (volume: number) => {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(2)}Cr`
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(2)}L`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`
    }
    return volume.toString()
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Trending Stocks</h2>
        <button className="text-primary flex items-center gap-1 bg-transparent hover:bg-muted px-2 py-1 rounded-md text-sm">
          View All
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollBehavior: "smooth" }}
      >
        {trendingStocks.map((stock) => (
          <div
            key={stock.id}
            className="min-w-[160px] mr-3 snap-start hover:shadow-md transition-shadow cursor-pointer rounded-lg border border-border bg-card text-card-foreground shadow"
          >
            <div className="p-4">
              <h3 className="font-bold text-lg">{stock.symbol}</h3>
              <p className="font-medium">₹{stock.price.toLocaleString("en-IN")}</p>

              <div className="flex items-center mt-2">
                <p className={cn("text-sm font-medium", stock.change >= 0 ? "text-green-500" : "text-red-500")}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%{stock.change >= 0 ? " ▲" : " ▼"}
                </p>
              </div>

              <p className="text-xs text-muted-foreground mt-2">Vol: {formatVolume(stock.volume)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main App Component
export default function AISuggestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStocks, setFilteredStocks] = useState(mockStockData)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")

  // Speech recognition setup
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      setIsListening(true)

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        setSearchQuery(speechResult)
        setTranscript(speechResult)
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert("Speech recognition is not supported in your browser. Try Chrome or Edge.")
    }
  }

  useEffect(() => {
    // Animation effect on load
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStocks(mockStockData)
    } else {
      const filtered = mockStockData.filter(
        (stock) =>
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredStocks(filtered)
    }
  }, [searchQuery])

  return (
    <main className="container max-w-5xl mx-auto px-4 py-6">
      <div
        className={`transition-all duration-700 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="🔍 Search suggestions..."
            className="w-full pl-10 pr-10 py-2 h-12 rounded-full bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className={`absolute inset-y-0 right-3 h-full flex items-center justify-center px-2 rounded-full ${isListening ? "text-primary" : "text-muted-foreground"}`}
            onClick={startListening}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              🤖 AI Suggestions
            </span>
          </h1>
        </div>

        <TrendingStocksWidget />

        <div className="mt-8 space-y-4">
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => <StockCard key={stock.id} stock={stock} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium">No stocks found for "{searchQuery}"</p>
              <p className="text-muted-foreground mt-2">Try searching for a different stock name or symbol</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx global>{`
        /* Base styles */
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 221.2 83.2% 53.3%;
          --radius: 0.5rem;
        }

        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 217.2 91.2% 59.8%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 224.3 76.3% 48%;
        }

        /* Tailwind-like utility classes */
        .container {
          width: 100%;
        }
        
        .bg-background {
          background-color: hsl(var(--background));
        }
        
        .text-foreground {
          color: hsl(var(--foreground));
        }
        
        .bg-card {
          background-color: hsl(var(--card));
        }
        
        .text-card-foreground {
          color: hsl(var(--card-foreground));
        }
        
        .border-border {
          border-color: hsl(var(--border));
        }
        
        .bg-primary {
          background-color: hsl(var(--primary));
        }
        
        .text-primary {
          color: hsl(var(--primary));
        }
        
        .bg-muted {
          background-color: hsl(var(--muted));
        }
        
        .text-muted-foreground {
          color: hsl(var(--muted-foreground));
        }
        
        /* Animation classes */
        .animate-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .fade-in-50 {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </main>
  )
}

// TypeScript declarations for the Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

