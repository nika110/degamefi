import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  PieChart, 
  BarChart2, 
  CheckCircle, 
  ExternalLink, 
  Cpu, 
  Brain, 
  Target, 
  Clock, 
  Scale, 
  Bell, 
  RefreshCw, 
  Lightbulb,
  Wallet, 
  Shield, 
  BarChart,
  Info,
  Calculator,
  UserIcon, 
  TrendingDown 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart, Legend, ReferenceLine,
  ComposedChart, Bar
} from 'recharts';

export const PortfolioRoadmap = () => {
  const location = useLocation();
  const { etf, monthlyInvestment, investmentPeriod } = location.state || {};
  const [projectedData, setProjectedData] = useState([]);
  const [marketCycleData, setMarketCycleData] = useState([]);
  const [historicalPerformance, setHistoricalPerformance] = useState([]);
  const [riskLevel, setRiskLevel] = useState('Moderate');
  const [isLoading, setIsLoading] = useState(true);
  const [isStrategyActivated, setIsStrategyActivated] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  useEffect(() => {
    const savedRiskLevel = localStorage.getItem('questionnaireAnswers');
    if (savedRiskLevel) {
      const answers = JSON.parse(savedRiskLevel);
      setRiskLevel(answers['Risk Tolerance'] || 'Moderate');
    }
    if (etf && monthlyInvestment && investmentPeriod) {
      generateProjectedData();
      generateMarketCycleData();
      generateHistoricalData();
      setIsLoading(false);
    }
  }, [etf, monthlyInvestment, investmentPeriod]);

  const generateHistoricalData = () => {
    const historicalData = [
      { date: '2020', value: 10000, event: 'Post-Halving Rally' },
      { date: '2021', value: 65000, event: 'Bull Market Peak' },
      { date: '2022', value: 16000, event: 'Bear Market' },
      { date: '2023', value: 45000, event: 'Recovery' },
      { date: '2024', value: 52000, event: 'Current' },
      { date: '2024 Q4', value: 75000, event: 'Projected Rally' },
      { date: '2025', value: 95000, event: 'Bull Run' }
    ];
    setHistoricalPerformance(historicalData);
  };

  const generateMarketCycleData = () => {
    const phases = [
      { phase: 'Accumulation', duration: '4-6 months', confidence: 85 },
      { phase: 'Bull Run', duration: '6-8 months', confidence: 92 },
      { phase: 'Peak', duration: '2-3 months', confidence: 78 },
      { phase: 'Correction', duration: '3-4 months', confidence: 82 }
    ];

    const cycles = [];
    for (let i = 0; i <= investmentPeriod; i++) {
      const baseValue = 1000;
      let multiplier = 1;
      let phase = '';
      let probability = 0;

      if (i < investmentPeriod * 0.3) {
        multiplier = 1 + (i / (investmentPeriod * 0.3)) * 0.5;
        phase = 'Accumulation';
        probability = 75 + (i / (investmentPeriod * 0.3)) * 15;
      } else if (i < investmentPeriod * 0.7) {
        multiplier = 1.5 + ((i - investmentPeriod * 0.3) / (investmentPeriod * 0.4)) * 3;
        phase = 'Bull Run';
        probability = 90;
      } else {
        multiplier = 4.5 + ((i - investmentPeriod * 0.7) / (investmentPeriod * 0.3)) * 0.5;
        phase = 'Peak/Consolidation';
        probability = 85 - ((i - investmentPeriod * 0.7) / (investmentPeriod * 0.3)) * 15;
      }

      cycles.push({
        month: i,
        marketValue: baseValue * multiplier,
        bullRunProbability: probability,
        marketPhase: phase,
        potentialReturn: ((multiplier - 1) * 100).toFixed(2)
      });
    }
    setMarketCycleData(cycles);
  };

  const generateProjectedData = () => {
    const data = [];
    let totalInvestment = 0;
    let projectedValue = 0;
    const baseMonthlyReturn = Math.pow(1 + (parseFloat(etf.allocation) / 100), 1/12) - 1;

    for (let i = 0; i <= investmentPeriod; i++) {
      let monthlyReturn = baseMonthlyReturn;
      
      if (i > investmentPeriod * 0.3 && i < investmentPeriod * 0.7) {
        monthlyReturn *= 1.8; // Higher returns during bull run
      } else if (i >= investmentPeriod * 0.7) {
        monthlyReturn *= 1.3; // Moderate returns during maturity
      }

      if (i > 0) {
        totalInvestment += monthlyInvestment;
        projectedValue = (projectedValue + monthlyInvestment) * (1 + monthlyReturn);
      }

      data.push({
        month: i,
        totalInvestment,
        projectedValue: projectedValue.toFixed(2),
        monthlyReturn: (monthlyReturn * 100).toFixed(2),
        marketPhase: i < investmentPeriod * 0.3 ? 'Accumulation' 
                    : i < investmentPeriod * 0.7 ? 'Bull Run' 
                    : 'Maturity'
      });
    }
    setProjectedData(data);
  };

  const getProjectedOutcome = () => {
    if (projectedData.length === 0) return { totalInvested: 0, projectedValue: 0, profit: 0 };
    const lastDataPoint = projectedData[projectedData.length - 1];
    return {
      totalInvested: lastDataPoint.totalInvestment,
      projectedValue: parseFloat(lastDataPoint.projectedValue),
      profit: parseFloat(lastDataPoint.projectedValue) - lastDataPoint.totalInvestment,
    };
  };

  const projectedOutcome = getProjectedOutcome();

  const MarketCycleTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-degamefi-blue-light">
          <p className="text-white font-semibold mb-2">Month {label}</p>
          <p className="text-degamefi-blue-light">Phase: {data.marketPhase}</p>
          <p className="text-green-400">Potential Return: {data.potentialReturn}%</p>
          <p className="text-yellow-400">Bull Run Probability: {data.bullRunProbability}%</p>
        </div>
      );
    }
    return null;
  };

  const activateStrategy = () => {
    setIsStrategyActivated(true);
    const activatedStrategies = JSON.parse(localStorage.getItem('activatedStrategies') || '[]');
    const newStrategy = {
      symbol: etf.symbol,
      name: etf.name,
      monthlyInvestment,
      investmentPeriod,
      activationDate: new Date().toISOString(),
      expectedReturn: ((projectedOutcome.profit / projectedOutcome.totalInvested) * 100).toFixed(2)
    };
    activatedStrategies.push(newStrategy);
    localStorage.setItem('activatedStrategies', JSON.stringify(activatedStrategies));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-degamefi-blue-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Cpu className="w-12 h-12 text-degamefi-blue-light animate-spin mb-4 mx-auto" />
          <p className="text-white text-xl">AI is analyzing market data...</p>
        </div>
      </div>
    );
  }

  if (!etf || !monthlyInvestment || !investmentPeriod) {
    return (
      <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-degamefi-blue-dark min-h-screen">
        <Link to="/portfolio-ideas" className="text-degamefi-blue-light mb-4 inline-block hover:text-white transition-colors">
          <ArrowLeft className="inline mr-2" size={20} />
          Back to Portfolio Ideas
        </Link>
        <div className="text-center mt-12">
          <Info className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
          <p className="text-white text-2xl">Missing investment parameters. Please configure your strategy first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-degamefi-blue-dark min-h-screen">
      <Link to="/portfolio-ideas" className="text-degamefi-blue-light mb-4 inline-block hover:text-white transition-colors">
        <ArrowLeft className="inline mr-2" size={20} />
        Back to Portfolio Ideas
      </Link>

      {/* AI Strategy Header */}
      <div className="flex items-center gap-3 mb-8">
        <Cpu className="w-10 h-10 text-degamefi-blue-light" />
        <div>
          <h2 className="text-3xl font-bold text-white">AI-Optimized Crypto Strategy</h2>
          <p className="text-gray-400 mt-1">Personalized investment plan for {etf.symbol}</p>
        </div>
      </div>

      {/* Market Cycle Analysis */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-degamefi-blue-light mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Market Cycle Analysis
        </h3>
        <div className="h-60 sm:h-80 w-full mb-6"> 
        <ResponsiveContainer width="100%" height="100%">
  <ComposedChart data={marketCycleData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
    <XAxis dataKey="month" stroke="#E5E7EB" />
    <YAxis yAxisId="left" stroke="#E5E7EB" />
    <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
    <Tooltip content={<MarketCycleTooltip />} />
    <Legend />
    <Area
      yAxisId="left"
      type="monotone"
      dataKey="marketValue"
      stroke="#6366F1"
      fill="#6366F1"
      fillOpacity={0.3}
      name="Market Value"
    />
    <Bar
      yAxisId="right"
      dataKey="bullRunProbability"
      fill="#10B981"
      name="Bull Run Probability"
    />
 <ReferenceLine
  yAxisId="left"
  y={marketCycleData[0]?.marketValue}
  stroke="#EF4444"
  strokeDasharray="3 3"
  label={{ 
    value: 'Entry Point', 
    fill: '#FFFFFF', 
    fontSize: 12,
    fontWeight: 'bold',
    position: 'right',
    offset: 10,
    backgroundColor: '#EF4444',
    padding: 5,
  }}
/>
  </ComposedChart>
</ResponsiveContainer>
        </div>

        {/* Market Phase Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Current Phase</h4>
            <p className="text-degamefi-blue-light text-lg font-semibold">Accumulation</p>
            <p className="text-gray-400 text-sm mt-1">Optimal entry point for long-term growth</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Next Bull Run</h4>
            <p className="text-green-400 text-lg font-semibold">Estimated Q4 2024</p>
            <p className="text-gray-400 text-sm mt-1">High probability of significant gains</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Risk Level</h4>
            <p className="text-yellow-400 text-lg font-semibold">{riskLevel}</p>
            <p className="text-gray-400 text-sm mt-1">Aligned with your profile</p>
          </div>
        </div>
      </div>

      {/* Investment Strategy Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-degamefi-blue-light mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Strategy Highlights
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-gray-300">
                Monthly Investment: ${monthlyInvestment} for {investmentPeriod} months
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-gray-300">
                Projected Return: {((projectedOutcome.profit / projectedOutcome.totalInvested) * 100).toFixed(1)}%
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-gray-300">
                Investment Risk-adjusted returns match your {riskLevel.toLowerCase()} profile
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-degamefi-blue-light mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Projection
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Total Investment</p>
              <p className="text-white text-sm sm:text-lg font-semibold">
              ${projectedOutcome.totalInvested.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Projected Value</p>
              <p className="text-green-400 text-lg font-semibold">
                ${projectedOutcome.projectedValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Potential Profit</p>
              <p className="text-green-400 text-lg font-semibold">
                ${projectedOutcome.profit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Performance */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-degamefi-blue-light mb-6 flex items-center gap-2">
          <BarChart className="w-6 h-6" />
          Market Historical Analysis
        </h3>
        <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
    <LineChart data={historicalPerformance}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="date" stroke="#E5E7EB" />
      <YAxis yAxisId="left" stroke="#E5E7EB" />
      <Tooltip
        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #3B82F6' }}
        labelStyle={{ color: '#E5E7EB' }}
      />
      <Line yAxisId="left" type="monotone" dataKey="value" stroke="#3B82F6" dot={{ stroke: '#3B82F6', strokeWidth: 2 }} />
      <ReferenceLine yAxisId="left" y={52000} stroke="#10B981" strokeDasharray="3 3" label="Current Price" />
    </LineChart>
  </ResponsiveContainer>
        </div>
      </div>

      {/* Investment Timeline */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-degamefi-blue-light mb-4">Investment Timeline</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-degamefi-blue-light flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-medium">Start Investing</h4>
              <p className="text-gray-400">Begin with ${monthlyInvestment} monthly investment in {etf.symbol}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Target className="w-6 h-6 text-degamefi-blue-light flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-medium">Bull Run Phase</h4>
              <p className="text-gray-400">Expected significant value appreciation during Q4 2024 - 2025</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-medium">Target Exit Point</h4>
              <p className="text-gray-400">Opportunity to take profits or continue holding based on market conditions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activation Section */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-semibold text-degamefi-blue-light mb-4">Activate AI Strategy</h3>
        {isStrategyActivated ? (
          <div className="bg-green-600/20 border border-green-500 text-white p-4 rounded-lg flex items-center">
            <CheckCircle className="mr-3" size={24} />
            <div>
              <p className="font-medium">Strategy Successfully Activated!</p>
              <p className="text-gray-300 text-sm mt-1">
                Your investment plan for {etf.symbol} is now active. The AI will monitor your strategy
                and provide updates on market conditions.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-4">
              Ready to start your AI-guided investment journey? Our system will automatically
              execute trades and monitor market conditions for optimal results.
            </p>
            <button 
              onClick={activateStrategy}
              className="bg-degamefi-blue-light text-white px-6 py-3 rounded-lg hover:bg-degamefi-blue transition-colors duration-300 flex items-center gap-2"
            >
              <Cpu className="w-5 h-5" />
              Activate AI Strategy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioRoadmap;