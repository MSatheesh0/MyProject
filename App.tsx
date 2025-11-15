import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const handleChatbotClick = () => {
    setIsChatbotOpen(true);
  };

  const handleChatbotClose = () => {
    setIsChatbotOpen(false);
  };

  return (
    <HashRouter>
      <div className={`app-container ${theme}`}>
        <Header currentTheme={theme} toggleTheme={toggleTheme} onChatbotClick={handleChatbotClick} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:projectId" element={<ProjectDetailPage />} />
          </Routes>
        </main>
        <Footer />
        <BackToTopButton />
        <ChatbotWidget isOpen={isChatbotOpen} onClose={handleChatbotClose} />
      </div>
    </HashRouter>
  );
};

export default App;
