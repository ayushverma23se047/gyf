import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import CatalogPage from './components/CatalogPage';
import FloatingClothes from './components/FloatingClothes';
import CameraCapture from './components/CameraCapture';
import AuthModals from './components/AuthModals';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [userPreferences, setUserPreferences] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleStartCamera = () => {
    setCurrentView('camera');
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleCloseSignup = () => {
    setShowSignupModal(false);
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleCameraAnalysisComplete = (analysis, preferences, prompt) => {
    setAnalysisResult(analysis);
    setUserPreferences(preferences);
    setUserPrompt(prompt);
    setCurrentView('catalog');
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setUserPreferences(null);
    setAnalysisResult(null);
    setUserPrompt('');
  };

  const handleCategorySelect = (category) => {
    // Category selection is handled in the CategoryModal
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <FloatingClothes />
        
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header 
            onLogoClick={handleBackHome} 
            onCategorySelect={handleCategorySelect}
            onShowLogin={handleShowLogin}
          />
          
          {currentView === 'home' && (
            <Hero 
              onStartCamera={handleStartCamera}
              onShowLogin={handleShowLogin}
            />
          )}
          
          {currentView === 'catalog' && userPreferences && (
            <CatalogPage 
              preferences={userPreferences}
              prompt={userPrompt}
              analysisResult={analysisResult}
              onBack={handleBackHome}
            />
          )}

          <CameraCapture
            isOpen={currentView === 'camera'}
            onClose={handleBackHome}
            onAnalysisComplete={handleCameraAnalysisComplete}
          />

          <AuthModals
            isLoginOpen={showLoginModal}
            isSignupOpen={showSignupModal}
            onCloseLogin={handleCloseLogin}
            onCloseSignup={handleCloseSignup}
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </motion.div>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;   