import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  AlertCircle, 
  Calendar,
  Clock,
  History,
  Timer,
  MenuIcon,
  X
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';


const Card = ({ children, className }) => (
  <div className={`rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const NewsInsights = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState({
    bullish: 0,
    bearish: 0,
    neutral: 0
  });
  const [categorizedNews, setCategorizedNews] = useState({
    upcoming: [],
    recent: [],
    past: []
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://lab-accurate-mildly.ngrok-free.app/api/agent/trending-news`, {
        method: "get",
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      const data = await response.json();
      setNewsData(data.data);
      analyzeSentiment(data.data);
      categorizeNewsByTime(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const categorizeNewsByTime = (news) => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    const categorized = news.reduce((acc, item) => {
      const newsDate = new Date(item.created_at);
      
      if (newsDate > now) {
        acc.upcoming.push(item);
      } else if (newsDate >= threeDaysAgo) {
        acc.recent.push(item);
      } else {
        acc.past.push(item);
      }
      return acc;
    }, { upcoming: [], recent: [], past: [] });

    setCategorizedNews(categorized);
  };

  const analyzeSentiment = (news) => {
    const sentiment = news.reduce((acc, item) => {
      const content = item.content.toLowerCase();
      if (content.includes('surge') || content.includes('rise') || content.includes('increase')) {
        acc.bullish++;
      } else if (content.includes('drop') || content.includes('fall') || content.includes('decrease')) {
        acc.bearish++;
      } else {
        acc.neutral++;
      }
      return acc;
    }, { bullish: 0, bearish: 0, neutral: 0 });
    
    setMarketSentiment(sentiment);
  };

  const filterNews = (newsArray) => {
    if (filter === 'all') return newsArray;
    
    return newsArray.filter(news => {
      const content = news.content.toLowerCase();
      return filter === 'bullish' ? 
        content.includes('surge') || content.includes('rise') || content.includes('increase') :
        content.includes('drop') || content.includes('fall') || content.includes('decrease');
    });
  };

  const NewsSection = ({ title, news, icon: Icon }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="text-blue-400 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-3 md:space-y-4">
        {filterNews(news).map((item, index) => (
          <div key={index} className="bg-gray-800 p-3 md:p-6 rounded-lg space-y-3 md:space-y-4 hover:bg-gray-750 transition-colors">
            <div className="flex flex-col gap-2 md:gap-3">
              <h3 className="text-base md:text-xl font-semibold text-white line-clamp-2 md:line-clamp-none">
                {item.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {item.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className="px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm bg-blue-500/10 text-blue-400 whitespace-nowrap hover:bg-blue-500/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 md:line-clamp-none">
              {item.content}
            </p>
            <div className="flex items-center gap-1.5 md:gap-2 text-gray-400 text-xs md:text-sm">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>{new Date(item.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {filterNews(news).length === 0 && (
          <p className="text-gray-400 text-sm md:text-base text-center py-4">No news in this category</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-red-400 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4" />
          <p>{error}</p>
          <button 
            onClick={fetchNews}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 py-3 md:py-6 space-y-3 md:space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <div className="p-3 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-white">Crypto News</h1>
              <button
                onClick={() => navigate('/news-alert')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-white text-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Updates
              </button>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => navigate('/news-alert')}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-white text-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>

          {/* Sentiment Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 ${isMobileMenuOpen ? 'block' : 'hidden md:grid'}`}>
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-400 flex-shrink-0" />
                <span className="text-white">Bullish Signals</span>
              </div>
              <span className="text-2xl font-bold text-green-400">{marketSentiment.bullish}</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-2">
                <TrendingDown className="text-red-400 flex-shrink-0" />
                <span className="text-white">Bearish Signals</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{marketSentiment.bearish}</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="text-yellow-400 flex-shrink-0" />
                <span className="text-white">Neutral Signals</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">{marketSentiment.neutral}</span>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className={`mb-6 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-auto bg-gray-800 text-white p-2 rounded-lg border border-gray-700"
            >
              <option value="all">All News</option>
              <option value="bullish">Bullish News</option>
              <option value="bearish">Bearish News</option>
            </select>
          </div>

          {/* News Sections */}
          <div className={isMobileMenuOpen ? 'block' : 'hidden md:block'}>
            <NewsSection title="Upcoming News" news={categorizedNews.upcoming} icon={Timer} />
            <NewsSection title="Recent News (Last 3 Days)" news={categorizedNews.recent} icon={Clock} />
            <NewsSection title="Past News" news={categorizedNews.past} icon={History} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NewsInsights;