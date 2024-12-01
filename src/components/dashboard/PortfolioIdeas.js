import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ExternalLink } from 'lucide-react';

export const PortfolioIdeas = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [dcaStrategy, setDcaStrategy] = useState(null);
  const [monthlyInvestment, setMonthlyInvestment] = useState(100);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolioSuggestions = async () => {
      try {
        const response = await fetch('https://lab-accurate-mildly.ngrok-free.app/api/agent/portfolio-suggestions', {
          method: 'get',
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await response.json();
        setRecommendations(data.data.longTermLowRiskPortfolioRecommendations);
        setDcaStrategy(data.data.dollarCostAveragingStrategy);
      } catch (error) {
        console.error('Error fetching portfolio suggestions:', error);
      }
    };

    fetchPortfolioSuggestions();
  }, []);

  const handleETFClick = (etf) => {
    navigate(`/portfolio-roadmap/${etf.symbol}`, {
      state: { etf, monthlyInvestment, investmentPeriod }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-degamefi-blue-dark min-h-screen">
      <Link to="/" className="text-degamefi-blue-light mb-4 inline-block hover:text-white transition-colors">&larr; Back to Dashboard</Link>
      <h2 className="text-3xl font-bold text-white mb-6">Your Personalized Investment Roadmap</h2>

      {recommendations && dcaStrategy ? (
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-degamefi-blue-light mb-4">Recommended Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.etfs.map((etf, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => handleETFClick(etf)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <TrendingUp size={20} className="text-degamefi-blue-light mr-2" />
                      <p className="font-bold text-white">{etf.symbol}</p>
                    </div>
                    <ExternalLink size={16} className="text-degamefi-blue-light" />
                  </div>
                  <p className="text-sm text-white mb-2">{etf.name}</p>
                  <p className="text-xs text-gray-300 mb-2">{etf.description}</p>
                  <p className="text-xs text-gray-400">Expense Ratio: {etf.expenseRatio}</p>
                  <p className="text-xs text-gray-400">Allocation: {etf.allocation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-degamefi-blue-light mb-4">Dollar Cost Averaging Strategy</h3>
            <ul className="space-y-3">
              {dcaStrategy.howToProceed.map((step, index) => (
                <li key={index} className="flex items-start">
                  <DollarSign size={20} className="text-degamefi-blue-light mr-2 mt-1 flex-shrink-0" />
                  <span className="text-white">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center text-white">Loading...</div>
      )}
    </div>
  );
};