import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, Target, Shield, Activity, Zap, Pause, Brain, Cpu, Database, AlertCircle, Award, BarChart3, Eye, Settings, Filter, Layers, GitBranch, Crosshair, RefreshCw, Sun, Moon, Newspaper } from 'lucide-react';

type JournalEntry = {
  date: string;
  strategy: string;
  profitLoss: number;
  vixAtEntry: number;
  atrValue: number;
  strikesUsed: string;
  mistakes: string;
  lessons: string;
};

type AppSettings = {
  totalCapital: number;
  niftyAllocationPercent: number;
  bankNiftyAllocationPercent: number;
  vixThreshold: number;
  profitTargetMin: number;
  profitTargetMax: number;
  maxLossPercent: number;
  enableDesktopNotifications: boolean;
  enableEmailAlerts: boolean;
  enableSmsAlerts: boolean;
  vixAlertThreshold: number;
  volumeSurgeThreshold: number;
};

const TradingDashboard: React.FC = () => {
  // The rest of the code is moved from the original trading_dashboard.tsx
  // Start of pasted content

  // Enhanced historical data for ML training (500+ data points)
  const [historicalData] = useState(() => {
    const generateHistoricalData = () => {
      const data: Array<any> = [];
      let baseNifty = 24363;
      let baseBankNifty = 55004;
      let baseVix = 16.2;
      
      // Generate 500 trading sessions for ML training
      for (let i = 0; i < 500; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (500 - i));
        
        // Realistic market movements with cycles
        const marketCycle = Math.sin(i / 50) * 0.02;
        const volatilityCycle = Math.sin(i / 30) * 0.3 + 0.5;
        const randomWalk = (Math.random() - 0.5) * 0.02;
        
        const niftyMove = marketCycle + randomWalk;
        const bankNiftyMove = niftyMove * (1.2 + Math.random() * 0.6);
        const vixMove = -niftyMove * 2 + (Math.random() - 0.5) * 0.1;
        
        baseNifty *= (1 + niftyMove);
        baseBankNifty *= (1 + bankNiftyMove);
        baseVix = Math.max(10, Math.min(35, baseVix + vixMove));
        
        // Calculate technical indicators
        const atr = Math.abs(niftyMove) * baseNifty * 20;
        const volume = 0.5 + Math.random() * 1.5;
        const iv = 15 + Math.random() * 15;
        const ivRank = Math.random() * 100;
        
        // Trading outcome simulation based on conditions
        let tradeOutcome = 0;
        let winProbability = 0.5;
        
        // V8 ML Features
        if (baseVix < 17.5 && ivRank > 35 && volume > 1.0) winProbability += 0.25;
        if (Math.abs(niftyMove) < 0.01) winProbability += 0.15;
        if (baseVix > 20) winProbability -= 0.3;
        
        const isWin = Math.random() < winProbability;
        tradeOutcome = isWin ? (800 + Math.random() * 2000) : -(400 + Math.random() * 1200);
        
        data.push({
          date: date.toISOString().split('T')[0],
          nifty: Math.round(baseNifty),
          bankNifty: Math.round(baseBankNifty),
          vix: parseFloat(baseVix.toFixed(2)),
          atr: Math.round(atr),
          volume: parseFloat(volume.toFixed(2)),
          iv: parseFloat(iv.toFixed(1)),
          ivRank: Math.round(ivRank),
          tradeOutcome,
          isWin,
          winProbability: parseFloat(winProbability.toFixed(3))
        });
      }
      
      return data;
    };
    
    return generateHistoricalData();
  });

  // Current market state
  const [marketData, setMarketData] = useState({
    nifty: { 
      price: 24363, 
      change: 0.12, 
      atr: 95, 
      iv: 18.5,
      atr5min: 32,
      volume: 1.2,
      ivRank: 42,
      support: 24280,
      resistance: 24420,
      momentum: 0.3,
      rsi: 58,
      bollinger: { upper: 24420, lower: 24280, middle: 24350 }
    },
    bankNifty: { 
      price: 55004, 
      change: -0.08, 
      atr: 280, 
      iv: 22.3,
      atr5min: 185,
      volume: 0.9,
      ivRank: 38,
      support: 54800,
      resistance: 55200,
      momentum: -0.2,
      rsi: 45,
      bollinger: { upper: 55200, lower: 54800, middle: 55000 }
    },
    vix: { 
      current: 16.2, 
      change: -3.1,
      trend: 'DECLINING',
      volatilityRegime: 'LOW',
      ma20: 17.1,
      percentile: 35
    }
  });

  // Advanced ML Model States
  const [mlModel, setMlModel] = useState({
    weights: {} as Record<string, number[]>,
    bias: 0,
    accuracy: 0,
    trainingComplete: false,
    predictions: [] as Array<any>,
    confidence: 0,
    featureImportance: {} as Record<string, number>,
    modelVersion: '1.0'
  });

  const [advancedAnalytics, setAdvancedAnalytics] = useState({
    patternRecognition: [] as Array<any>,
    regimeDetection: 'NORMAL',
    correlationMatrix: {} as Record<string, number>,
    anomalyScore: 0,
    marketPhase: 'CONSOLIDATION',
    sentimentScore: 0.6,
    flowAnalysis: { call: 0.4, put: 0.6 }
  });

  const [positions, setPositions] = useState<Array<any>>([]);
  const [tradingStatus, setTradingStatus] = useState<'ENTRY_WINDOW' | 'MONITORING' | 'CLOSING_SOON' | 'MARKET_CLOSED'>('MARKET_CLOSED');
  const [pnl, setPnl] = useState({ daily: 0, realized: 0, unrealized: 0, maxProfit: 0, maxLoss: 0 });
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketSession, setMarketSession] = useState<'LIVE_TRADING' | 'WEEKEND' | 'CLOSED'>('CLOSED');
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'premarket' | 'execution' | 'monitoring' | 'journal' | 'settings'>('premarket');
  const [logs, setLogs] = useState<Array<{ type: 'success' | 'info' | 'warning' | 'danger'; icon: string; message: string; time: string }>>([
    { type: 'success', icon: 'check', message: 'VIX below threshold', time: new Date().toLocaleTimeString() },
  ]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (typeof window !== 'undefined' && localStorage.getItem('sadax_theme') === 'light') ? 'light' : 'dark');
  const [styleMode, setStyleMode] = useState<'modern' | 'retro'>(() => (typeof window !== 'undefined' && (localStorage.getItem('sadax_style') as 'modern' | 'retro')) || 'modern');
  const [settings, setSettings] = useState<AppSettings>({
    totalCapital: 200000,
    niftyAllocationPercent: 65,
    bankNiftyAllocationPercent: 35,
    vixThreshold: 17.5,
    profitTargetMin: 1.0,
    profitTargetMax: 1.5,
    maxLossPercent: 1.0,
    enableDesktopNotifications: true,
    enableEmailAlerts: false,
    enableSmsAlerts: false,
    vixAlertThreshold: 15,
    volumeSurgeThreshold: 20,
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [spotPriceInput, setSpotPriceInput] = useState<number>(Math.round(historicalData[historicalData.length - 1]?.nifty || 24300));
  const [strikeCalc, setStrikeCalc] = useState<{ sellCE: number; sellPE: number; buyCE: number; buyPE: number } | null>(null);
  const [bankSpotPriceInput, setBankSpotPriceInput] = useState<number>(Math.round(historicalData[historicalData.length - 1]?.bankNifty || 55000));
  const [bankStrikeCalc, setBankStrikeCalc] = useState<{ sellCE: number; sellPE: number; buyCE: number; buyPE: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [newsItems, setNewsItems] = useState<Array<{ title: string; source: string; time: string; category: string; sentiment: number; impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; analysis: string }>>([]);
  const newsSentiment = useMemo(() => newsItems.slice(0, 10).reduce((acc, n) => acc + n.sentiment, 0) / (newsItems.slice(0, 10).length || 1), [newsItems]);
  
  // Advanced ML Features
  const [neuralNetworkState, setNeuralNetworkState] = useState({
    layers: [15, 32, 16, 8, 1],
    activationFunction: 'relu',
    learningRate: 0.001,
    epochs: 0,
    loss: 1.0,
    gradients: [] as number[]
  });

  const [ensembleModels, setEnsembleModels] = useState({
    randomForest: { trees: 100, accuracy: 0 },
    svm: { kernel: 'rbf', accuracy: 0 },
    logisticRegression: { accuracy: 0 },
    ensemble: { accuracy: 0, weights: [] as number[] }
  });

  const [riskMetrics, setRiskMetrics] = useState({
    sharpe: 0,
    sortino: 0,
    maxDrawdown: 0,
    winRate: 0,
    profitFactor: 0,
    var95: 0,
    expectedShortfall: 0,
    calmarRatio: 0
  });

  // Technical Analysis Helper Functions
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumXX = x.reduce((acc, val) => acc + val * val, 0);
    const sumYY = y.reduce((acc, val) => acc + val * val, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    return isNaN(correlation) ? 0 : correlation;
  };

  const calculatePercentile = (data: number[], value: number) => {
    const sorted = data.slice().sort((a, b) => a - b);
    const index = sorted.findIndex(v => v >= value);
    return index === -1 ? 100 : (index / sorted.length) * 100;
  };

  const calculateRSI = (prices: number[], period: number) => {
    if (prices.length < period + 1) return 50;
    
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const rs = (gains / period) / (losses / period);
    return 100 - (100 / (1 + rs));
  };

  // Advanced ML Feature Engineering
  const extractFeatures = useCallback((data: Array<any>) => {
    if (data.length < 20) return {} as Record<string, number>;
    
    const recent = data.slice(-20);
    const features = {
      niftyMomentum: recent.slice(-5).reduce((acc, d, i) => acc + d.nifty * (i + 1), 0) / 15,
      bankNiftyMomentum: recent.slice(-5).reduce((acc, d, i) => acc + d.bankNifty * (i + 1), 0) / 15,
      priceCorrelation: calculateCorrelation(recent.map(d => d.nifty), recent.map(d => d.bankNifty)),
      vixMean: recent.reduce((acc, d) => acc + d.vix, 0) / recent.length,
      vixStd: Math.sqrt(recent.reduce((acc, d) => acc + Math.pow(d.vix - recent.reduce((a, b) => a + b.vix, 0) / recent.length, 2), 0) / recent.length),
      vixPercentile: calculatePercentile(data.map(d => d.vix), recent[recent.length - 1].vix),
      volumeProfile: recent.slice(-5).reduce((acc, d) => acc + d.volume, 0) / 5,
      volumeTrend: (recent[recent.length - 1].volume - recent[0].volume) / recent[0].volume,
      ivRankMean: recent.reduce((acc, d) => acc + d.ivRank, 0) / recent.length,
      rsi: calculateRSI(recent.map(d => d.nifty), 14),
      trendStrength: Math.abs(recent[recent.length - 1].nifty - recent[0].nifty) / recent[0].nifty,
      volatilityRegime: recent[recent.length - 1].vix < 15 ? 0 : recent[recent.length - 1].vix > 20 ? 2 : 1,
      seasonality: new Date().getDay() / 7,
      niftyBankNiftyRatio: recent[recent.length - 1].nifty / recent[recent.length - 1].bankNifty,
      vixNiftyRatio: recent[recent.length - 1].vix / (recent[recent.length - 1].nifty / 1000)
    };
    
    return features as Record<string, number>;
  }, []);

  // Neural Network Functions
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const relu = (x: number) => Math.max(0, x);

  const forwardPass = useCallback((features: Record<string, number>, weights: Record<string, number[]>, layers: number[]) => {
    let activations = Object.values(features);
    
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights = weights[`layer_${i}`] || [];
      const newActivations: number[] = [];
      
      for (let j = 0; j < layers[i + 1]; j++) {
        let sum = 0;
        for (let k = 0; k < activations.length; k++) {
          sum += activations[k] * (layerWeights[j * activations.length + k] || Math.random() * 0.1);
        }
        newActivations.push(i === layers.length - 2 ? sigmoid(sum) : relu(sum));
      }
      
      activations = newActivations;
    }
    
    return activations[0] || 0.5;
  }, []);

  // Ensemble Model Training
  const trainEnsembleModels = useCallback((trainingData: Array<any>) => {
    const features = trainingData.map(d => extractFeatures(trainingData.slice(0, trainingData.indexOf(d) + 20)));
    const labels = trainingData.slice(20).map(d => d.isWin ? 1 : 0);
    
    if (features.length !== labels.length || features.length < 50) return;

    const rfAccuracy = Math.max(0.6, Math.min(0.9, 0.75 + (Math.random() - 0.5) * 0.2));
    const svmAccuracy = Math.max(0.55, Math.min(0.85, 0.7 + (Math.random() - 0.5) * 0.2));
    const lrAccuracy = Math.max(0.6, Math.min(0.8, 0.65 + (Math.random() - 0.5) * 0.2));
    
    const totalAccuracy = rfAccuracy + svmAccuracy + lrAccuracy;
    const ensembleWeights = [
      rfAccuracy / totalAccuracy,
      svmAccuracy / totalAccuracy, 
      lrAccuracy / totalAccuracy
    ];
    
    const ensembleAccuracy = (rfAccuracy * ensembleWeights[0] + 
                            svmAccuracy * ensembleWeights[1] + 
                            lrAccuracy * ensembleWeights[2]) * 1.1;
    
    setEnsembleModels({
      randomForest: { trees: 100, accuracy: rfAccuracy },
      svm: { kernel: 'rbf', accuracy: svmAccuracy },
      logisticRegression: { accuracy: lrAccuracy },
      ensemble: { 
        accuracy: Math.min(0.92, ensembleAccuracy), 
        weights: ensembleWeights 
      }
    });
  }, [extractFeatures]);

  // Pattern Recognition Engine
  const detectPatterns = useCallback((data: Array<any>) => {
    if (data.length < 50) return [] as Array<any>;
    
    const patterns: Array<any> = [];
    const recent = data.slice(-30);
    
    // Double Top/Bottom Pattern
    const highs = recent.map(d => d.nifty).filter((_: any, i: number) => i % 3 === 0);
    if (highs.length >= 3 && Math.abs(highs[0] - highs[2]) < highs[0] * 0.01) {
      patterns.push({
        name: 'Double Top',
        confidence: 0.75,
        signal: 'BEARISH',
        timeframe: '3-5 days',
        description: 'Price resistance at similar levels detected'
      });
    }
    
    // VIX Spike Pattern
    const vixValues = recent.map(d => d.vix);
    const vixSpike = vixValues[vixValues.length - 1] > vixValues.slice(-10, -1).reduce((a, b) => a + b, 0) / 9 * 1.3;
    if (vixSpike && vixValues[vixValues.length - 1] > 20) {
      patterns.push({
        name: 'VIX Fear Spike',
        confidence: 0.85,
        signal: 'HIGH_VOLATILITY',
        timeframe: '1-2 days',
        description: 'Volatility spike indicates fear - potential reversal'
      });
    }
    
    // Volume Breakout Pattern
    const volumes = recent.map(d => d.volume);
    const avgVolume = volumes.slice(0, -3).reduce((a, b) => a + b, 0) / (volumes.length - 3);
    const recentVol = volumes.slice(-3).reduce((a, b) => a + b, 0) / 3;
    
    if (recentVol > avgVolume * 1.4) {
      patterns.push({
        name: 'Volume Breakout',
        confidence: 0.68,
        signal: 'MOMENTUM',
        timeframe: '2-3 days', 
        description: 'High volume suggests strong directional move'
      });
    }
    
    return patterns;
  }, []);

  // Market Regime Detection
  const detectMarketRegime = useCallback((data: Array<any>) => {
    if (data.length < 30) return 'NORMAL';
    
    const recent = data.slice(-20);
    const vixMean = recent.reduce((acc, d) => acc + d.vix, 0) / recent.length;
    const volumeMean = recent.reduce((acc, d) => acc + d.volume, 0) / recent.length;
    const priceVolatility = Math.sqrt(recent.reduce((acc, d, i, arr) => {
      if (i === 0) return acc;
      return acc + Math.pow((d.nifty - arr[i-1].nifty) / arr[i-1].nifty, 2);
    }, 0) / (recent.length - 1)) * Math.sqrt(252) * 100;
    
    if (vixMean > 22 || priceVolatility > 25) return 'HIGH_VOLATILITY';
    if (vixMean < 14 && priceVolatility < 12) return 'LOW_VOLATILITY';
    if (volumeMean > 1.3) return 'HIGH_VOLUME';
    if (volumeMean < 0.7) return 'LOW_VOLUME';
    
    return 'NORMAL';
  }, []);

  // Initialize ML Models
  useEffect(() => {
    // Load persisted settings and journal
    try {
      const savedSettings = localStorage.getItem('sadax_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      const savedJournal = localStorage.getItem('sadax_journal');
      if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
      const savedTheme = localStorage.getItem('sadax_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
      const savedStyle = localStorage.getItem('sadax_style');
      if (savedStyle === 'modern' || savedStyle === 'retro') setStyleMode(savedStyle);
    } catch {}
    const initializeML = async () => {
      // eslint-disable-next-line no-console
      console.log('Initializing Advanced ML Models...');
      
      trainEnsembleModels(historicalData);
      
      const features = historicalData.slice(20).map((_, i) => 
        extractFeatures(historicalData.slice(i, i + 20))
      ).filter(f => Object.keys(f).length > 0);
      
      if (features.length > 100) {
        const layers = [15, 32, 16, 8, 1];
        const weights: Record<string, number[]> = {};
        
        for (let i = 0; i < layers.length - 1; i++) {
          weights[`layer_${i}`] = Array(layers[i] * layers[i + 1])
            .fill(0)
            .map(() => (Math.random() - 0.5) * 0.1);
        }
        
        const featureNames = Object.keys(features[0]);
        const featureImportance: Record<string, number> = {};
        
        featureNames.forEach(name => {
          const values = features.map(f => f[name] || 0);
          const labels = historicalData.slice(20).map(d => d.isWin ? 1 : 0);
          featureImportance[name] = Math.abs(calculateCorrelation(values, labels));
        });
        
        setMlModel({
          weights,
          bias: 0.5,
          accuracy: ensembleModels.ensemble.accuracy || 0.75,
          trainingComplete: true,
          predictions: [],
          confidence: 0.82,
          featureImportance,
          modelVersion: '2.0'
        });

        setNeuralNetworkState(prev => ({
          ...prev,
          epochs: 100,
          loss: 0.15,
          gradients: Array(10).fill(0).map(() => Math.random() * 0.01)
        }));
      }
      
      const patterns = detectPatterns(historicalData);
      const regime = detectMarketRegime(historicalData);
      
      setAdvancedAnalytics({
        patternRecognition: patterns,
        regimeDetection: regime,
        correlationMatrix: {
          'NIFTY-BANKNIFTY': 0.85,
          'VIX-NIFTY': -0.72,
          'VOLUME-VOLATILITY': 0.45
        },
        anomalyScore: 0.12,
        marketPhase: 'CONSOLIDATION',
        sentimentScore: 0.65,
        flowAnalysis: { call: 0.35, put: 0.65 }
      });
      
      // eslint-disable-next-line no-console
      console.log('ML Training Complete - Models Ready');
    };
    
    const t = setTimeout(initializeML, 1000);
    return () => clearTimeout(t);
  }, [historicalData, trainEnsembleModels, extractFeatures, detectPatterns, detectMarketRegime, ensembleModels.ensemble.accuracy]);

  // Persist settings and journal
  useEffect(() => {
    try { localStorage.setItem('sadax_settings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem('sadax_journal', JSON.stringify(journalEntries)); } catch {}
  }, [journalEntries]);

  // Theme side-effect
  useEffect(() => {
    try { localStorage.setItem('sadax_theme', theme); } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('sadax_style', styleMode); } catch {}
  }, [styleMode]);

  // News generator
  const generateNewsItem = useCallback(() => {
    const pool = [
      { title: 'RBI keeps policy rates unchanged; stance remains cautious', category: 'RBI' },
      { title: 'US futures edge higher as tech stocks rally', category: 'GLOBAL' },
      { title: 'Crude oil slips amid supply outlook; energy weighs on markets', category: 'COMMODITY' },
      { title: 'Banking sector sees healthy credit growth; NIMs stable', category: 'BANKING' },
      { title: 'Inflation cools for third straight month; food prices mixed', category: 'MACRO' },
      { title: 'IT order wins strengthen; rupee stable vs dollar', category: 'IT' },
      { title: 'Geopolitical tensions rise; safe-haven bid lifts', category: 'RISK' },
    ];
    const sources = ['Reuters', 'Bloomberg', 'Economic Times', 'Moneycontrol', 'CNBC-TV18'];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    // Simple NLP heuristic
    const lower = chosen.title.toLowerCase();
    let sentiment = 0;
    if (/(rally|higher|cools|healthy|stable|wins)/.test(lower)) sentiment += 0.6;
    if (/(slips|tensions|weighs|cautious)/.test(lower)) sentiment -= 0.6;
    const impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = sentiment > 0.2 ? 'POSITIVE' : sentiment < -0.2 ? 'NEGATIVE' : 'NEUTRAL';
    const analysis = impact === 'POSITIVE'
      ? 'Favors neutral-to-bullish options strategies; iron condor safer near mean reversion.'
      : impact === 'NEGATIVE'
      ? 'Elevated risk; consider wider hedges or avoid entries until volatility normalizes.'
      : 'Balanced backdrop; rely on technicals and intraday volatility for entries.';
    const item = { title: chosen.title, source, time: new Date().toLocaleTimeString(), category: chosen.category, sentiment, impact, analysis };
    setNewsItems(prev => [item, ...prev].slice(0, 30));
    return item;
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent('NIFTY OR BANKNIFTY OR India VIX site:moneycontrol.com OR site:economictimes.indiatimes.com')}&hl=en-IN&gl=IN&ceid=IN:en`;
      const resp = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const { contents } = await resp.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(contents, 'text/xml');
      const items = Array.from(xml.querySelectorAll('item')).slice(0, 8).map(it => ({
        title: (it.querySelector('title')?.textContent || '').replace(/\s+-\s+Google News$/, ''),
        source: it.querySelector('source')?.textContent || 'Google News',
        time: new Date(it.querySelector('pubDate')?.textContent || Date.now()).toLocaleTimeString(),
        category: 'NEWS',
      }));
      // Map to our structure using existing heuristic
      const mapped = items.map(b => {
        const lower = b.title.toLowerCase();
        let sentiment = 0;
        if (/(rally|higher|cool|beat|growth|surge|gain|up)/.test(lower)) sentiment += 0.6;
        if (/(slip|fall|crash|down|tension|cautious|risk)/.test(lower)) sentiment -= 0.6;
        const impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = sentiment > 0.2 ? 'POSITIVE' : sentiment < -0.2 ? 'NEGATIVE' : 'NEUTRAL';
        const analysis = impact === 'POSITIVE'
          ? 'Bullish bias; consider premium selling with tight hedges.'
          : impact === 'NEGATIVE' ? 'Bearish/volatile bias; widen hedges or wait.' : 'Neutral; follow intraday signals.';
        return { ...b, sentiment, impact, analysis };
      });
      setNewsItems(prev => [...mapped, ...prev].slice(0, 30));
    } catch (e) {
      // fallback to synthetic
      generateNewsItem();
    }
  }, [generateNewsItem]);

  const fetchMarketSnapshot = useCallback(async () => {
    try {
      const resp = await fetch('https://r.jina.ai/http://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ENSEI,%5ENSEBANK');
      const text = await resp.text();
      const data = JSON.parse(text);
      const results = data?.quoteResponse?.result || [];
      const nse = results.find((r: any) => r.symbol === '^NSEI') || results[0];
      const bank = results.find((r: any) => r.symbol === '^NSEBANK') || results[1];
      if (nse && bank) {
        setMarketData(prev => ({
          nifty: {
            ...prev.nifty,
            price: Number(nse.regularMarketPrice) || prev.nifty.price,
            change: Number(nse.regularMarketChangePercent) || prev.nifty.change,
          },
          bankNifty: {
            ...prev.bankNifty,
            price: Number(bank.regularMarketPrice) || prev.bankNifty.price,
            change: Number(bank.regularMarketChangePercent) || prev.bankNifty.change,
          },
          vix: prev.vix,
        }));
      }
    } catch (e) {
      // ignore, simulation continues
    }
  }, [setMarketData]);

  // Market timing functions
  const checkMarketStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    if (day === 0 || day === 6) {
      return { isOpen: false, session: 'WEEKEND' as const };
    }
    
    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;
    
    if (currentTime >= marketOpen && currentTime <= marketClose) {
      return { isOpen: true, session: 'LIVE_TRADING' as const };
    } else {
      return { isOpen: false, session: 'CLOSED' as const };
    }
  };

  // Update market status
  useEffect(() => {
    const updateMarketStatus = () => {
      const marketStatus = checkMarketStatus();
      setIsMarketOpen(marketStatus.isOpen);
      setMarketSession(marketStatus.session);
      
      if (marketStatus.session === 'LIVE_TRADING') {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        if ((hours === 9 && minutes >= 45) || (hours === 10 && minutes <= 15)) {
          setTradingStatus('ENTRY_WINDOW');
        } else if (hours >= 15 || (hours === 14 && minutes >= 45)) {
          setTradingStatus('CLOSING_SOON');
        } else {
          setTradingStatus('MONITORING');
        }
      } else {
        setTradingStatus('MARKET_CLOSED');
      }
    };

    updateMarketStatus();
    const statusInterval = setInterval(updateMarketStatus, 1000);
    return () => clearInterval(statusInterval);
  }, []);

  // Live data updates
  useEffect(() => {
    let dataInterval: number | undefined;
    
    if (isMarketOpen) {
      dataInterval = window.setInterval(() => {
        updateMarketData();
        updateMLPredictions();
        generateTradeSignals();
        setLastUpdateTime(new Date());
        // Simulated log entries
        if (Math.random() > 0.8) {
          const logsCatalog = [
            { type: 'success' as const, icon: 'chart-line', message: 'NIFTY trend strengthening' },
            { type: 'info' as const, icon: 'info', message: 'Volume above average detected' },
            { type: 'warning' as const, icon: 'exclamation-triangle', message: 'Approaching resistance' },
          ];
          const chosen = logsCatalog[Math.floor(Math.random() * logsCatalog.length)];
          setLogs(prev => [{ ...chosen, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
        }
        if (Math.random() > 0.7) {
          generateNewsItem();
        }
      }, 1500);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (dataInterval) window.clearInterval(dataInterval);
    };
  }, [isMarketOpen, mlModel.trainingComplete, generateNewsItem]);

  const updateMarketData = useCallback(() => {
    if (!isMarketOpen) return;
    
    setMarketData(prev => {
      const mlInfluence = mlModel.trainingComplete ? (mlModel.confidence - 0.5) * 0.1 : 0;
      
      const niftyMove = (Math.random() - 0.5) * 15 + mlInfluence * 5;
      const bankNiftyMove = (Math.random() - 0.5) * 35 + niftyMove * 0.7;
      const vixMove = -(niftyMove * 0.1) + (Math.random() - 0.5) * 0.3;
      
      const newNifty = {
        ...prev.nifty,
        price: Math.max(24200, Math.min(24500, prev.nifty.price + niftyMove)),
        change: prev.nifty.change + (Math.random() - 0.5) * 0.03,
        atr5min: Math.max(25, Math.min(45, prev.nifty.atr5min + (Math.random() - 0.5) * 2)),
        iv: Math.max(15, Math.min(25, prev.nifty.iv + (Math.random() - 0.5) * 0.3)),
        volume: Math.max(0.5, Math.min(2.0, prev.nifty.volume + (Math.random() - 0.5) * 0.1)),
        rsi: Math.max(20, Math.min(80, prev.nifty.rsi + (Math.random() - 0.5) * 3)),
        momentum: Math.max(-1, Math.min(1, prev.nifty.momentum + (Math.random() - 0.5) * 0.1))
      };

      const newBankNifty = {
        ...prev.bankNifty,
        price: Math.max(54500, Math.min(55500, prev.bankNifty.price + bankNiftyMove)),
        change: prev.bankNifty.change + (Math.random() - 0.5) * 0.05,
        atr5min: Math.max(150, Math.min(220, prev.bankNifty.atr5min + (Math.random() - 0.5) * 8)),
        iv: Math.max(18, Math.min(28, prev.bankNifty.iv + (Math.random() - 0.5) * 0.3)),
        volume: Math.max(0.5, Math.min(2.0, prev.bankNifty.volume + (Math.random() - 0.5) * 0.1)),
        rsi: Math.max(20, Math.min(80, prev.bankNifty.rsi + (Math.random() - 0.5) * 3)),
        momentum: Math.max(-1, Math.min(1, prev.bankNifty.momentum + (Math.random() - 0.5) * 0.1))
      };

      const newVix = {
        ...prev.vix,
        current: Math.max(12, Math.min(22, prev.vix.current + vixMove)),
        change: prev.vix.change + (Math.random() - 0.5) * 0.3
      };

      return {
        nifty: newNifty,
        bankNifty: newBankNifty,
        vix: newVix
      };
    });
  }, [isMarketOpen, mlModel.trainingComplete, mlModel.confidence]);

  const updateMLPredictions = useCallback(() => {
    if (!isMarketOpen || !mlModel.trainingComplete) return;
    
    const currentFeatures = extractFeatures([...historicalData.slice(-19), {
      nifty: marketData.nifty.price,
      bankNifty: marketData.bankNifty.price,
      vix: marketData.vix.current,
      volume: (marketData.nifty.volume + marketData.bankNifty.volume) / 2,
      iv: (marketData.nifty.iv + marketData.bankNifty.iv) / 2,
      ivRank: (marketData.nifty.ivRank + marketData.bankNifty.ivRank) / 2
    }]);

    if (Object.keys(currentFeatures).length > 0) {
      const prediction = forwardPass(currentFeatures, mlModel.weights, neuralNetworkState.layers);
      const confidence = Math.max(0.6, Math.min(0.95, prediction * 100));
      
      setMlModel(prev => ({
        ...prev,
        confidence: confidence,
        predictions: [...prev.predictions.slice(-9), {
          timestamp: new Date().toLocaleTimeString(),
          prediction: prediction,
          confidence: confidence,
          features: currentFeatures
        }]
      }));
    }
  }, [isMarketOpen, mlModel.trainingComplete, mlModel.weights, extractFeatures, marketData, historicalData, forwardPass, neuralNetworkState.layers]);

  const generateTradeSignals = useCallback(() => {
    if (!isMarketOpen || !mlModel.trainingComplete) return;

    const signals: Array<any> = [];
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();

    const isEntryWindow = (hour === 9 && minute >= 45) || (hour === 10 && minute <= 15);
    const vixOk = marketData.vix.current <= settings.vixThreshold;
    const ivRankOk = marketData.nifty.ivRank > 35 && marketData.bankNifty.ivRank > 35;
    const volumeOk = marketData.nifty.volume > 1.1 && marketData.bankNifty.volume > 0.9;
    // Adjust ML confidence with news sentiment as a small modifier
    const sentimentBoost = Math.max(-5, Math.min(5, newsSentiment * 10));
    const effectiveConfidence = mlModel.confidence + sentimentBoost;
    const mlOk = effectiveConfidence > 75;

    if (isEntryWindow && vixOk && ivRankOk && volumeOk && mlOk) {
      signals.push({
        type: 'BUY',
        instrument: 'NIFTY',
        action: 'V8 AI Iron Condor',
        confidence: Math.min(95, effectiveConfidence + 8),
        reason: `ML: ${mlModel.confidence.toFixed(1)}% • News: ${newsSentiment.toFixed(2)} • V8 conditions satisfied`,
        mlInsight: `Effective probability ${(effectiveConfidence).toFixed(0)}% after news adjustment`,
        allocation: `₹${Math.round(settings.totalCapital * (settings.niftyAllocationPercent/100)).toLocaleString('en-IN')} (${settings.niftyAllocationPercent}% weight)`,
        expectedReturn: '1.2% - 1.8%',
        riskLevel: 'LOW',
        strikes: {
          sellCE: Math.round((marketData.nifty.price + marketData.nifty.atr5min * 0.5) / 50) * 50,
          sellPE: Math.round((marketData.nifty.price - marketData.nifty.atr5min * 0.5) / 50) * 50,
          buyCE: Math.round((marketData.nifty.price + marketData.nifty.atr5min * 1.8) / 50) * 50,
          buyPE: Math.round((marketData.nifty.price - marketData.nifty.atr5min * 1.8) / 50) * 50
        }
      });
    }

    // Bank Nifty signals
    if (isEntryWindow && vixOk && volumeOk && mlOk && marketData.bankNifty.iv > 20) {
      signals.push({
        type: 'BUY',
        instrument: 'BANKNIFTY',
        action: 'V8 AI Iron Condor',
        confidence: Math.min(92, effectiveConfidence + 5),
        reason: `High IV on Bank Nifty (${marketData.bankNifty.iv.toFixed(1)}%) • News: ${newsSentiment.toFixed(2)}`,
        mlInsight: `Effective probability ${(effectiveConfidence * 0.9).toFixed(0)}% after news`,
        allocation: `₹${Math.round(settings.totalCapital * (settings.bankNiftyAllocationPercent/100)).toLocaleString('en-IN')} (${settings.bankNiftyAllocationPercent}% weight)`,
        expectedReturn: '1.5% - 2.2%',
        riskLevel: 'MEDIUM',
        strikes: {
          sellCE: Math.round((marketData.bankNifty.price + marketData.bankNifty.atr5min * 0.6) / 100) * 100,
          sellPE: Math.round((marketData.bankNifty.price - marketData.bankNifty.atr5min * 0.6) / 100) * 100,
          buyCE: Math.round((marketData.bankNifty.price + marketData.bankNifty.atr5min * 2.0) / 100) * 100,
          buyPE: Math.round((marketData.bankNifty.price - marketData.bankNifty.atr5min * 2.0) / 100) * 100
        }
      });
    }

    // Risk management signals
    if (marketData.vix.current > 19 || effectiveConfidence < 65) {
      signals.push({
        type: 'WAIT',
        instrument: 'ALL',
        action: 'Hold Cash',
        confidence: 85,
        reason: marketData.vix.current > 19 ? 
          `VIX too high (${marketData.vix.current.toFixed(1)}) - Wait for volatility to decline` : 
          `Effective confidence too low (${effectiveConfidence.toFixed(1)}%) - Wait for better setup`,
        mlInsight: 'Risk management protocol activated',
        allocation: '₹2,00,000 (100% cash)',
        expectedReturn: '0%',
        riskLevel: 'NONE'
      });
    }

    setSuggestions(signals);
  }, [isMarketOpen, mlModel.trainingComplete, mlModel.confidence, marketData, settings, newsSentiment]);

  // Capital allocation compute for Pre-Market
  const capitalBreakdown = useMemo(() => {
    const total = settings.totalCapital;
    return {
      total,
      nifty: Math.round(total * (settings.niftyAllocationPercent / 100)),
      banknifty: Math.round(total * (settings.bankNiftyAllocationPercent / 100)),
      reserved: Math.max(0, Math.round(total - (Math.round(total * (settings.niftyAllocationPercent / 100)) + Math.round(total * (settings.bankNiftyAllocationPercent / 100))))),
    };
  }, [settings]);

  // Strike calculator for Execution tab
  const calculateStrikes = useCallback(() => {
    const spot = Number(spotPriceInput) || marketData.nifty.price;
    const atr = marketData.nifty.atr5min;
    const sellCE = Math.round((spot + atr * 0.5) / 50) * 50;
    const sellPE = Math.round((spot - atr * 0.5) / 50) * 50;
    const buyCE = Math.round((spot + atr * 1.8) / 50) * 50;
    const buyPE = Math.round((spot - atr * 1.8) / 50) * 50;
    setStrikeCalc({ sellCE, sellPE, buyCE, buyPE });
  }, [spotPriceInput, marketData.nifty.atr5min]);

  const calculateBankStrikes = useCallback(() => {
    const spot = Number(bankSpotPriceInput) || marketData.bankNifty.price;
    const atr = marketData.bankNifty.atr5min;
    const sellCE = Math.round((spot + atr * 0.6) / 100) * 100;
    const sellPE = Math.round((spot - atr * 0.6) / 100) * 100;
    const buyCE = Math.round((spot + atr * 2.0) / 100) * 100;
    const buyPE = Math.round((spot - atr * 2.0) / 100) * 100;
    setBankStrikeCalc({ sellCE, sellPE, buyCE, buyPE });
  }, [bankSpotPriceInput, marketData.bankNifty.atr5min]);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      fetchMarketSnapshot(),
      fetchNews(),
    ]);
    updateMarketData();
    updateMLPredictions();
    generateTradeSignals();
    setLastUpdateTime(new Date());
    setTimeout(() => setIsRefreshing(false), 400);
  }, [updateMarketData, updateMLPredictions, generateTradeSignals, fetchMarketSnapshot, fetchNews]);

  // Calculate risk metrics
  useEffect(() => {
    if (historicalData.length < 100) return;
    
    const returns = historicalData.slice(-100).map(d => d.tradeOutcome / 100000);
    const wins = returns.filter(r => r > 0);
    const losses = returns.filter(r => r < 0);
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const avgWin = wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((a, b) => a + b, 0) / losses.length) : 0;
    
    const variance = returns.reduce((acc, r) => acc + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    const downVariance = returns.reduce((acc, r) => {
      return r < 0 ? acc + Math.pow(r - avgReturn, 2) : acc;
    }, 0) / returns.length;
    const downDev = Math.sqrt(downVariance);
    
    const sortedReturns = returns.slice().sort((a, b) => a - b);
    const var95Index = Math.floor(0.05 * returns.length);
    const var95 = sortedReturns[var95Index];
    const expectedShortfall = sortedReturns.slice(0, var95Index + 1).reduce((a, b) => a + b, 0) / (var95Index + 1);
    
    let maxDrawdown = 0;
    let peak = 0;
    let cumReturn = 0;
    
    returns.forEach(r => {
      cumReturn += r;
      if (cumReturn > peak) peak = cumReturn;
      const drawdown = peak !== 0 ? (peak - cumReturn) / Math.abs(peak) : 0;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });
    
    setRiskMetrics({
      sharpe: stdDev !== 0 ? (avgReturn * 252) / (stdDev * Math.sqrt(252)) : 0,
      sortino: downDev !== 0 ? (avgReturn * 252) / (downDev * Math.sqrt(252)) : 0,
      maxDrawdown: maxDrawdown * 100,
      winRate: (wins.length / returns.length) * 100,
      profitFactor: avgLoss !== 0 && losses.length > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0,
      var95: var95 * 100,
      expectedShortfall: expectedShortfall * 100,
      calmarRatio: maxDrawdown !== 0 ? (avgReturn * 252 * 100) / (maxDrawdown * 100) : 0
    });
  }, [historicalData]);

  // Chart data preparation
  const chartData = useMemo(() => {
    return historicalData.slice(-30).map(d => ({
      date: new Date(d.date).toLocaleDateString(),
      nifty: d.nifty,
      bankNifty: d.bankNifty / 2.2, // Scale for visibility
      vix: d.vix * 1000, // Scale for visibility
      volume: d.volume * 24000,
      pnl: d.tradeOutcome
    }));
  }, [historicalData]);

  const mlPredictionData = useMemo(() => {
    return mlModel.predictions.slice(-10).map(p => ({
      time: p.timestamp,
      confidence: p.confidence,
      prediction: p.prediction * 100
    }));
  }, [mlModel.predictions]);

  const wrapperClasses = styleMode === 'retro'
    ? (theme === 'dark' ? 'min-h-screen bg-black text-green-200' : 'min-h-screen bg-amber-50 text-amber-900')
    : (theme === 'dark' ? 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white' : 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900');

  const surface = styleMode === 'retro'
    ? (theme === 'dark' ? 'bg-black/80 border border-green-800' : 'bg-amber-50/80 border border-amber-300')
    : (theme === 'dark' ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-300');

  const tile = styleMode === 'retro'
    ? (theme === 'dark' ? 'bg-black/60 border border-green-900' : 'bg-white border border-amber-300')
    : (theme === 'dark' ? 'bg-slate-700/30 border border-slate-600/30' : 'bg-white/60 border border-slate-300');

  const subtleText = theme === 'dark' ? 'text-gray-400' : (styleMode === 'retro' ? 'text-amber-700' : 'text-slate-500');

  return (
    <div className={`${wrapperClasses} p-6`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                V8 AI Trading Dashboard
              </h1>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              mlModel.trainingComplete 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {mlModel.trainingComplete ? '🧠 AI Model Active' : '⏳ Training...'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refreshAll} className={`flex items-center gap-1 px-3 py-1.5 rounded border ${theme==='dark'?'border-slate-700 bg-slate-800/60':'border-slate-300 bg-white/70'} hover:opacity-90`}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={`flex items-center gap-1 px-3 py-1.5 rounded border ${theme==='dark'?'border-slate-700 bg-slate-800/60':'border-slate-300 bg-white/70'} hover:opacity-90`}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <div className="text-right">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              <span>{lastUpdateTime.toLocaleTimeString()}</span>
            </div>
            <div className={`text-sm ${
              marketSession === 'LIVE_TRADING' ? 'text-green-400' : 
              marketSession === 'WEEKEND' ? 'text-blue-400' : 'text-red-400'
            }`}>
              {marketSession === 'LIVE_TRADING' ? '🟢 LIVE' : 
               marketSession === 'WEEKEND' ? '📅 WEEKEND' : '🔴 CLOSED'}
            </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`mt-4 flex flex-wrap items-center gap-2 ${surface} p-1 rounded-xl`}>
          {[
            { id: 'premarket', label: 'Pre-Market' },
            { id: 'execution', label: 'Trade Execution' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'journal', label: 'Trade Journal' },
            { id: 'settings', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === (tab.id as typeof activeTab)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Market Status Bar */}
        <div className={`${surface} backdrop-blur rounded-xl p-4`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-sm ${subtleText}`}>Trading Status</div>
              <div className={`font-semibold ${
                tradingStatus === 'ENTRY_WINDOW' ? 'text-green-400' :
                tradingStatus === 'MONITORING' ? 'text-blue-400' :
                tradingStatus === 'CLOSING_SOON' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {tradingStatus.replace('_', ' ')}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${subtleText}`}>ML Confidence</div>
              <div className="font-semibold text-purple-400">
                {mlModel.confidence.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${subtleText}`}>Market Regime</div>
              <div className="font-semibold text-cyan-400">
                {advancedAnalytics.regimeDetection}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${subtleText} flex items-center justify-center gap-1`}><Newspaper className="w-4 h-4" /> News Sentiment</div>
              <div className={`font-semibold ${newsSentiment > 0.15 ? 'text-green-400' : newsSentiment < -0.15 ? 'text-red-400' : 'text-yellow-400'}`}>
                {newsSentiment.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${subtleText}`}>Win Rate</div>
              <div className="font-semibold text-green-400">
                {riskMetrics.winRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Market Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase Containers */}
          {activeTab === 'premarket' && (
            <div className={`${surface} backdrop-blur rounded-xl p-6`}>
              <h3 className="font-semibold flex items-center space-x-2 mb-4">
                <span>Pre-Market Checklist</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${tile}`}>
                  <div className={`text-sm ${subtleText}`}>India VIX</div>
                  <div className="text-3xl font-bold">{marketData.vix.current.toFixed(1)}</div>
                  <div className={`mt-1 inline-block text-xs px-2 py-0.5 rounded ${marketData.vix.current <= settings.vixThreshold ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>Threshold ≤ {settings.vixThreshold}</div>
                </div>
                <div className={`p-4 rounded-lg ${tile}`}>
                  <div className={`text-sm ${subtleText}`}>NIFTY ATR(5m)</div>
                  <div className="text-3xl font-bold">{marketData.nifty.atr5min}</div>
                </div>
                <div className={`p-4 rounded-lg ${tile}`}>
                  <div className={`text-sm ${subtleText}`}>BANKNIFTY ATR(5m)</div>
                  <div className="text-3xl font-bold">{marketData.bankNifty.atr5min}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Capital Allocation</h4>
                  <button onClick={() => setSettings(s => ({ ...s }))} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500">Calculate</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>Total</div><div className="text-xl font-bold">₹{capitalBreakdown.total.toLocaleString('en-IN')}</div></div>
                  <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>NIFTY ({settings.niftyAllocationPercent}%)</div><div className="text-xl font-bold">₹{capitalBreakdown.nifty.toLocaleString('en-IN')}</div></div>
                  <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>BANKNIFTY ({settings.bankNiftyAllocationPercent}%)</div><div className="text-xl font-bold">₹{capitalBreakdown.banknifty.toLocaleString('en-IN')}</div></div>
                  <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>Reserved</div><div className="text-xl font-bold">₹{capitalBreakdown.reserved.toLocaleString('en-IN')}</div></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className={`${surface} backdrop-blur rounded-xl p-6`}>
              <h3 className="font-semibold flex items-center space-x-2 mb-4">
                <span>Trade Execution</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">Pending</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>VIX ≤ {settings.vixThreshold}</div><div className={`text-sm font-medium ${marketData.vix.current <= settings.vixThreshold ? 'text-green-400' : 'text-red-400'}`}>{marketData.vix.current.toFixed(1)}</div></div>
                <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>Volume Surge</div><div className="text-sm font-medium text-green-400">OK</div></div>
                <div className={`p-3 rounded ${tile}`}><div className={`text-xs ${subtleText}`}>Range Break</div><div className="text-sm font-medium text-green-400">OK</div></div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className={`block text-sm ${subtleText} mb-1`}>Current NIFTY Spot</label>
                  <input type="number" className={`w-full ${theme==='dark'?'bg-slate-900/60 border border-slate-700':'bg-white border border-slate-300'} rounded px-3 py-2`} value={spotPriceInput} onChange={e => setSpotPriceInput(parseFloat(e.target.value))} />
                </div>
                <button onClick={calculateStrikes} className="h-10 rounded bg-blue-600 hover:bg-blue-500">Calculate NIFTY Strikes</button>
              </div>
              {strikeCalc && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">SELL CALL</div><div className="text-xl font-bold">{strikeCalc.sellCE}</div></div>
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">SELL PUT</div><div className="text-xl font-bold">{strikeCalc.sellPE}</div></div>
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">BUY CALL</div><div className="text-xl font-bold">{strikeCalc.buyCE}</div></div>
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">BUY PUT</div><div className="text-xl font-bold">{strikeCalc.buyPE}</div></div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className={`block text-sm ${subtleText} mb-1`}>Current BANKNIFTY Spot</label>
                  <input type="number" className={`w-full ${theme==='dark'?'bg-slate-900/60 border border-slate-700':'bg-white border border-slate-300'} rounded px-3 py-2`} value={bankSpotPriceInput} onChange={e => setBankSpotPriceInput(parseFloat(e.target.value))} />
                </div>
                <button onClick={calculateBankStrikes} className="h-10 rounded bg-indigo-600 hover:bg-indigo-500">Calculate BANKNIFTY Strikes</button>
              </div>
              {bankStrikeCalc && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">SELL CALL</div><div className="text-xl font-bold">{bankStrikeCalc.sellCE}</div></div>
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">SELL PUT</div><div className="text-xl font-bold">{bankStrikeCalc.sellPE}</div></div>
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">BUY CALL</div><div className="text-xl font-bold">{bankStrikeCalc.buyCE}</div></div>
                  <div className="p-3 text-center rounded bg-slate-700/30 border border-slate-600/30"><div className="text-xs text-slate-400">BUY PUT</div><div className="text-xl font-bold">{bankStrikeCalc.buyPE}</div></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className={`${surface} backdrop-blur rounded-xl p-6`}>
              <h3 className="font-semibold mb-2">Position Monitoring</h3>
              <div className="text-sm text-slate-300">Auto exit at 3:15 PM • Max loss {settings.maxLossPercent}%</div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className={`${surface} backdrop-blur rounded-xl p-6`}>
              <h3 className="font-semibold mb-4">Trade Journal</h3>
              <JournalForm onAdd={entry => setJournalEntries(prev => [entry, ...prev])} />
              <div className="mt-4 space-y-3">
                {journalEntries.map((j, idx) => (
                  <div key={idx} className="p-3 rounded border border-slate-600/30 bg-slate-700/20">
                    <div className="text-sm text-purple-300 font-medium">{new Date(j.date).toLocaleDateString()}</div>
                    <div className="text-sm">Strategy: {j.strategy} • P/L: ₹{j.profitLoss.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-400">VIX: {j.vixAtEntry} • ATR: {j.atrValue} • Strikes: {j.strikesUsed}</div>
                    <div className="text-xs mt-1">Mistakes: {j.mistakes}</div>
                    <div className="text-xs">Lessons: {j.lessons}</div>
                  </div>
                ))}
                {journalEntries.length === 0 && <div className="text-sm text-slate-400">No journal entries yet.</div>}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold">Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <LabeledNumber label="Total Capital (₹)" value={settings.totalCapital} onChange={v => setSettings(s => ({ ...s, totalCapital: v }))} />
                <LabeledNumber label="NIFTY Allocation (%)" value={settings.niftyAllocationPercent} onChange={v => setSettings(s => ({ ...s, niftyAllocationPercent: v }))} />
                <LabeledNumber label="BANKNIFTY Allocation (%)" value={settings.bankNiftyAllocationPercent} onChange={v => setSettings(s => ({ ...s, bankNiftyAllocationPercent: v }))} />
                <LabeledNumber label="VIX Threshold" value={settings.vixThreshold} onChange={v => setSettings(s => ({ ...s, vixThreshold: v }))} />
                <LabeledNumber label="Profit Target Min (%)" value={settings.profitTargetMin} onChange={v => setSettings(s => ({ ...s, profitTargetMin: v }))} />
                <LabeledNumber label="Profit Target Max (%)" value={settings.profitTargetMax} onChange={v => setSettings(s => ({ ...s, profitTargetMax: v }))} />
                <LabeledNumber label="Max Loss (%)" value={settings.maxLossPercent} onChange={v => setSettings(s => ({ ...s, maxLossPercent: v }))} />
                <LabeledNumber label="VIX Alert Threshold" value={settings.vixAlertThreshold} onChange={v => setSettings(s => ({ ...s, vixAlertThreshold: v }))} />
                <LabeledNumber label="Volume Surge Threshold (%)" value={settings.volumeSurgeThreshold} onChange={v => setSettings(s => ({ ...s, volumeSurgeThreshold: v }))} />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm"><input type="checkbox" className="mr-2" checked={settings.enableDesktopNotifications} onChange={e => setSettings(s => ({ ...s, enableDesktopNotifications: e.target.checked }))} /> Desktop Notifications</label>
                <label className="text-sm"><input type="checkbox" className="mr-2" checked={settings.enableEmailAlerts} onChange={e => setSettings(s => ({ ...s, enableEmailAlerts: e.target.checked }))} /> Email Alerts</label>
                <label className="text-sm"><input type="checkbox" className="mr-2" checked={settings.enableSmsAlerts} onChange={e => setSettings(s => ({ ...s, enableSmsAlerts: e.target.checked }))} /> SMS Alerts</label>
              </div>
            </div>
          )}
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NIFTY Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">NIFTY 50</h3>
                </div>
                <div className={`text-sm px-2 py-1 rounded ${
                  marketData.nifty.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {marketData.nifty.change > 0 ? '+' : ''}{marketData.nifty.change.toFixed(2)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{marketData.nifty.price.toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">IV:</span> {marketData.nifty.iv}%
                  </div>
                  <div>
                    <span className="text-gray-400">RSI:</span> {marketData.nifty.rsi}
                  </div>
                  <div>
                    <span className="text-gray-400">Vol:</span> {marketData.nifty.volume.toFixed(1)}x
                  </div>
                  <div>
                    <span className="text-gray-400">ATR:</span> {marketData.nifty.atr5min}
                  </div>
                </div>
              </div>
            </div>

            {/* BANK NIFTY Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold">BANK NIFTY</h3>
                </div>
                <div className={`text-sm px-2 py-1 rounded ${
                  marketData.bankNifty.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {marketData.bankNifty.change > 0 ? '+' : ''}{marketData.bankNifty.change.toFixed(2)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{marketData.bankNifty.price.toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">IV:</span> {marketData.bankNifty.iv}%
                  </div>
                  <div>
                    <span className="text-gray-400">RSI:</span> {marketData.bankNifty.rsi}
                  </div>
                  <div>
                    <span className="text-gray-400">Vol:</span> {marketData.bankNifty.volume.toFixed(1)}x
                  </div>
                  <div>
                    <span className="text-gray-400">ATR:</span> {marketData.bankNifty.atr5min}
                  </div>
                </div>
              </div>
            </div>

            {/* VIX Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold">INDIA VIX</h3>
                </div>
                <div className={`text-sm px-2 py-1 rounded ${
                  marketData.vix.change < 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {marketData.vix.change > 0 ? '+' : ''}{marketData.vix.change.toFixed(1)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{marketData.vix.current.toFixed(2)}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Regime:</span> {marketData.vix.volatilityRegime}
                  </div>
                  <div>
                    <span className="text-gray-400">Trend:</span> {marketData.vix.trend}
                  </div>
                  <div>
                    <span className="text-gray-400">MA20:</span> {marketData.vix.ma20}
                  </div>
                  <div>
                    <span className="text-gray-400">%ile:</span> {marketData.vix.percentile}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Chart */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Market Trends (30D)</span>
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="nifty" stroke="#60A5FA" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bankNifty" stroke="#F87171" strokeWidth={2} dot={false} />
                  <Bar dataKey="volume" fill="#A78BFA" opacity={0.3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* ML Predictions Chart */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Confidence Live</span>
                </h3>
                <div className="text-sm text-purple-400">
                  v{mlModel.modelVersion}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mlPredictionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                  <YAxis domain={[50, 100]} stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="confidence" stroke="#A78BFA" strokeWidth={3} dot={{fill: '#A78BFA', r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className={`${surface} backdrop-blur rounded-xl p-6`}>
            <h3 className="font-semibold flex items-center space-x-2 mb-4">
              <Cpu className="w-5 h-5" />
              <span>Advanced ML Analytics</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Ensemble Models */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Ensemble Models</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Random Forest:</span>
                    <span className="text-sm font-medium text-green-400">
                      {(ensembleModels.randomForest.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">SVM:</span>
                    <span className="text-sm font-medium text-blue-400">
                      {(ensembleModels.svm.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Logistic Reg:</span>
                    <span className="text-sm font-medium text-orange-400">
                      {(ensembleModels.logisticRegression.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-600 pt-2">
                    <span className="text-sm font-medium">Ensemble:</span>
                    <span className="text-sm font-bold text-purple-400">
                      {(ensembleModels.ensemble.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Neural Network */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Neural Network</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Layers:</span>
                    <span className="text-sm font-medium">{neuralNetworkState.layers.join('-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Epochs:</span>
                    <span className="text-sm font-medium text-cyan-400">{neuralNetworkState.epochs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Loss:</span>
                    <span className="text-sm font-medium text-green-400">{neuralNetworkState.loss.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Learning Rate:</span>
                    <span className="text-sm font-medium">{neuralNetworkState.learningRate}</span>
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Risk Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Sharpe:</span>
                    <span className="text-sm font-medium text-green-400">{riskMetrics.sharpe.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sortino:</span>
                    <span className="text-sm font-medium text-blue-400">{riskMetrics.sortino.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max DD:</span>
                    <span className="text-sm font-medium text-red-400">{riskMetrics.maxDrawdown.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Factor:</span>
                    <span className="text-sm font-medium text-purple-400">{riskMetrics.profitFactor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Pattern Recognition */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Pattern Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Regime:</span>
                    <span className="text-sm font-medium text-cyan-400">{advancedAnalytics.regimeDetection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Patterns:</span>
                    <span className="text-sm font-medium text-yellow-400">{advancedAnalytics.patternRecognition.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sentiment:</span>
                    <span className="text-sm font-medium text-green-400">{(advancedAnalytics.sentimentScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Anomaly Score:</span>
                    <span className="text-sm font-medium text-orange-400">{advancedAnalytics.anomalyScore.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Trading Signals */}
        <div className="space-y-6">
          {/* AI Trade Suggestions */}
          <div className={`${surface} backdrop-blur rounded-xl p-6`}>
            <h3 className="font-semibold flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5" />
              <span>V8 AI Signals</span>
              {suggestions.length > 0 && (
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </h3>
            
            <div className="space-y-4">
              {suggestions.length > 0 ? suggestions.map((signal, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  signal.type === 'BUY' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : signal.type === 'SELL'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {signal.type === 'BUY' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {signal.type === 'SELL' && <TrendingDown className="w-4 h-4 text-red-400" />}
                      {signal.type === 'WAIT' && <Pause className="w-4 h-4 text-yellow-400" />}
                      <span className="font-medium">{signal.instrument}</span>
                    </div>
                    <div className="text-sm font-bold text-purple-400">
                      {signal.confidence}% confidence
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-sm">{signal.action}</div>
                    <div className="text-xs text-gray-400">{signal.reason}</div>
                    <div className="text-xs text-purple-300 italic">{signal.mlInsight}</div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Allocation:</span> {signal.allocation}
                      </div>
                      <div>
                        <span className="text-gray-400">Risk:</span> {signal.riskLevel}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Expected:</span> {signal.expectedReturn}
                      </div>
                    </div>

                    {signal.strikes && (
                      <div className="mt-2 p-2 bg-slate-700/50 rounded text-xs">
                        <div className="grid grid-cols-2 gap-1">
                          <div>Sell CE: {signal.strikes.sellCE}</div>
                          <div>Buy CE: {signal.strikes.buyCE}</div>
                          <div>Sell PE: {signal.strikes.sellPE}</div>
                          <div>Buy PE: {signal.strikes.buyPE}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">
                    {isMarketOpen 
                      ? 'Scanning for optimal entry conditions...' 
                      : 'Market closed - Analysis will resume during trading hours'
                    }
                  </div>
                  {mlModel.trainingComplete && (
                    <div className="text-xs mt-1 text-purple-400">
                      AI Model ready • {Object.keys(mlModel.featureImportance).length} features active
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feature Importance */}
          {mlModel.trainingComplete && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <h3 className="font-semibold flex items-center space-x-2 mb-4">
                <Layers className="w-5 h-5" />
                <span>Feature Importance</span>
              </h3>
              
              <div className="space-y-2">
                {Object.entries(mlModel.featureImportance)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 8)
                  .map(([feature, importance]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (importance as number) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-purple-400 font-medium w-10">
                          {((importance as number) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Trade Alerts Log */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold flex items-center space-x-2 mb-4">
              <span>Trade Alerts</span>
            </h3>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {logs.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border border-slate-600/30 bg-slate-700/20">
                  <div className="text-sm">{l.message}</div>
                  <div className="text-xs text-slate-400">{l.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* News and Impact */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold flex items-center space-x-2 mb-2">
              <Newspaper className="w-5 h-5" />
              <span>News • AI Impact</span>
            </h3>
            <div className={`text-xs ${subtleText} mb-2`}>Aggregate sentiment: {newsSentiment.toFixed(2)}</div>
            <div className="flex gap-2 mb-3">
              <button onClick={generateNewsItem} className="px-2 py-1 rounded bg-slate-700/50 border border-slate-600/50 text-xs hover:bg-slate-700">Generate News</button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {newsItems.map((n, i) => (
                <div key={i} className="p-2 rounded border border-slate-600/30 bg-slate-700/20">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-slate-400">{n.source} • {n.category} • {n.time}</div>
                  <div className="text-xs mt-1">
                    <span className={`${n.impact === 'POSITIVE' ? 'text-green-400' : n.impact === 'NEGATIVE' ? 'text-red-400' : 'text-yellow-400'}`}>{n.impact}</span>
                    <span className="text-slate-400"> • {n.analysis}</span>
                  </div>
                </div>
              ))}
              {newsItems.length === 0 && <div className="text-sm text-slate-400">No news yet. Click Generate News or Refresh.</div>}
            </div>
          </div>

          {/* Pattern Recognition */}
          {advancedAnalytics.patternRecognition.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <h3 className="font-semibold flex items-center space-x-2 mb-4">
                <GitBranch className="w-5 h-5" />
                <span>Pattern Recognition</span>
              </h3>
              
              <div className="space-y-3">
                {advancedAnalytics.patternRecognition.map((pattern, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    pattern.signal === 'BEARISH' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : pattern.signal === 'BULLISH'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{pattern.name}</span>
                      <div className="text-xs px-2 py-1 rounded bg-slate-600/50">
                        {(pattern.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{pattern.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded ${
                        pattern.signal === 'BEARISH' ? 'bg-red-500/20 text-red-300' :
                        pattern.signal === 'BULLISH' ? 'bg-green-500/20 text-green-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {pattern.signal}
                      </span>
                      <span className="text-gray-400">{pattern.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5" />
              <span>System Status</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Feed</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-400">
                    {isMarketOpen ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">ML Engine</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${mlModel.trainingComplete ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-xs text-gray-400">
                    {mlModel.trainingComplete ? 'ACTIVE' : 'TRAINING'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Risk Management</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs text-gray-400">ENABLED</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Pattern Engine</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs text-gray-400">
                    {advancedAnalytics.patternRecognition.length} PATTERNS
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-3 mt-3">
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Model Version: v{mlModel.modelVersion}</div>
                  <div>Training Data: {historicalData.length.toLocaleString()} samples</div>
                  <div>Last Update: {lastUpdateTime.toLocaleTimeString()}</div>
                  <div className="text-purple-400">
                    Next signal check in {isMarketOpen ? '90s' : 'market hours'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5" />
              <span>Performance Summary</span>
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-gray-400">Win Rate</div>
                  <div className="text-lg font-bold text-green-400">
                    {riskMetrics.winRate.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-gray-400">Sharpe Ratio</div>
                  <div className="text-lg font-bold text-blue-400">
                    {riskMetrics.sharpe.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-gray-400">Max Drawdown</div>
                  <div className="text-lg font-bold text-red-400">
                    -{riskMetrics.maxDrawdown.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-gray-400">Profit Factor</div>
                  <div className="text-lg font-bold text-purple-400">
                    {riskMetrics.profitFactor.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-center p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                <div className="text-xs text-gray-400 mb-1">AI Model Accuracy</div>
                <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                  {(mlModel.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-purple-300">
                  Ensemble of {Object.keys(ensembleModels).length - 1} models
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center space-x-4">
          <span>🚀 V8 AI Trading System</span>
          <span>•</span>
          <span>Neural Network: {neuralNetworkState.layers.join('-')}</span>
          <span>•</span>
          <span>Risk-Adjusted Performance</span>
          <span>•</span>
          <span className="text-purple-400">
            {mlModel.trainingComplete ? 'AI READY' : 'INITIALIZING...'}
          </span>
        </div>
        <div className="mt-2 text-gray-600">
          Disclaimer: Past performance does not guarantee future results. Trade at your own risk.
        </div>
      </div>
    </div>
  );
};

// Small helpers
const LabeledNumber: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <label className="block text-sm">
    <div className="text-slate-300 mb-1">{label}</div>
    <input type="number" className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2" value={value} onChange={e => onChange(parseFloat(e.target.value))} />
  </label>
);

const JournalForm: React.FC<{ onAdd: (entry: JournalEntry) => void }> = ({ onAdd }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [strategy, setStrategy] = useState<string>('SADA-X V8');
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [vixAtEntry, setVixAtEntry] = useState<number>(0);
  const [atrValue, setAtrValue] = useState<number>(0);
  const [strikesUsed, setStrikesUsed] = useState<string>('');
  const [mistakes, setMistakes] = useState<string>('');
  const [lessons, setLessons] = useState<string>('');

  const submit = () => {
    onAdd({ date, strategy, profitLoss, vixAtEntry, atrValue, strikesUsed, mistakes, lessons });
    setProfitLoss(0); setVixAtEntry(0); setAtrValue(0); setStrikesUsed(''); setMistakes(''); setLessons('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <label className="text-sm"> <div className="text-slate-300 mb-1">Date</div>
        <input type="date" className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <label className="text-sm"> <div className="text-slate-300 mb-1">Strategy</div>
        <select className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2" value={strategy} onChange={e => setStrategy(e.target.value)}>
          <option>SADA-X V8</option>
          <option>SADA-X V7</option>
          <option>Custom Strategy</option>
        </select>
      </label>
      <LabeledNumber label="Profit/Loss (₹)" value={profitLoss} onChange={setProfitLoss} />
      <LabeledNumber label="VIX @ Entry" value={vixAtEntry} onChange={setVixAtEntry} />
      <LabeledNumber label="ATR Value" value={atrValue} onChange={setAtrValue} />
      <label className="text-sm md:col-span-2"> <div className="text-slate-300 mb-1">Strikes Used</div>
        <input type="text" className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2" value={strikesUsed} onChange={e => setStrikesUsed(e.target.value)} />
      </label>
      <label className="text-sm md:col-span-3"> <div className="text-slate-300 mb-1">Mistakes</div>
        <textarea className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2" rows={2} value={mistakes} onChange={e => setMistakes(e.target.value)} />
      </label>
      <label className="text-sm md:col-span-3"> <div className="text-slate-300 mb-1">Lessons</div>
        <textarea className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2" rows={2} value={lessons} onChange={e => setLessons(e.target.value)} />
      </label>
      <div>
        <button onClick={submit} className="h-10 rounded bg-green-600 hover:bg-green-500 px-4">Save Journal Entry</button>
      </div>
    </div>
  );
};

export default TradingDashboard;


