import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import BottomNavigationBar from './components/BottomNav';
import FloatingChatIcon from './components/FloatingChatIcon';
import SettingsPanel from './components/SettingsPanel';
import { SettingsIcon } from './components/IconUtility';

// Pages
import HomePage from './pages/Home';
import WatchlistScreen from './pages/Watchlist';
import AISuggestionsPage from './pages/AISuggestions';
import HomeScreen from './pages/Predictions';
import ChatInterface from './pages/ChatPage';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80'
  };

  const isChatPage = location.pathname === '/chat';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        {/* Main content */}
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Watchlist" element={<WatchlistScreen />} />
            <Route path="/AISuggestions" element={<AISuggestionsPage />} />
            <Route path="/Predictions" element={<HomeScreen />} />
            <Route path="/chat" element={<ChatInterface />} />
          </Routes>
        </div>

        {/* Bottom navigation */}
        {!isChatPage && <BottomNavigationBar />}

        {/* Floating chat icon */}
        {!isChatPage && <FloatingChatIcon />}

        {/* Settings panel */}
        {isSettingsOpen && (
          <SettingsPanel 
            onClose={() => setIsSettingsOpen(false)}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            user={user}
          />
        )}

        {/* Settings button */}
        <button 
          onClick={() => setIsSettingsOpen(true)} 
          className="fixed top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md z-10"
        >
          <SettingsIcon className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
};

export default App; 