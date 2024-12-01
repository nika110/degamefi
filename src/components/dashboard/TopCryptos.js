import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Loader2, Wallet, Coins } from 'lucide-react';

const TopCryptos = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://lab-accurate-mildly.ngrok-free.app/api/agent/coins', {
        method: "get",
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      const data = await response.json();
      setCryptos(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  const handleCryptoClick = (id) => {
    navigate(`/crypto/${id}`);
  };

  const getTypeIcon = (type) => {
    return type === 'token' ? <Wallet className="w-4 h-4" /> : <Coins className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-red-400 text-center">
          <p>{error}</p>
          <button 
            onClick={fetchCryptos}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <Link to="/" className="text-blue-400 mb-4 inline-block hover:text-blue-300 transition-colors">
        &larr; Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Top Cryptos</h2>
        <span className="text-sm text-gray-400">Total: {cryptos.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cryptos.map((crypto) => (
          <div
            key={crypto.id}
            onClick={() => handleCryptoClick(crypto.id)}
            className="bg-gray-800 rounded-xl p-4 shadow-lg hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-gray-600"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 p-2 rounded-lg">
                  {getTypeIcon(crypto.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{crypto.name}</h3>
                  <p className="text-sm text-gray-400">{crypto.symbol}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                  Rank #{crypto.rank}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-sm ${
                  crypto.type === 'token' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'
                }`}>
                  {crypto.type.toUpperCase()}
                </span>
                {crypto.is_new && (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm">
                    NEW
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {crypto.is_active ? 
                  <span className="text-green-400">Active</span> : 
                  <span className="text-red-400">Inactive</span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCryptos;