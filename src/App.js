import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Connection, PublicKey } from '@solana/web3.js';
import Dashboard from './components/Dashboard';
import ChatButton from './components/ChatButton';
import ChatModal from './components/ChatModal';
import TopCryptos from './components/dashboard/TopCryptos';
import { PortfolioIdeas } from './components/dashboard/PortfolioIdeas';
import { MarketBrief } from './components/dashboard/MarketBrief';
import { FundamentalAnalysis } from './components/dashboard/FundamentalAnalysis';
import NewsInsights from './components/dashboard/NewsInsights';
import { PortfolioRoadmap } from './components/dashboard/PortfolioRoadmap';
import Notifications from './components/Notifications';
import CryptoDetail from './components/dashboard/cryptoDetail';


import NewsAlert from './components/dashboard/NewsAlert';


const App = () => {
  const [currentView, setCurrentView] = useState('loading');
  const [showChat, setShowChat] = useState(false);
  
  // Wallet state
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState('');
  const [ethBalance, setEthBalance] = useState(null);
  const [solBalance, setSolBalance] = useState(null);

  useEffect(() => {

    document.cookie = "abuse_interstitial=lab-accurate-mildly.ngrok-free.app; path=/; domain=lab-accurate-mildly.ngrok-free.app; SameSite=Lax; Secure";

    const storedAnswers = localStorage.getItem('questionnaireAnswers');
    if (storedAnswers) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('questionnaire');
    }


    const storedWallet = localStorage.getItem('walletConnection');
    if (storedWallet) {
      const { address, type } = JSON.parse(storedWallet);
      reconnectWallet(address, type);
    }

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

  const getSolBalance = async () => {
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const publicKey = new PublicKey(window.solana.publicKey.toString());
      const balance = await connection.getBalance(publicKey);
      return (balance / 1e9).toFixed(4);
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return null;
    }
  };

  const reconnectWallet = async (address, type) => {
    if (type === 'metamask' && window.ethereum) {
      setWalletAddress(address);
      setWalletType('metamask');
      const balance = await getEthBalance(address);
      setEthBalance(balance);
    } else if (type === 'phantom' && window.solana?.isPhantom) {
      setWalletAddress(address);
      setWalletType('phantom');
      const balance = await getSolBalance();
      setSolBalance(balance);
    }
  };

  const connectWallet = async (walletName) => {
    try {
      if (walletName === 'metamask') {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWalletAddress(accounts[0]);
          setWalletType('metamask');
          const balance = await getEthBalance(accounts[0]);
          setEthBalance(balance);
          
          // Store connection info
          localStorage.setItem('walletConnection', JSON.stringify({
            address: accounts[0],
            type: 'metamask'
          }));
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', async (newAccounts) => {
            if (newAccounts.length > 0) {
              setWalletAddress(newAccounts[0]);
              const newBalance = await getEthBalance(newAccounts[0]);
              setEthBalance(newBalance);
              localStorage.setItem('walletConnection', JSON.stringify({
                address: newAccounts[0],
                type: 'metamask'
              }));
            } else {
              disconnectWallet();
            }
          });
        } else {
          window.open('https://metamask.io/download/', '_blank');
        }
      } else if (walletName === 'phantom') {
        if (window.solana && window.solana.isPhantom) {
          try {
            const resp = await window.solana.connect();
            setWalletAddress(resp.publicKey.toString());
            setWalletType('phantom');
            const balance = await getSolBalance();
            setSolBalance(balance);

            // Store connection info
            localStorage.setItem('walletConnection', JSON.stringify({
              address: resp.publicKey.toString(),
              type: 'phantom'
            }));

            // Listen for account changes
            window.solana.on('accountChanged', async () => {
              try {
                const newBalance = await getSolBalance();
                setSolBalance(newBalance);
              } catch (err) {
                console.error('Error updating Solana balance:', err);
              }
            });
          } catch (err) {
            console.error('Error connecting to Phantom:', err);
          }
        } else {
          window.open('https://phantom.app/', '_blank');
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    if (walletType === 'phantom' && window.solana) {
      window.solana.disconnect();
    }
    setWalletAddress('');
    setWalletType('');
    setEthBalance(null);
    setSolBalance(null);
    localStorage.removeItem('walletConnection');
  };

  // Create wallet context value
  const walletContextValue = {
    walletAddress,
    walletType,
    ethBalance,
    solBalance,
    connectWallet,
    disconnectWallet
  };

  return (
    <Router>
      <div className="bg-degamefi-blue-light min-h-screen text-degamefi-white font-sans">
        <Routes>
          <Route path="/" element={<Dashboard walletContext={walletContextValue} />} />
          <Route path="/top-cryptos" element={<TopCryptos />} />
          <Route path="/crypto/:coin_id" element={<CryptoDetail />} />
          <Route path='/news-alert' element={<NewsAlert />} />
          <Route path="/portfolio-ideas" element={
            <PortfolioIdeas

            />
          } />
          <Route path="/market-brief" element={
            <MarketBrief />
          } />
          <Route path="/fundamental-analysis" element={
            <FundamentalAnalysis />
          } />
          <Route path="/news-insights" element={<NewsInsights />} />
          <Route path="/portfolio-roadmap/:symbol" element={<PortfolioRoadmap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatButton onClick={() => setShowChat(true)} />
        {showChat && <ChatModal onClose={() => setShowChat(false)} isFromcryptoDetail={false} />}
      </div>
    </Router>
  );
};

export default App;