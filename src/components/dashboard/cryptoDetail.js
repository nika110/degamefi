import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Github, 
  Globe, 
  Youtube, 
  Facebook, 
  Twitter,
  Users,
  Code,
  Clock,
  Shield,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import TwitterSection from './TwitterSection';
const CryptoDetail = () => {
  const { coin_id } = useParams();
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState(null);
  const [twitterData, setTwitterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!coin_id) {
        setError('No crypto ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [cryptoResponse, twitterResponse, analysissResponse] = await Promise.all([
          fetch(`https://lab-accurate-mildly.ngrok-free.app/api/agent/coins/${coin_id}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }),
          fetch(`https://lab-accurate-mildly.ngrok-free.app/api/agent/twitter/${coin_id}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }),
          fetch(`https://lab-accurate-mildly.ngrok-free.app/api/agent/coins/analyze/${coin_id}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          })
        ]);

        if (!cryptoResponse.ok) throw new Error('Failed to fetch crypto details');
        if (!twitterResponse.ok) throw new Error('Failed to fetch Twitter data');
        if (!analysissResponse.ok) throw new Error('Failed to fetch analysis data');

        const [cryptoData, twitterData, analysisData] = await Promise.all([
          cryptoResponse.json(),
          twitterResponse.json(),
          analysissResponse.json()
        ]);

        setCryptoData(cryptoData.data);
        setTwitterData(twitterData.data);
        setAnalysisData(analysisData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coin_id]);

  const PriceSection = ({ price_metrics, technical_indicators, volume_analysis }) => {
    // Format large numbers with K/M/B suffix
    const formatNumber = (num) => {
      if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
      if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
      return `$${num.toFixed(2)}`;
    };
  
    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
            <p className="text-gray-300">{label}</p>
            <p className="text-white font-bold">{formatNumber(payload[0].value)}</p>
          </div>
        );
      }
      return null;
    };
  
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-3">Price Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Current Price</span>
              <DollarSign className="text-blue-400 w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">${price_metrics.current_price.toFixed(2)}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">24h Change</span>
              {price_metrics.price_change_percentage >= 0 ? 
                <TrendingUp className="text-green-400 w-4 h-4" /> : 
                <TrendingDown className="text-red-400 w-4 h-4" />
              }
            </div>
            <p className={`text-2xl font-bold ${
              price_metrics.price_change_percentage >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {price_metrics.price_change_percentage.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">24h Volume</span>
              <TrendingUp className="text-blue-400 w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(volume_analysis.volume)}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Market Cap</span>
              <DollarSign className="text-blue-400 w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(volume_analysis.market_cap)}</p>
          </div>
        </div>
  
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Price Movement</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'Low', price: price_metrics.low },
                  { name: 'Open', price: price_metrics.open },
                  { name: 'Current', price: price_metrics.current_price },
                  { name: 'High', price: price_metrics.high }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="supportZone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="resistanceZone" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                {/* Support and Resistance Zones */}
                <rect
                  x="0"
                  y={technical_indicators.support_level}
                  width="100%"
                  height={technical_indicators.resistance_level - technical_indicators.support_level}
                  fill="url(#supportZone)"
                />
                
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  domain={[
                    Math.min(price_metrics.low, technical_indicators.support_level) * 0.995,
                    Math.max(price_metrics.high, technical_indicators.resistance_level) * 1.005
                  ]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Main price line */}
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  dot={{ fill: '#60A5FA', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#60A5FA' }}
                />
                
                {/* Support and Resistance lines */}
                <ReferenceLine
                  y={technical_indicators.support_level}
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  label={{
                    value: `Support $${technical_indicators.support_level.toFixed(2)}`,
                    fill: '#10B981',
                    position: 'insideBottomLeft'
                  }}
                />
                <ReferenceLine
                  y={technical_indicators.resistance_level}
                  stroke="#EF4444"
                  strokeDasharray="3 3"
                  label={{
                    value: `Resistance $${technical_indicators.resistance_level.toFixed(2)}`,
                    fill: '#EF4444',
                    position: 'insideTopLeft'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Additional metrics below chart */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-sm">
              <span className="text-gray-400 block">Daily Range</span>
              <span className="text-white font-medium">${technical_indicators.daily_range}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400 block">Range %</span>
              <span className="text-white font-medium">{technical_indicators.range_percentage}%</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400 block">Volatility</span>
              <span className="text-white font-medium">{technical_indicators.volatility}%</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400 block">Close Strength</span>
              <span className="text-white font-medium">{(technical_indicators.close_strength * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  const TechnicalAnalysis = ({ technical_indicators, trading_signals }) => (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-3">Technical Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Market Indicators</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Market Trend</span>
              <span className={`font-semibold ${
                technical_indicators.market_trend === 'Bullish' ? 'text-green-400' : 'text-red-400'
              }`}>
                {technical_indicators.market_trend}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Volatility</span>
              <span className="text-white">{technical_indicators.volatility}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Daily Range</span>
              <span className="text-white">{technical_indicators.daily_range}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Trading Signal</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {trading_signals.primary_signal.includes('Bullish') ? 
                <TrendingUp className="text-green-400 w-5 h-5" /> :
                <TrendingDown className="text-red-400 w-5 h-5" />
              }
              <span className="text-white">{trading_signals.primary_signal}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-400 w-5 h-5" />
              <span className="text-gray-400">Confidence Score: </span>
              <span className="text-white">{(trading_signals.confidence_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
      </div>
    );
  }

  if (error || !cryptoData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Crypto not found'}</p>
          <button
            onClick={() => navigate('/top-cryptos')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Back to Top Cryptos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-3 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/top-cryptos')} 
          className="text-blue-400 mb-6 flex items-center hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Top Cryptos
        </button>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <img 
              src={cryptoData.logo} 
              alt={cryptoData.name}
              className="w-16 h-16 rounded-full bg-white p-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{cryptoData.name}</h1>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                  {cryptoData.symbol}
                </span>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                  Rank #{cryptoData.rank}
                </span>
              </div>
              <p className="text-gray-300 mt-2">{cryptoData.description}</p>
            </div>
          </div>
          {twitterData && <TwitterSection twitterData={twitterData} />}


          {analysisData && (
  <>
    <PriceSection 
      price_metrics={analysisData.price_metrics}
      technical_indicators={analysisData.technical_indicators}
      volume_analysis={analysisData.volume_analysis}
    />
    <TechnicalAnalysis 
      technical_indicators={analysisData.technical_indicators}
      trading_signals={analysisData.trading_signals}
    />
  </>
)}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Code size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Type</span>
              </div>
              <p className="text-lg text-white">{cryptoData.type}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Started</span>
              </div>
              <p className="text-lg text-white">
                {new Date(cryptoData.started_at).getFullYear()}
              </p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Status</span>
              </div>
              <p className="text-lg text-white">{cryptoData.development_status}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Structure</span>
              </div>
              <p className="text-lg text-white">{cryptoData.org_structure}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {cryptoData.tags.map((tag) => (
                <span 
                  key={tag.id}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-3">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cryptoData.team.map((member) => (
                <div 
                  key={member.id}
                  className="bg-gray-700 p-3 rounded-lg"
                >
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.position}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">Links</h2>
            <div className="flex flex-wrap gap-3">
              {cryptoData.links.website && (
                <a
                  href={cryptoData.links.website[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-blue-400 hover:bg-gray-600 transition-colors"
                >
                  <Globe size={16} />
                  <span>Website</span>
                </a>
              )}
              {cryptoData.links.source_code && (
                <a
                  href={cryptoData.links.source_code[0]}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-blue-400 hover:bg-gray-600 transition-colors"
                >
                  <Github size={16} />
                  <span>Source Code</span>
                </a>
              )}
              {cryptoData.links.youtube && (
                <a
                  href={cryptoData.links.youtube[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-blue-400 hover:bg-gray-600 transition-colors"
                >
                  <Youtube size={16} />
                  <span>YouTube</span>
                </a>
              )}
              {cryptoData.links.facebook && (
                <a
                  href={cryptoData.links.facebook[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-blue-400 hover:bg-gray-600 transition-colors"
                >
                  <Facebook size={16} />
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;