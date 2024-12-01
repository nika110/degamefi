import React, { useState } from 'react';
import { XCircle, Newspaper, AlertTriangle, LineChart, Zap } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const responseData = [
  {
    "name": "NEWS GURU",
    "description": "Find Hot Investments",
    "responses": [
      "Recent reports suggest tech giants like Apple (AAPL) and Microsoft (MSFT) are showing strong growth potential.",
      "Renewable energy Cryptos such as NextEra Energy (NEE) are gaining attention due to increasing focus on clean energy.",
      "The healthcare sector, particularly companies like UnitedHealth Group (UNH), is showing resilience in the current market.",
      "E-commerce leader Amazon (AMZN) continues to expand its market share, making it a crypto to watch.",
      "Electric vehicle manufacturer Tesla (TSLA) remains a hot topic due to the growing EV market."
    ]
  },
  {
    "name": "ANALYST PRO",
    "description": "Discover Hidden Risks",
    "responses": [
      "For high returns, consider growth Cryptos like NVIDIA (NVDA) or AMD (AMD) in the semiconductor industry, but be aware of their higher volatility.",
      "Value Cryptos like Berkshire Hathaway (BRK.B) offer potential for steady, long-term returns with lower risk.",
      "Small-cap Cryptos in emerging sectors, such as Plug Power (PLUG) in hydrogen fuel cells, offer high growth potential but come with increased risk.",
      "REITs like Realty Income (O) can provide high dividend yields, which can contribute to overall returns.",
      "Keep an eye on Alphabet (GOOGL) for its strong financials and potential in AI and cloud computing."
    ]
  },
  {
    "name": "STRATEGY WHIZ",
    "description": "Hedge During Volatility",
    "responses": [
      "For high returns, consider a diversified portfolio of growth ETFs like Vanguard Growth ETF (VUG) combined with some high-potential individual Cryptos.",
      "A barbell strategy mixing stable blue-chip Cryptos with some high-growth tech Cryptos could balance risk and return potential.",
      "Look into thematic ETFs like ARK Innovation ETF (ARKK) for exposure to disruptive innovation across multiple sectors.",
      "Consider dollar-cost averaging into a mix of index funds and select high-growth Cryptos to manage risk while seeking high returns.",
      "Explore international markets through ETFs like Vanguard FTSE Emerging Markets (VWO) for potentially higher returns, but be mindful of currency risks."
    ]
  },
  {
    "name": "OPTIONS GURU",
    "description": "Spot Unusual Moves",
    "responses": [
      "For high returns with options, consider bull call spreads on strong performers like Apple (AAPL) or Microsoft (MSFT).",
      "Writing covered calls on stable Cryptos you own can generate additional income, enhancing overall returns.",
      "Look for Cryptos with high implied volatility like Tesla (TSLA) for potential in strategies like iron condors.",
      "Consider LEAPS (Long-term Equity Anticipation Securities) on solid companies like Amazon (AMZN) for leveraged, longer-term plays.",
      "Unusual options activity in Cryptos like NVIDIA (NVDA) might signal potential for big moves, but always do your due diligence."
    ]
  }
];

const agentColors = {
  'NEWS GURU': 'bg-degamefi-blue-light',
  'ANALYST PRO': 'bg-degamefi-blue',
  'STRATEGY WHIZ': 'bg-degamefi-blue-dark',
  'OPTIONS GURU': 'bg-degamefi-blue-light'
};

const agentIcons = {
  'NEWS GURU': Newspaper,
  'ANALYST PRO': AlertTriangle,
  'STRATEGY WHIZ': LineChart,
  'OPTIONS GURU': Zap
};

