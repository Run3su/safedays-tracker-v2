import React, { useState, useEffect } from 'react';
import { Home, Calendar, Settings as SettingsIcon } from 'lucide-react';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import Settings from './pages/Settings';
import { Modal, Button } from './components/UIComponents';
import { CycleData } from './types';
import { format } from 'date-fns';

// Storage Key
const STORAGE_KEY = 'safedays_data';
const THEME_KEY = 'safedays_theme';

const App: React.FC = () => {
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CycleData | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'settings'>('home');
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_KEY) === 'dark' ||
        (!localStorage.getItem(THEME_KEY) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Pregnancy Modal State
  const [showPregnancyModal, setShowPregnancyModal] = useState(false);
  const [pregnancyDate, setPregnancyDate] = useState<string>('');

  // --- Effects ---
  useEffect(() => {
    // Simulate Supabase/API fetch
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Restore Date objects from strings
        parsed.lastPeriodDate = new Date(parsed.lastPeriodDate);
        if (parsed.pregnancyStart) parsed.pregnancyStart = new Date(parsed.pregnancyStart);
        // Ensure logs object exists for backward compatibility
        if (!parsed.logs) parsed.logs = {};
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse data");
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const saveData = (newData: CycleData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // --- Handlers ---
  const handleOnboardingComplete = (date: Date, cycleLength: number, periodLength: number) => {
    saveData({
      lastPeriodDate: date,
      cycleLength,
      periodLength,
      logs: {}
    });
    showToast("Setup complete!");
  };

  const handleUpdatePeriod = (date: Date) => {
    if (!data) return;
    saveData({
      ...data,
      lastPeriodDate: date
    });
    showToast(`Period start updated to ${format(date, 'MMM d, yyyy')}`);
  };

  const handleUpdateLength = (length: number) => {
    if (!data) return;
    saveData({
      ...data,
      cycleLength: length
    });
    showToast("Cycle length updated");
  };

  const handleUpdatePeriodLength = (length: number) => {
    if (!data) return;
    saveData({
      ...data,
      periodLength: length
    });
    showToast("Period duration updated");
  };

  const handleLogIntimacy = (date: Date, intimacyType: 'protected' | 'unprotected' | null) => {
    if (!data) return;
    const dateKey = format(date, 'yyyy-MM-dd');
    const newLogs = { ...data.logs };
    
    if (intimacyType) {
      newLogs[dateKey] = { ...newLogs[dateKey], intimacy: intimacyType };
      showToast("Intimacy logged");
    } else {
      // If null, remove the intimacy entry but keep the object if it has other props (in future)
      if (newLogs[dateKey]) {
        delete newLogs[dateKey].intimacy;
      }
      showToast("Intimacy log cleared");
    }

    saveData({
      ...data,
      logs: newLogs
    });
  };

  const handleTogglePregnancyMode = () => {
    if (!data) return;
    
    if (data.isPregnant) {
      // Turning OFF
      saveData({
        ...data,
        isPregnant: false,
        pregnancyStart: undefined
      });
      showToast("Pregnancy Mode Disabled");
    } else {
      // Turning ON - Open Modal to confirm Date
      setPregnancyDate(format(data.lastPeriodDate, 'yyyy-MM-dd'));
      setShowPregnancyModal(true);
    }
  };

  const handleConfirmPregnancy = () => {
    if (!data || !pregnancyDate) return;
    
    const start = new Date(pregnancyDate);
    saveData({
      ...data,
      isPregnant: true,
      pregnancyStart: start,
      lastPeriodDate: start // Sync last period date with LMP
    });
    
    setShowPregnancyModal(false);
    showToast("Pregnancy Mode Enabled! 🤰");
    setActiveTab('home');
  };

  const handleClearData = () => {
    setData(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast("All data cleared");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Render ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50 dark:bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-brand-200 dark:bg-brand-800 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-brand-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  // 1. Onboarding Check
  if (!data) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 2. Main App Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* Toast */}
      {toast && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none px-4 pt-10">
          <div className="bg-gray-900/95 dark:bg-white/95 backdrop-blur text-white dark:text-gray-900 px-6 py-4 rounded-2xl shadow-2xl text-sm font-medium text-center flex items-center justify-center gap-3 animate-fade-in-down pointer-events-auto max-w-sm w-full border border-gray-800 dark:border-gray-200">
            <span className="w-2.5 h-2.5 bg-green-400 dark:bg-green-500 rounded-full animate-pulse shrink-0"></span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen p-4 pb-24">
        {/* We use key to force re-render and trigger animation on tab change */}
        {activeTab === 'home' && (
          <Dashboard 
            key="home" 
            data={data} 
            onLogIntimacy={handleLogIntimacy}
          />
        )}
        {activeTab === 'calendar' && <CalendarView key="calendar" data={data} onUpdatePeriod={handleUpdatePeriod} />}
        {activeTab === 'settings' && (
          <Settings 
            key="settings" 
            data={data} 
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onUpdateLength={handleUpdateLength} 
            onUpdatePeriodLength={handleUpdatePeriodLength}
            onClearData={handleClearData} 
            onTogglePregnancyMode={handleTogglePregnancyMode}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)] z-40 pb-safe transition-colors duration-300">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
              activeTab === 'home' 
                ? 'text-brand-600 dark:text-brand-400 scale-105' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-105'
            }`}
          >
            <Home className={`w-6 h-6 transition-all duration-300 ${activeTab === 'home' ? 'fill-current drop-shadow-sm' : ''}`} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('calendar')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
              activeTab === 'calendar' 
                ? 'text-brand-600 dark:text-brand-400 scale-105' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-105'
            }`}
          >
            <Calendar className={`w-6 h-6 transition-all duration-300 ${activeTab === 'calendar' ? 'fill-current drop-shadow-sm' : ''}`} />
            <span className="text-[10px] font-medium">Calendar</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
              activeTab === 'settings' 
                ? 'text-brand-600 dark:text-brand-400 scale-105' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-105'
            }`}
          >
            <SettingsIcon className={`w-6 h-6 transition-all duration-300 ${activeTab === 'settings' ? 'fill-current drop-shadow-sm' : ''}`} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Pregnancy Setup Modal */}
      <Modal
        isOpen={showPregnancyModal}
        onClose={() => setShowPregnancyModal(false)}
        title="Pregnancy Setup"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To calculate your estimated due date, please confirm the first day of your last period (LMP).
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm"
                value={pregnancyDate}
                onChange={(e) => setPregnancyDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <Button fullWidth onClick={handleConfirmPregnancy}>
            Start Tracking
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default App;