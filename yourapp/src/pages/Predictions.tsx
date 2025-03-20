import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Line, Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 220;

// Types
interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface IndicatorProps {
  name: string;
  value: string | number;
  status: 'neutral' | 'buy' | 'sell' | 'strong_buy' | 'strong_sell';
  info?: string;
}

interface FundamentalItemProps {
  title: string;
  value: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  info?: string;
}

// Chart Component
const ChartView = () => {
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle');

  // Mock data for chart
  const priceData = [2720, 2750, 2735, 2758, 2780, 2775, 2790, 2810, 2795, 2785, 2800];
  const predictedData = [2785, 2800, 2825, 2850, 2830];
  
  // Mock candle data
  const candleData: CandleData[] = [
    { date: '09:30', open: 2720, high: 2735, low: 2710, close: 2730 },
    { date: '09:45', open: 2730, high: 2755, low: 2728, close: 2750 },
    { date: '10:00', open: 2750, high: 2760, low: 2735, close: 2735 },
    { date: '10:15', open: 2735, high: 2765, low: 2730, close: 2758 },
    { date: '10:30', open: 2758, high: 2790, low: 2755, close: 2780 },
    { date: '10:45', open: 2780, high: 2785, low: 2768, close: 2775 },
    { date: '11:00', open: 2775, high: 2795, low: 2770, close: 2790 },
    { date: '11:15', open: 2790, high: 2815, low: 2785, close: 2810 },
    { date: '11:30', open: 2810, high: 2815, low: 2792, close: 2795 },
    { date: '11:45', open: 2795, high: 2798, low: 2780, close: 2785 },
  ];

  // Support/Resistance levels
  const buyLevel = 2730;
  const sellLevel = 2850;
  const stopLoss = 2680;

  // Calculate min and max for chart scaling
  const allValues = [...priceData, ...predictedData, buyLevel, sellLevel, stopLoss];
  const minValue = Math.min(...allValues) - 20;
  const maxValue = Math.max(...allValues) + 20;
  const valueRange = maxValue - minValue;

  // Convert Y value from price to position on chart
  const getYPosition = (price: number) => {
    return CHART_HEIGHT - ((price - minValue) / valueRange) * CHART_HEIGHT;
  };

  // Line chart points
  const linePoints = priceData.map((price, index) => {
    const x = (index / (priceData.length - 1)) * CHART_WIDTH;
    const y = getYPosition(price);
    return `${x},${y}`;
  }).join(' ');

  // Prediction points
  const predictionPoints = [
    priceData[priceData.length - 1], 
    ...predictedData
  ].map((price, index) => {
    const x = ((priceData.length - 1 + index) / (priceData.length + predictedData.length - 1)) * CHART_WIDTH;
    const y = getYPosition(price);
    return `${x},${y}`;
  }).join(' ');

  // Render candle chart
  const renderCandleChart = () => {
    const candleWidth = CHART_WIDTH / (candleData.length + 2);
    
    return (
      <View style={styles.candleChartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = CHART_HEIGHT * ratio;
            const price = maxValue - (valueRange * ratio);
            return (
              <React.Fragment key={`grid-${index}`}>
                <Line
                  x1="0"
                  y1={y}
                  x2={CHART_WIDTH}
                  y2={y}
                  stroke="#E0E0E0"
                  strokeWidth="0.5"
                  strokeDasharray="5,5"
                />
                <Text
                  style={[
                    styles.gridLabel,
                    { position: 'absolute', left: 5, top: y - 10 }
                  ]}
                >
                  {price.toFixed(0)}
                </Text>
              </React.Fragment>
            );
          })}

          {/* Candles */}
          {candleData.map((candle, index) => {
            const x = (index + 1) * candleWidth;
            const open = getYPosition(candle.open);
            const close = getYPosition(candle.close);
            const high = getYPosition(candle.high);
            const low = getYPosition(candle.low);
            const isGreen = candle.close > candle.open;
            
            return (
              <React.Fragment key={`candle-${index}`}>
                {/* Wick */}
                <Line
                  x1={x + candleWidth / 2}
                  y1={high}
                  x2={x + candleWidth / 2}
                  y2={low}
                  stroke="#546E7A"
                  strokeWidth="1"
                />
                {/* Body */}
                <Svg x={x} y={isGreen ? close : open} width={candleWidth} height={Math.abs(close - open)}>
                  <View style={[
                    styles.candleBody,
                    {
                      backgroundColor: isGreen ? '#4CAF50' : '#F44336',
                      width: candleWidth,
                      height: '100%'
                    }
                  ]} />
                </Svg>
              </React.Fragment>
            );
          })}

          {/* Support/Resistance levels */}
          <Line
            x1="0"
            y1={getYPosition(buyLevel)}
            x2={CHART_WIDTH}
            y2={getYPosition(buyLevel)}
            stroke="#4CAF50"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <Circle
            cx="10"
            cy={getYPosition(buyLevel)}
            r="4"
            fill="#4CAF50"
          />
          <Line
            x1="0"
            y1={getYPosition(sellLevel)}
            x2={CHART_WIDTH}
            y2={getYPosition(sellLevel)}
            stroke="#F44336"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <Circle
            cx="10"
            cy={getYPosition(sellLevel)}
            r="4"
            fill="#F44336"
          />
          <Line
            x1="0"
            y1={getYPosition(stopLoss)}
            x2={CHART_WIDTH}
            y2={getYPosition(stopLoss)}
            stroke="#FF9800"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <Circle
            cx="10"
            cy={getYPosition(stopLoss)}
            r="4"
            fill="#FF9800"
          />
        </Svg>

        {/* Level labels */}
        <View style={[styles.levelLabel, { top: getYPosition(buyLevel) - 10, right: 10 }]}>
          <Text style={styles.levelLabelText}>Buy: ₹{buyLevel}</Text>
        </View>
        <View style={[styles.levelLabel, { top: getYPosition(sellLevel) - 10, right: 10 }]}>
          <Text style={styles.levelLabelText}>Sell: ₹{sellLevel}</Text>
        </View>
        <View style={[styles.levelLabel, { top: getYPosition(stopLoss) - 10, right: 10 }]}>
          <Text style={styles.levelLabelText}>Stop: ₹{stopLoss}</Text>
        </View>
      </View>
    );
  };

  // Render line chart
  const renderLineChart = () => {
    return (
      <View style={styles.lineChartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = CHART_HEIGHT * ratio;
            const price = maxValue - (valueRange * ratio);
            return (
              <React.Fragment key={`grid-${index}`}>
                <Line
                  x1="0"
                  y1={y}
                  x2={CHART_WIDTH}
                  y2={y}
                  stroke="#E0E0E0"
                  strokeWidth="0.5"
                  strokeDasharray="5,5"
                />
                <Text
                  style={[
                    styles.gridLabel,
                    { position: 'absolute', left: 5, top: y - 10 }
                  ]}
                >
                  {price.toFixed(0)}
                </Text>
              </React.Fragment>
            );
          })}

          {/* Area under line */}
          <Defs>
            <SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2196F3" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#2196F3" stopOpacity="0.0" />
            </SvgGradient>
          </Defs>
          <Path
            d={`M 0 ${getYPosition(priceData[0])} ${linePoints} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`}
            fill="url(#areaGradient)"
          />

          {/* Main line */}
          <Path
            d={`M 0 ${getYPosition(priceData[0])} ${linePoints}`}
            stroke="#2196F3"
            strokeWidth="2"
            fill="none"
          />

          {/* Prediction dotted line */}
          <Path
            d={`M ${((priceData.length - 1) / (priceData.length - 1)) * CHART_WIDTH} ${getYPosition(priceData[priceData.length - 1])} L ${CHART_WIDTH} ${getYPosition(predictedData[predictedData.length - 1])}`}
            stroke="#9C27B0"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Data points */}
          {priceData.map((price, index) => {
            const x = (index / (priceData.length - 1)) * CHART_WIDTH;
            const y = getYPosition(price);
            return (
              <Circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="3"
                fill="#2196F3"
              />
            );
          })}

          {/* Support/Resistance levels */}
          <Line
            x1="0"
            y1={getYPosition(buyLevel)}
            x2={CHART_WIDTH}
            y2={getYPosition(buyLevel)}
            stroke="#4CAF50"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <Circle
            cx="10"
            cy={getYPosition(buyLevel)}
            r="4"
            fill="#4CAF50"
          />
          <Line
            x1="0"
            y1={getYPosition(sellLevel)}
            x2={CHART_WIDTH}
            y2={getYPosition(sellLevel)}
            stroke="#F44336"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <Circle
            cx="10"
            cy={getYPosition(sellLevel)}
            r="4"
            fill="#F44336"
          />
          <Line
            x1="0"
            y1={getYPosition(stopLoss)}
            x2={CHART_WIDTH}
            y2={getYPosition(stopLoss)}
            stroke="#FF9800"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <Circle
            cx="10"
            cy={getYPosition(stopLoss)}
            r="4"
            fill="#FF9800"
          />
        </Svg>

        {/* Level labels */}
        <View style={[styles.levelLabel, { top: getYPosition(buyLevel) - 10, right: 10 }]}>
          <Text style={styles.levelLabelText}>Buy: ₹{buyLevel}</Text>
        </View>
        <View style={[styles.levelLabel, { top: getYPosition(sellLevel) - 10, right: 10 }]}>
          <Text style={styles.levelLabelText}>Sell: ₹{sellLevel}</Text>
        </View>
        <View style={[styles.levelLabel, { top: getYPosition(stopLoss) - 10, right: 10 }]}>
          <Text style={styles.levelLabelText}>Stop: ₹{stopLoss}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Price Chart</Text>
        <View style={styles.chartTypeButtons}>
          <TouchableOpacity 
            style={[styles.chartTypeButton, chartType === 'candle' && styles.activeChartTypeButton]}
            onPress={() => setChartType('candle')}
          >
            <MaterialIcons name="candlestick-chart" size={18} color={chartType === 'candle' ? "#2196F3" : "#90A4AE"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chartTypeButton, chartType === 'line' && styles.activeChartTypeButton]}
            onPress={() => setChartType('line')}
          >
            <Feather name="trending-up" size={18} color={chartType === 'line' ? "#2196F3" : "#90A4AE"} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        {chartType === 'candle' ? renderCandleChart() : renderLineChart()}
      </View>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Price</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#9C27B0' }]} />
          <Text style={styles.legendText}>AI Prediction</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Buy Level</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>Sell Level</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Stop Loss</Text>
        </View>
      </View>
      
      <View style={styles.timeframeContainer}>
        <TouchableOpacity style={[styles.timeframeButton, styles.activeTimeframeButton]}>
          <Text style={[styles.timeframeText, styles.activeTimeframeText]}>1D</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeframeButton}>
          <Text style={styles.timeframeText}>1W</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeframeButton}>
          <Text style={styles.timeframeText}>1M</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeframeButton}>
          <Text style={styles.timeframeText}>3M</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeframeButton}>
          <Text style={styles.timeframeText}>1Y</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Technical Indicators Component
