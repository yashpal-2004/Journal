import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

import useStore from './store/useStore';

function App() {
  const { initAuth, fetchTodayData, fetchHistory, fetchUserDefaults } = useStore();

  React.useEffect(() => {
    const unsubAuth = initAuth();
    
    // Auto-sync on tab/window activation to bypass background browser throttling
    const handleActiveSync = () => {
      const state = useStore.getState();
      if (state.user) {
        fetchTodayData();
        fetchHistory();
        fetchUserDefaults();
      }
    };

    window.addEventListener('focus', handleActiveSync);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleActiveSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubAuth();
      window.removeEventListener('focus', handleActiveSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initAuth, fetchTodayData, fetchHistory, fetchUserDefaults]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
