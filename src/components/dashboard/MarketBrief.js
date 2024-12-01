import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart2,
  Clock,
  Activity,
  PieChart,
  AlertTriangle
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const MarketBrief = () => {
  const [marketData, setMarketData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://lab-accurate-mildly.ngrok-free.app/api/agent/market-stats', {
          method: "get",
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await response.json();
        setMarketData(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
    </div>;
  }

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  const MetricCard = ({ title, value, change, icon: Icon }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">{title}</span>
        <Icon className="text-blue-400" size={20} />
      </div>
      <div className="text-xl font-bold text-white mb-2">
        {value}
      </div>
      {change && (
        <div className={`flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  );

  const chartData = {
    labels: ['Market Cap', 'Volume 24h'],
    datasets: [{
      label: 'Market Overview',
      data: [
        marketData.market_cap_usd,
        marketData.volume_24h_usd
      ],
      backgroundColor: ['#3b82f6', '#60a5fa'],
      borderColor: ['#2563eb', '#3b82f6'],
      borderWidth: 1
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <Link to="/" className="text-blue-400 mb-4 inline-block hover:text-blue-300 transition-colors">
        &larr; Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Crypto Market Overview</h2>
        <div className="text-sm text-gray-400">
          <Clock className="inline-block mr-2" size={16} />
          Last updated: {new Date(marketData.last_updated * 1000).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Market Cap" 
          value={`$${formatNumber(marketData.market_cap_usd)}`}
          change={marketData.market_cap_change_24h}
          icon={DollarSign}
        />
        <MetricCard 
          title="24h Volume" 
          value={`$${formatNumber(marketData.volume_24h_usd)}`}
          change={marketData.volume_24h_change_24h}
          icon={Activity}
        />
        <MetricCard 
          title="Bitcoin Dominance" 
          value={`${marketData.bitcoin_dominance_percentage}%`}
          icon={PieChart}
        />
        <MetricCard 
          title="Active Cryptocurrencies" 
          value={formatNumber(marketData.cryptocurrencies_number)}
          icon={BarChart2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Market Cap ATH</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-400">ATH Value:</span>
              <span className="text-white ml-2">${formatNumber(marketData.market_cap_ath_value)}</span>
            </div>
            <div>
              <span className="text-gray-400">ATH Date:</span>
              <span className="text-white ml-2">
                {new Date(marketData.market_cap_ath_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Volume ATH</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-400">ATH Value:</span>
              <span className="text-white ml-2">${formatNumber(marketData.volume_24h_ath_value)}</span>
            </div>
            <div>
              <span className="text-gray-400">ATH Date:</span>
              <span className="text-white ml-2">
                {new Date(marketData.volume_24h_ath_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Current % from ATH:</span>
              <span className="text-red-400 ml-2">{marketData.volume_24h_percent_from_ath}%</span>
            </div>
          </div>
        </div>
      </div>

      {marketData.market_cap_change_24h < -5 && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle />
            <span className="font-semibold">Market Warning</span>
          </div>
          <p className="text-gray-300 mt-2">
            Significant market cap decrease in the last 24 hours. Consider reviewing your positions.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketBrief;