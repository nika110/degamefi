import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  RefreshCcw, 
  MessageCircle, 
  Heart, 
  Share2,
  Loader2
} from 'lucide-react';

const NewsAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('http://localhost:8000/api/news-alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={fetchAlerts}
          className="mt-2 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Latest Updates</h2>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.status_id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
          >
            {/* Alert Header */}
            <div className="flex items-start gap-3 mb-3">
              <img 
                src={alert.user_image_link}
                alt={alert.user_name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{alert.user_name}</h3>
                  <span className="text-sm text-gray-400">
                    {formatDate(alert.date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Alert Content */}
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">
              {alert.status}
            </p>

            {/* Alert Footer */}
            <div className="flex items-center gap-6 text-gray-400">
              <a 
                href={alert.status_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">View</span>
              </a>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{alert.retweet_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{alert.like_count}</span>
              </div>
            </div>

            {/* Retweet Indicator */}
            {alert.is_retweet && (
              <div className="mt-2 text-sm text-gray-500">
                🔄 Retweeted
              </div>
            )}
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No updates available
        </div>
      )}
    </div>
  );
};

export default NewsAlert;