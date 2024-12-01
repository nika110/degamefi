import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Brain, BarChart2, Newspaper, AlertTriangle, Zap, LineChart, Cpu, ChevronRight, ExternalLink, DollarSign, Wallet } from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';

const Dashboard = ({ walletContext }) => {
  const [userName, setUserName] = useState('');
  const [activeAgent, setActiveAgent] = useState(null);
  const [newsHeadlines, setNewsHeadlines] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [marketVolatility, setMarketVolatility] = useState(null);
  const [unusualOptions, setUnusualOptions] = useState([]);
  const [activatedStrategies, setActivatedStrategies] = useState([]);

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem('questionnaireAnswers') || '{}');
    setUserName(storedAnswers.name || 'Crypto Investor');

    setNewsHeadlines([
      "Bitcoin Surpasses $70,000 as Institutional Adoption Grows",
      "Ethereum Layer 2 Solutions See Record Transaction Volume",
      "Solana DeFi Ecosystem Expansion Continues with New Projects"
    ]);

    setRiskAnalysis({
      overallRisk: "Moderate",
      topRisks: [
        "Market Volatility Due to Bitcoin Halving",
        "Regulatory Changes in Major Markets",
        "DeFi Protocol Security Concerns"
      ],
      marketSentiment: "Bullish",
      bitcoinDominance: "48%"
    });

    setMarketVolatility({
      currentLevel: "High",
      bitcoinFear: 65,
      hedgingStrategy: "Consider dollar-cost averaging into blue-chip cryptocurrencies"
    });

    setUnusualOptions([
      { symbol: "BTC", type: "Large Transfer", volume: "2,500 BTC", timeframe: "5min" },
      { symbol: "SOL", type: "Whale Activity", volume: "500,000 SOL", timeframe: "1hr" }
    ]);

    const strategies = JSON.parse(localStorage.getItem('activatedStrategies') || '[]');
    setActivatedStrategies(strategies);
  }, []);

  const getEthBalance = async (address) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      return (parseInt(balance, 16) / 1e18).toFixed(4);
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return null;
    }
  };

  
  const WalletButton = () => {
    const { walletAddress, walletType, ethBalance, solBalance, connectWallet, disconnectWallet } = walletContext;
    if (walletAddress) {
      return (
        <div className="bg-degamefi-gray-800 rounded-degamefi p-2 flex items-center space-x-2">
          <div className="flex flex-col sm:flex-row items-center bg-degamefi-blue-light rounded-full px-3 py-1 gap-2">
            <div className="flex items-center">
              <Wallet size={16} className="text-white mr-2" />
              <span className="text-white text-sm">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
            <div className="flex items-center text-white text-sm border-l border-white/20 pl-2 ml-2">
              {walletType === 'metamask' && ethBalance && (
                <span>{ethBalance} ETH</span>
              )}
              {walletType === 'phantom' && solBalance && (
                <span>{solBalance} SOL</span>
              )}
            </div>
          </div>
          <button 
            onClick={disconnectWallet}
            className="text-degamefi-gray-light hover:text-white text-sm px-2 py-1 rounded-degamefi transition-colors duration-300"
          >
            Disconnect
          </button>
        </div>
      );
    }

    return (
      <div className="relative inline-block">
      <button 
        className="bg-degamefi-blue-light hover:bg-degamefi-blue-dark text-white rounded-degamefi px-4 py-2 flex items-center transition-colors duration-300"
        onClick={() => document.getElementById('wallet-menu').classList.toggle('hidden')}
      >
        <Wallet size={20} className="mr-2" />
        Connect Wallet
      </button>
      <div id="wallet-menu" className="hidden absolute right-0 mt-2 w-48 rounded-degamefi shadow-lg bg-degamefi-gray-800 ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1">
          <button
            onClick={() => connectWallet('metamask')}
            className="flex items-center px-4 py-2 text-sm text-degamefi-gray-light hover:bg-degamefi-blue-light hover:text-white w-full transition-colors duration-300"
          >
            <img src="https://raw.githubusercontent.com/MetaMask/brand-resources/refs/heads/master/SVG/SVG_MetaMask_Icon_Color.svg" alt="MetaMask" className="w-5 h-5 mr-2" />
            MetaMask
          </button>
          <button
            onClick={() => connectWallet('phantom')}
            className="flex items-center px-4 py-2 text-sm text-degamefi-gray-light hover:bg-degamefi-blue-light hover:text-white w-full transition-colors duration-300"
          >
            <img src="https://avatars.githubusercontent.com/u/78782331?s=280&v=4" alt="Phantom" className="w-5 h-5 mr-2" />
            Phantom
          </button>
        </div>
      </div>
    </div>
    );
  };

  const aiAgents = [
    { title: 'NEWS GURU', description: 'Find Hot Investments', icon: Newspaper, color: 'bg-degamefi-blue-light' },
    { title: 'ANALYST PRO', description: 'Discover Hidden Risks', icon: AlertTriangle, color: 'bg-degamefi-blue' },
    { title: 'STRATEGY WHIZ', description: 'Hedge During Volatility', icon: LineChart, color: 'bg-degamefi-blue-dark' },
    { title: 'OPTIONS GURU', description: 'Spot Unusual Moves', icon: Zap, color: 'bg-degamefi-blue-light' },
  ];

  const dashboardItems = [
    { title: 'Top Performing Cryptos', path: '/top-cryptos', icon: TrendingUp },
    { title: 'Personalized Portfolio', path: '/portfolio-ideas', icon: Briefcase },
    // { title: 'AI-Powered Analysis (AAPL crypto)', path: '/fundamental-analysis', icon: Brain },
    { title: 'Market Brief', path: '/market-brief', icon: BarChart2 },
    { title: 'News Insights', path: '/news-insights', icon: Newspaper },
  ];

  const renderAgentContent = () => {
    switch(activeAgent) {
      case 0: // NEWS GURU
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-degamefi-blue-light">Latest Market-Moving Headlines</h4>
            <ul className="list-disc list-inside text-degamefi-gray-light">
              {newsHeadlines.map((headline, index) => (
                <li key={index}>{headline}</li>
              ))}
            </ul>
            <p className="text-degamefi-gray-light">These headlines could significantly impact market trends. Click below for detailed analysis.</p>
            <button className="bg-degamefi-blue-light text-white px-4 py-2 rounded-degamefi hover:bg-degamefi-blue transition-colors duration-300 flex items-center">
              Analyze Impact <ExternalLink className="ml-2" size={16} />
            </button>
          </div>
        );
      case 1: // ANALYST PRO
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-degamefi-blue-light">Current Risk Assessment</h4>
            <p className="text-degamefi-gray-light">Overall Market Risk: <span className="font-bold text-yellow-400">{riskAnalysis.overallRisk}</span></p>
            <h5 className="text-md font-semibold text-degamefi-blue-light">Top Risk Factors:</h5>
            <ul className="list-disc list-inside text-degamefi-gray-light">
              {riskAnalysis.topRisks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
            <button className="bg-degamefi-blue text-white px-4 py-2 rounded-degamefi hover:bg-degamefi-blue-dark transition-colors duration-300 flex items-center">
              Full Risk Report <ExternalLink className="ml-2" size={16} />
            </button>
          </div>
        );
      case 2: // STRATEGY WHIZ
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-degamefi-blue-light">Market Volatility Insights</h4>
            <p className="text-degamefi-gray-light">Current Volatility: <span className="font-bold text-red-400">{marketVolatility.currentLevel}</span></p>
            <p className="text-degamefi-gray-light">Recommended Strategy: {marketVolatility.hedgingStrategy}</p>
            <button className="bg-degamefi-blue-dark text-white px-4 py-2 rounded-degamefi hover:bg-degamefi-blue transition-colors duration-300 flex items-center">
              Customize Hedging Strategy <ExternalLink className="ml-2" size={16} />
            </button>
          </div>
        );
      case 3: // OPTIONS GURU
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-degamefi-blue-light">Unusual Options Activity</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-degamefi-gray-light">
                <thead>
                  <tr className="text-degamefi-blue-light">
                    <th className="text-left">Symbol</th>
                    <th className="text-left">Type</th>
            
                  </tr>
                </thead>
                <tbody>
                  {unusualOptions.map((option, index) => (
                    <tr key={index}>
                      <td>{option.symbol}</td>
                      <td>{option.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="bg-degamefi-blue-light text-white px-4 py-2 rounded-degamefi hover:bg-degamefi-blue transition-colors duration-300 flex items-center">
              Analyze Options Trends <ExternalLink className="ml-2" size={16} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-degamefi-gray-900 p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-degamefi-blue-light">
            Crypto Investment Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <WalletButton />
          </div>
        </div>
      </div>


  <div className="bg-degamefi-gray-800 rounded-degamefi p-4 md:p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-degamefi-blue-light mb-2 md:mb-0">Welcome, {userName}!</h2>
          </div>

          {activatedStrategies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-degamefi-blue-light mb-3">Your Activated Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activatedStrategies.map((strategy, index) => (
                  <div key={index} className="bg-degamefi-gray-700 rounded-degamefi p-3 shadow-md">
                    <h4 className="text-degamefi-blue-light font-semibold mb-2">{strategy.name} ({strategy.symbol})</h4>
                    <p className="text-degamefi-gray-light text-sm">Monthly Investment: ${strategy.monthlyInvestment}</p>
                    <p className="text-degamefi-gray-light text-sm">Duration: {strategy.investmentPeriod} months</p>
                    <div className="mt-2 flex items-center text-green-400">
                      <DollarSign size={16} className="mr-1" />
                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {aiAgents.map((agent, index) => (
              <div 
                key={index} 
                className={`${agent.color} rounded-degamefi p-3 shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${activeAgent === index ? 'ring-2 ring-degamefi-blue-light' : ''}`}
                onClick={() => setActiveAgent(activeAgent === index ? null : index)}
              >
                <agent.icon size={28} className="text-white mb-2" />
                <h3 className="text-white font-bold text-sm">{agent.title}</h3>
                <p className="text-white text-xs mt-1">{agent.description}</p>
              </div>
            ))}
          </div>

          {activeAgent !== null && (
            <div className="bg-degamefi-gray-700 rounded-degamefi p-4 mb-6 transition-all duration-300">
              {renderAgentContent()}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardItems.map((item, index) => (
            <Link key={index} to={item.path} className="block group">
              <div className="bg-degamefi-gray-800 rounded-degamefi p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:bg-degamefi-blue group-hover:text-white flex items-center justify-between">
                <div className="flex items-center">
                  <item.icon size={24} className="text-degamefi-blue-light group-hover:text-white mr-3" />
                  <h2 className="text-lg font-semibold text-degamefi-gray-light group-hover:text-white">
                    {item.title}
                  </h2>
                </div>
                <ChevronRight className="text-degamefi-blue-light group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;