const TechnicalIndicators = () => {
  const indicators: IndicatorProps[] = [
    {
      name: 'RSI',
      value: 58.3,
      status: 'neutral',
      info: 'Relative Strength Index'
    },
    {
      name: 'MACD',
      value: 'Bullish',
      status: 'buy',
      info: 'Moving Average Convergence Divergence'
    },
    {
      name: 'SMA 50',
      value: '₹2,678.25',
      status: 'buy',
      info: '50-day Simple Moving Average'
    },
    {
      name: 'SMA 200',
      value: '₹2,520.10',
      status: 'strong_buy',
      info: '200-day Simple Moving Average'
    },
    {
      name: 'Bollinger',
      value: 'Upper Band',
      status: 'sell',
      info: 'Bollinger Bands'
    },
    {
      name: 'Volume',
      value: '2.3M',
      status: 'strong_buy',
      info: 'Trading Volume'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'buy':
        return '#4CAF50';
      case 'strong_buy':
        return '#00C853';
      case 'sell':
        return '#F44336';
      case 'strong_sell':
        return '#D50000';
      default:
        return '#FFC107';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'buy':
        return <FontAwesome5 name="arrow-up" size={12} color="#4CAF50" />;
      case 'strong_buy':
        return <MaterialCommunityIcons name="arrow-up-bold" size={14} color="#00C853" />;
      case 'sell':
        return <FontAwesome5 name="arrow-down" size={12} color="#F44336" />;
      case 'strong_sell':
        return <MaterialCommunityIcons name="arrow-down-bold" size={14} color="#D50000" />;
      default:
        return <MaterialCommunityIcons name="arrow-right" size={14} color="#FFC107" />;
    }
  };

  const renderIndicator = (indicator: IndicatorProps, index: number) => {
    return (
      <View key={index} style={styles.indicatorCard}>
        <View style={styles.indicatorHeader}>
          <Text style={styles.indicatorName}>{indicator.name}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="information-outline" size={16} color="#90A4AE" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.indicatorContent}>
          <Text style={styles.indicatorValue}>{indicator.value}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: `${getStatusColor(indicator.status)}20` }
          ]}>
            {getStatusIcon(indicator.status)}
            <Text style={[styles.statusText, { color: getStatusColor(indicator.status) }]}>
              {indicator.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicatorGrid}>
        {indicators.map((indicator, index) => renderIndicator(indicator, index))}
      </View>
    </View>
  );
};