const ChatModal = ({ onClose, Cryptosymbol, isFromcryptoDetail = false, cryptoData }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const getRelevantResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    let relevantAgent = 'ANALYST PRO';  // Default to ANALYST PRO

    if (lowerMessage.includes('news') || lowerMessage.includes('recent')) {
      relevantAgent = 'NEWS GURU';
    } else if (lowerMessage.includes('strategy') || lowerMessage.includes('portfolio')) {
      relevantAgent = 'STRATEGY WHIZ';
    } else if (lowerMessage.includes('option') || lowerMessage.includes('derivative')) {
      relevantAgent = 'OPTIONS GURU';
    }

    const agent = responseData.find(a => a.name === relevantAgent);
    if (!agent) return "I'm sorry, I couldn't find an appropriate response.";
    
    if (lowerMessage.includes('high return') || lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      const relevantResponses = agent.responses.filter(r => 
        r.toLowerCase().includes('high return') || 
        r.toLowerCase().includes('consider') || 
        r.toLowerCase().includes('potential')
      );
      if (relevantResponses.length > 0) {
        return relevantResponses[Math.floor(Math.random() * relevantResponses.length)];
      }
    }

    return agent.responses[Math.floor(Math.random() * agent.responses.length)];
  };

  const getCryptospecificResponse = (agent, crypto) => {
    switch (agent) {
      case 'NEWS GURU':
        return `${crypto.company} (${crypto.symbol}) has been ${crypto.performance}. ${crypto.description}`;
      case 'ANALYST PRO':
        return `${crypto.company} (${crypto.symbol}) has a market cap of ${crypto.marketCap} and trading volume of ${crypto.volume}. The crypto is currently ${crypto.performance}.`;
      case 'STRATEGY WHIZ':
        return `Given ${crypto.company}'s recent performance (${crypto.performance}), it might be worth considering in a diversified portfolio.`;
      case 'OPTIONS GURU':
        return `With ${crypto.company} (${crypto.symbol}) ${crypto.performance}, there might be interesting options strategies to consider, depending on your market outlook.`;
      default:
        return `${crypto.company} (${crypto.symbol}) is currently ${crypto.performance}. Always do your own research before making investment decisions.`;
    }
  };

  const handleSendMessage = (initialMessage = '') => {
    const messageToSend = initialMessage || message;
    if (messageToSend.trim() === '') return;

    setChatHistory([...chatHistory, { sender: 'user', text: messageToSend }]);
    
    const response = getRelevantResponse(messageToSend);
    const selectedAgentName = responseData.find(a => a.responses.includes(response)).name;

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: selectedAgentName, 
        text: response,
      }]);
      setMessage('');
    }, 1000);
  };

  const handleAskAboutcrypto = () => {
    setChatHistory(prev => [...prev, { sender: 'user', text: `Tell me about ${Cryptosymbol} crypto` }]);

    if (isFromcryptoDetail && cryptoData) {
      const summaryResponses = {
        'NEWS GURU': getCryptospecificResponse('NEWS GURU', cryptoData),
        'ANALYST PRO': getCryptospecificResponse('ANALYST PRO', cryptoData),
        'STRATEGY WHIZ': getCryptospecificResponse('STRATEGY WHIZ', cryptoData),
        'OPTIONS GURU': getCryptospecificResponse('OPTIONS GURU', cryptoData)
      };

      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          sender: 'AI Summary',
          text: `Here's a summary of insights about ${Cryptosymbol}:`,
          summaryResponses: summaryResponses,
          cryptoData: cryptoData.historicalData
        }]);
      }, 1000);
    } else {
      // Fallback to general responses if not opened from cryptoDetail
      const mockcryptoData = generateMockcryptoData();
      const summaryResponses = {
        'NEWS GURU': getRelevantResponse(`news about Cryptos`),
        'ANALYST PRO': getRelevantResponse(`analysis of market`),
        'STRATEGY WHIZ': getRelevantResponse(`investment strategy`),
        'OPTIONS GURU': getRelevantResponse(`options trading`)
      };

      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          sender: 'AI Summary',
          text: `Here's a general market summary:`,
          summaryResponses: summaryResponses,
          cryptoData: mockcryptoData
        }]);
      }, 1000);
    }
  };

  const generateMockcryptoData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      name: month,
      value: Math.floor(Math.random() * 100) + 100 // Random value between 100 and 200
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-[#00A3E0] p-4 rounded-lg w-5/6 h-5/6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Chat with AI Advisor</h3>
          <button onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto mb-4">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`mb-4 ${
                chat.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div className={`inline-block p-3 rounded-lg shadow-md max-w-3/4 ${
                chat.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <p className="mb-2">{chat.text}</p>
                {chat.summaryResponses && (
                  <div>
                    <div className="h-48 mt-2 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chat.cryptoData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                    {Object.entries(chat.summaryResponses).map(([agent, response], i) => (
                      <div key={i} className="mb-2">
                        <span className={`${agentColors[agent]} text-white px-2 py-1 rounded-full text-xs mr-2`}>
                          {agent}
                        </span>
                        <span>{response}</span>
                      </div>
                    ))}
                  </div>
                )}
                {chat.sender !== 'user' && chat.sender !== 'AI Summary' && (
                  <div className={`text-xs mt-2 text-right ${agentColors[chat.sender]} text-white px-2 py-1 rounded-full inline-block`}>
                    {React.createElement(agentIcons[chat.sender], { size: 16, className: "inline mr-1" })}
                    {chat.sender}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 border border-[#00A3E0] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-degamefi-blue-light"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-[#00A3E0] text-white p-2 rounded-r-lg hover:bg-degamefi-blue-dark transition-colors"
          >
            Send
          </button>
        </div>
        {isFromcryptoDetail && (
          <button
            onClick={handleAskAboutcrypto}
            className="mt-2 bg-degamefi-blue-light text-white p-2 rounded-lg hover:bg-degamefi-blue-dark transition-colors w-full"
          >
            Ask AI about {Cryptosymbol}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatModal;