import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, BarChart2, PieChart, Activity, Database, Briefcase, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const FundamentalAnalysis = ({ analysis }) => {
  const [expandedSection, setExpandedSection] = useState('Overview');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderMetricComparison = (metric, value, average, higherIsBetter = true) => {
    const numericValue = parseFloat(value);
    const numericAverage = parseFloat(average);
    const isGood = higherIsBetter ? numericValue > numericAverage : numericValue < numericAverage;
    return (
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">{metric}</span>
        <div className="flex items-center">
          <span className={`text-sm font-bold ${isGood ? 'text-green-400' : 'text-red-400'}`}>{value}</span>
          <span className="text-xs text-gray-400 ml-2">(Avg: {average})</span>
        </div>
      </div>
    );
  };

  const renderSection = (title, icon, content) => (
    <div className="mb-4">
      <button 
        className="w-full flex justify-between items-center bg-gray-700 p-3 rounded-lg text-white"
        onClick={() => toggleSection(title)}
      >
        <span className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </span>
        {expandedSection === title ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expandedSection === title && (
        <div className="mt-2 bg-gray-800 p-3 rounded-lg">
          {content}
        </div>
      )}
    </div>
  );

  const radarChartData = [
    { metric: 'Profit', value: parseFloat(analysis.Profitability.NetProfitMargin), fullMark: 40 },
    { metric: 'Growth', value: Math.abs(parseFloat(analysis.RevenueAndGrowth.RevenueGrowth)), fullMark: 20 },
    { metric: 'Value', value: 50 - parseFloat(analysis.Valuation.PriceEarningsRatio), fullMark: 50 },
    { metric: 'Balance', value: parseFloat(analysis.BalanceSheetStrength.CurrentRatio) * 50, fullMark: 100 },
    { metric: 'Cash', value: parseFloat(analysis.CashFlow.FreeCashFlowPerShare) * 10, fullMark: 50 },
    { metric: 'Dividend', value: parseFloat(analysis.DividendAndCapitalReturn.DividendYield) * 100, fullMark: 5 },
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <Link to="/" className="text-degamefi-blue-light mb-4 inline-block hover:text-white transition-colors">&larr; Back</Link>
      <h2 className="text-2xl font-bold mb-4">AAPL crypto Analysis</h2>
      
      {renderSection('Overview', <Award size={20} className="mr-2" />, (
        <div>
          <div className="mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'white', fontSize: 10 }} />
                <Radar name="AAPL" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-degamefi-blue-light mb-2">85</div>
            <p className="text-sm">Strong financial position</p>
          </div>
        </div>
      ))}

      {renderSection('Profitability', <DollarSign size={20} className="mr-2" />, (
        <>
          {renderMetricComparison('Net Profit Margin', analysis.Profitability.NetProfitMargin, '20%')}
          {renderMetricComparison('Return on Equity', analysis.Profitability.ReturnOnEquity, '120%')}
          <p className="text-sm">Higher net profit margins mean the company keeps more of its sales as profit.</p>
        </>
      ))}

      {renderSection('Growth', <TrendingUp size={20} className="mr-2" />, (
        <>
          <p className="text-sm mb-2">Revenue: {analysis.RevenueAndGrowth.Revenue}</p>
          <p className="text-sm">Growth: {analysis.RevenueAndGrowth.RevenueGrowth}</p>
          <p className="text-sm">Growth indicates how quickly the company's sales are increasing.</p>
        </>
      ))}

      {renderSection('Valuation', <BarChart2 size={20} className="mr-2" />, (
        <>
          {renderMetricComparison('P/E Ratio', analysis.Valuation.PriceEarningsRatio, '30', false)}
          {renderMetricComparison('P/S Ratio', analysis.Valuation.PriceSalesRatio, '8', false)}
          <p className="text-sm">Valuation metrics help you assess if a crypto is over or underpriced compared to its earnings or sales.</p>
        </>
      ))}

      {renderSection('Balance Sheet', <Database size={20} className="mr-2" />, (
        <>
          {renderMetricComparison('Current Ratio', analysis.BalanceSheetStrength.CurrentRatio, '1.5')}
          {renderMetricComparison('Debt to Equity', analysis.BalanceSheetStrength.DebtToEquityRatio, '4', false)}
          <p className="text-sm">A healthy balance sheet indicates a company's financial stability.</p>
        </>
      ))}

      {renderSection('Cash Flow', <Activity size={20} className="mr-2" />, (
        <>
          <p className="text-sm mb-2">Free Cash Flow: {analysis.CashFlow.FreeCashFlow}</p>
          <p className="text-sm">FCF Per Share: {analysis.CashFlow.FreeCashFlowPerShare}</p>
          <p className="text-sm">Positive cash flow means the company has enough cash to invest in growth or pay dividends.</p>
        </>
      ))}

      {renderSection('Dividend', <PieChart size={20} className="mr-2" />, (
        <>
          {renderMetricComparison('Dividend Yield', analysis.DividendAndCapitalReturn.DividendYield, '1%')}
          {renderMetricComparison('Payout Ratio', analysis.DividendAndCapitalReturn.PayoutRatio, '25%', false)}
          <p className="text-sm">Dividends provide a way for companies to share profits with shareholders.</p>
        </>
      ))}

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-degamefi-blue-light mb-2">Outlook Summary</h4>
        <p className="text-sm">{analysis.FundamentalOutlookSummary}</p>
      </div>
    </div>
  );
};