// Fundamental Data Component
const FundamentalData = () => {
  const fundamentalData: FundamentalItemProps[] = [
    {
      title: 'FII Activity',
      value: '₹1,245.3 Cr',
      change: '₹245.8 Cr',
      changeDirection: 'up',
      info: 'Foreign Institutional Investors'
    },
    {
      title: 'DII Activity',
      value: '₹879.2 Cr',
      change: '₹124.6 Cr',
      changeDirection: 'up',
      info: 'Domestic Institutional Investors'
    },
    {
      title: 'Block Deals',
      value: '3 Deals',
      change: '₹523.1 Cr',
      changeDirection: 'neutral',
      info: 'Large quantity shares transaction'
    },
    {
      title: 'Net Revenue',
      value: '₹242,982 Cr',
      change: '12.4%',
      changeDirection: 'up',
      info: 'Annual revenue growth'
    },
    {
      title: 'Market Cap',
      value: '₹19.2L Cr',
      change: '1.2%',
      changeDirection: 'up',
      info: 'Total market value of shares'
    },
    {
      title: 'P/E Ratio',
      value: '28.6',
      change: '0.9',
      changeDirection: 'down',
      info: 'Price to Earnings Ratio'
    },
  ];

  const getChangeColor = (direction?: string) => {
    switch (direction) {
      case 'up':
        return '#4CAF50';
      case 'down':
        return '#F44336';
      default:
        return '#607D8B';
    }
  };

  const getChangeIcon = (direction?: string) => {
    switch (direction) {
      case 'up':
        return <Feather name="arrow-up-right" size={14} color="#4CAF50" />;
      case 'down':
        return <Feather name="arrow-down-right" size={14} color="#F44336" />;
      default:
        return <Feather name="minus" size={14} color="#607D8B" />;
    }
  };

  const renderFundamentalItem = (item: FundamentalItemProps, index: number) => {
    return (
      <View key={index} style={styles.fundamentalItem}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="information-outline" size={16} color="#90A4AE" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.itemValue}>{item.value}</Text>
        
        {item.change && (
          <View style={styles.changeContainer}>
            {getChangeIcon(item.changeDirection)}
            <Text style={[styles.changeText, { color: getChangeColor(item.changeDirection) }]}>
              {item.change}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fundamentalGrid}>
        {fundamentalData.map((item, index) => renderFundamentalItem(item, index))}
      </View>
    </View>
  );
};

// Prediction Metrics Component
const PredictionMetrics = () => {
  // Mock prediction data
  const predictionData = {
    confidence: 84,
    priceRange: {
      min: 2700,
      max: 2850
    },
    direction: 'bullish',
    timeFrame: '10 minutes',
    strategy: 'Buy',
    updatedAt: '2 mins ago'
  };

  // Prepare confidence indicator
  const confidenceColor = 
    predictionData.confidence >= 80 ? '#4CAF50' :
    predictionData.confidence >= 60 ? '#8BC34A' :
    predictionData.confidence >= 40 ? '#FFC107' : '#F44336';

  return (
    <View style={styles.container}>
      <View style={styles.metricsRow}>
        {/* Confidence Meter */}
        <View style={styles.confidenceMeter}>
          <Text style={styles.confidenceTitle}>AI Confidence</Text>
          <View style={styles.confidenceIndicator}>
            <View style={styles.confidenceBg}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { 
                    width: `${predictionData.confidence}%`,
                    backgroundColor: confidenceColor
                  }
                ]} 
              />
            </View>
            <View style={styles.confidenceValue}>
              <Text style={styles.confidenceText}>{predictionData.confidence}%</Text>
            </View>
          </View>
          <View style={styles.confidenceLabels}>
            <Text style={styles.confidenceMin}>Low</Text>
            <Text style={styles.confidenceMax}>High</Text>
          </View>
        </View>

        {/* Prediction Direction */}
        <View style={styles.directionIndicator}>
          <Text style={styles.directionTitle}>Prediction</Text>
          <View style={[
            styles.directionBadge,
            { 
              backgroundColor: predictionData.direction === 'bullish' 
                ? 'rgba(76, 175, 80, 0.15)' 
                : 'rgba(244, 67, 54, 0.15)'
            }
          ]}>
            <FontAwesome5 
              name={predictionData.direction === 'bullish' ? 'arrow-up' : 'arrow-down'} 
              size={16} 
              color={predictionData.direction === 'bullish' ? '#4CAF50' : '#F44336'} 
              style={styles.directionIcon}
            />
            <Text style={[
              styles.directionText,
              { color: predictionData.direction === 'bullish' ? '#4CAF50' : '#F44336' }
            ]}>
              {predictionData.direction.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.directionTimeframe}>Next {predictionData.timeFrame}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Predicted Price Range */}
      <View style={styles.priceRangeSection}>
        <Text style={styles.priceRangeTitle}>Predicted Price Range</Text>
        <View style={styles.priceRangeContainer}>
          <View style={styles.priceRangeValues}>
            <View style={styles.pricePoint}>
              <Text style={styles.priceLabel}>Min</Text>
              <Text style={styles.priceValue}>₹{predictionData.priceRange.min}</Text>
            </View>
            <View style={styles.pricePoint}>
              <Text style={styles.priceLabel}>Max</Text>
              <Text style={styles.priceValue}>₹{predictionData.priceRange.max}</Text>
            </View>
          </View>
          
          <View style={styles.rangeBarContainer}>
            <View style={styles.rangeBar}>
              <View style={styles.rangeBarFill} />
            </View>
            <View style={styles.rangeMarkers}>
              <View style={[styles.rangeMarker, styles.rangeMarkerMin]} />
              <View style={[styles.rangeMarker, styles.rangeMarkerMax]} />
            </View>
          </View>
        </View>
      </View>

      {/* Strategy & Update Time */}
      <View style={styles.bottomSection}>
        <View style={styles.strategyContainer}>
          <MaterialIcons name="flash-on" size={18} color="#FF9800" style={styles.strategyIcon} />
          <Text style={styles.strategyText}>
            <Text style={styles.strategyLabel}>Recommended Strategy: </Text>
            <Text style={[
              styles.strategyValue,
              { color: predictionData.strategy === 'Buy' ? '#4CAF50' : '#F44336' }
            ]}>
              {predictionData.strategy}
            </Text>
          </Text>
        </View>
        <View style={styles.updateContainer}>
          <MaterialIcons name="update" size={12} color="#90A4AE" style={styles.updateIcon} />
          <Text style={styles.updateText}>Updated {predictionData.updatedAt}</Text>
        </View>
      </View>
    </View>
  );
};

