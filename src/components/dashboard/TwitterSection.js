import { Twitter, MessageCircle, Repeat2, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const TwitterSection = ({ twitterData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!twitterData || !Array.isArray(twitterData) || twitterData.length === 0) return null;

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Date unavailable';
    }
  };

  // Show only first 3 tweets when collapsed
  const displayedTweets = isExpanded ? twitterData : twitterData.slice(0, 3);

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors mb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Twitter className="text-blue-400 w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Latest Twitter Updates</h2>
          </div>
          {isExpanded ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </button>
      
      <div className={`grid grid-cols-1 gap-3 transition-all ${
        isExpanded ? 'opacity-100' : 'opacity-90'
      }`}>
        {displayedTweets.map((tweet, index) => (
          <div 
            key={tweet.status_id || index}
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {tweet.user_image_link ? (
                  <img 
                    src={tweet.user_image_link} 
                    alt={tweet.user_name || 'Profile'}
                    className="w-10 h-10 rounded-full bg-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {tweet.user_name && (
                    <span className="font-semibold text-white">{tweet.user_name}</span>
                  )}
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(tweet.date)}
                  </span>
                </div>
                {tweet.status && (
                  <p className="text-gray-200 mt-2 break-words whitespace-pre-wrap">{tweet.status}</p>
                )}
                {tweet.media_link && (
                  <img 
                    src={tweet.media_link} 
                    alt="Tweet media"
                    className="mt-3 rounded-lg w-full max-w-lg object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="flex items-center gap-6 mt-3 text-gray-400">
                  <a 
                    href={tweet.status_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    View on Twitter
                  </a>
                  {typeof tweet.retweet_count === 'number' && (
                    <span className="flex items-center gap-2">
                      <Repeat2 className="w-4 h-4" />
                      {formatNumber(tweet.retweet_count)}
                    </span>
                  )}
                  {typeof tweet.like_count === 'number' && (
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {formatNumber(tweet.like_count)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {twitterData.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-650 transition-colors text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : `Show ${twitterData.length - 3} More Tweets`}
        </button>
      )}
    </div>
  );
};

export default TwitterSection;