// Trade Management Tools Component
const TradeManagementTools = () => {
  const [quantity, setQuantity] = useState('10');
  const [entryPrice, setEntryPrice] = useState('2785.50');
  const [targetPrice, setTargetPrice] = useState('2850.00');
  const [stopLossPrice, setStopLossPrice] = useState('2730.00');
  
  // Calculate potential profit/loss
  const calculateProfit = () => {
    const qty = parseFloat(quantity) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const target = parseFloat(targetPrice) || 0;
    
    if (qty && entry && target) {
      return ((target - entry) * qty).toFixed(2);
    }
    return '0.00';
  };
  
  const calculateLoss = () => {
    const qty = parseFloat(quantity) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const stop = parseFloat(stopLossPrice) || 0;
    
    if (qty && entry && stop) {
      return ((entry - stop) * qty).toFixed(2);
    }
    return '0.00';
  };
  
  const calculateRiskRewardRatio = () => {
    const potentialProfit = parseFloat(calculateProfit());
    const potentialLoss = parseFloat(calculateLoss());
    
    if (potentialLoss > 0) {
      return (potentialProfit / potentialLoss).toFixed(2);
    }
    return '0.00';
  };
  
  const handleSetAlert = () => {
    // Implement alert functionality
  };
  
  const handlePlaceOrder = () => {
    // Implement order placement
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trade Calculator</Text>
      
      {/* Trade Parameters */}
      <View style={styles.parameters}>
        <View style={styles.parameterRow}>
          <View style={styles.parameterItem}>
            <Text style={styles.paramLabel}>Quantity</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Qty"
              />
            </View>
          </View>
          
          <View style={styles.parameterItem}>
            <Text style={styles.paramLabel}>Entry Price</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                value={entryPrice}
                onChangeText={setEntryPrice}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.parameterRow}>
          <View style={styles.parameterItem}>
            <Text style={styles.paramLabel}>Target Price</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                value={targetPrice}
                onChangeText={setTargetPrice}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>
          
          <View style={styles.parameterItem}>
            <Text style={styles.paramLabel}>Stop Loss</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                value={stopLossPrice}
                onChangeText={setStopLossPrice}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>
        </View>
      </View>
      
      {/* Calculated Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Potential Returns</Text>
        
        <View style={styles.resultsCard}>
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Potential Profit</Text>
              <Text style={[styles.resultValue, styles.profitText]}>
                ₹{calculateProfit()}
              </Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Potential Loss</Text>
              <Text style={[styles.resultValue, styles.lossText]}>
                ₹{calculateLoss()}
              </Text>
            </View>
          </View>
          
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Risk:Reward Ratio</Text>
              <Text style={styles.resultValue}>1:{calculateRiskRewardRatio()}</Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Recommended Size</Text>
              <Text style={styles.resultValue}>2% of capital</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.alertButton]}
          onPress={handleSetAlert}
        >
          <MaterialIcons name="notifications-active" size={20} color="#FF9800" />
          <Text style={[styles.buttonText, styles.alertText]}>Set Price Alert</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.orderButton]}
          onPress={handlePlaceOrder}
        >
          <Ionicons name="trending-up" size={20} color="white" />
          <Text style={[styles.buttonText, styles.orderText]}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main App Component
export default function HomeScreen() {
  const [stockData, setStockData] = useState({
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    currentPrice: 2785.50,
    change: 35.25,
    changePercent: 1.28,
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{stockData.symbol}</Text>
            <Text style={styles.companyName}>{stockData.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{stockData.currentPrice.toFixed(2)}</Text>
            <View style={styles.changeContainer}>
              <FontAwesome5 
                name={stockData.change >= 0 ? "caret-up" : "caret-down"} 
                size={16} 
                color={stockData.change >= 0 ? "#4CAF50" : "#F44336"} 
              />
              <Text style={[
                styles.change, 
                {color: stockData.change >= 0 ? "#4CAF50" : "#F44336"}
              ]}>
                {Math.abs(stockData.change).toFixed(2)} ({Math.abs(stockData.changePercent).toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Price Prediction</Text>
          <ChartView />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prediction Metrics</Text>
          <PredictionMetrics />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Indicators</Text>
          <TechnicalIndicators />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fundamental Data</Text>
          <FundamentalData />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trade Management</Text>
          <TradeManagementTools />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
  },
  companyName: {
    fontSize: 14,
    color: '#546E7A',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    marginLeft: 4,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 12,
  },
  // Chart styles
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
  },
  chartTypeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeChartTypeButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  chartContainer: {
    height: CHART_HEIGHT,
    marginHorizontal: 8,
    position: 'relative',
  },
  candleChartContainer: {
    height: CHART_HEIGHT,
    position: 'relative',
  },
  lineChartContainer: {
    height: CHART_HEIGHT,
    position: 'relative',
  },
  candleBody: {
    borderRadius: 1,
  },
  levelLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelLabelText: {
    fontSize: 10,
    fontWeight: '500',
  },
  gridLabel: {
    fontSize: 10,
    color: '#90A4AE',
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#546E7A',
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  activeTimeframeButton: {
    backgroundColor: '#E3F2FD',
  },
  timeframeText: {
    fontSize: 12,
    color: '#546E7A',
  },
  activeTimeframeText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  // Technical Indicators styles
  indicatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indicatorCard: {
    width: '48%',
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
  },
  indicatorContent: {
    marginTop: 4,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Fundamental Data styles
  fundamentalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fundamentalItem: {
    width: '48%',
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    color: '#455A64',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    marginTop: 8,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  // Prediction Metrics styles
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceMeter: {
    width: '48%',
  },
  confidenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
    marginBottom: 8,
  },
  confidenceIndicator: {
    position: 'relative',
    height: 30,
    marginBottom: 4,
  },
  confidenceBg: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'absolute',
    top: 11,
    left: 0,
    right: 0,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#263238',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceMin: {
    fontSize: 10,
    color: '#90A4AE',
  },
  confidenceMax: {
    fontSize: 10,
    color: '#90A4AE',
  },
  directionIndicator: {
    width: '48%',
    alignItems: 'center',
  },
  directionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  directionIcon: {
    marginRight: 6,
  },
  directionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  directionTimeframe: {
    fontSize: 12,
    color: '#90A4AE',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  priceRangeSection: {
    marginBottom: 16,
  },
  priceRangeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
    marginBottom: 12,
  },
  priceRangeContainer: {
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
  },
  priceRangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pricePoint: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#90A4AE',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
  },
  rangeBarContainer: {
    position: 'relative',
    height: 24,
  },
  rangeBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'absolute',
    top: 9,
    left: 0,
    right: 0,
  },
  rangeBarFill: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: '100%',
    backgroundColor: '#2196F3',
  },
  rangeMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  rangeMarkerMin: {
    borderColor: '#4CAF50',
    marginLeft: '10%',
  },
  rangeMarkerMax: {
    borderColor: '#F44336',
    marginRight: '10%',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strategyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strategyIcon: {
    marginRight: 4,
  },
  strategyText: {
    fontSize: 14,
  },
  strategyLabel: {
    color: '#546E7A',
  },
  strategyValue: {
    fontWeight: 'bold',
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateIcon: {
    marginRight: 4,
  },
  updateText: {
    fontSize: 12,
    color: '#90A4AE',
  },
  // Trade Management Tools styles
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 16,
  },
  parameters: {
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  parameterItem: {
    width: '48%',
  },
  paramLabel: {
    fontSize: 13,
    color: '#546E7A',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 8,
    height: 40,
  },
  inputPrefix: {
    color: '#90A4AE',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#263238',
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#455A64',
    marginBottom: 12,
  },
  resultsCard: {
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultItem: {
    width: '48%',
  },
  resultLabel: {
    fontSize: 13,
    color: '#546E7A',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
  },
  profitText: {
    color: '#4CAF50',
  },
  lossText: {
    color: '#F44336',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  alertButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    width: '48%',
  },
  orderButton: {
    backgroundColor: '#2196F3',
    width: '48%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertText: {
    color: '#FF9800',
  },
  orderText: {
    color: 'white',
  },
});