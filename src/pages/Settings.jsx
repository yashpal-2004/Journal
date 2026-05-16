import React, { useState } from 'react';
import { 
  Bell, 
  Trash2, 
  RefreshCcw, 
  ShieldCheck,
  CloudUpload
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset today's tasks? This action cannot be undone.")) {
      // Implement reset logic here if needed
      alert("Today's progress has been reset.");
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear ALL history? This will delete all your data permanently.")) {
      // Implement clear logic
      alert("All history has been cleared.");
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="border-b-2 border-slate-200 pb-8 border-dashed">
        <h1 className="text-5xl md:text-6xl text-ink-blue">Settings</h1>
        <p className="text-2xl font-hand text-slate-500 mt-2">Adjust your desk setup</p>
      </header>

      <div className="max-w-2xl space-y-12">
        {/* App Settings */}
        <section className="paper-sheet overflow-hidden rotate-1">
          <div className="p-8 border-b-2 border-slate-100 border-dashed flex items-center gap-4">
            <Bell className="text-ink-blue w-8 h-8" />
            <h2 className="text-3xl">Journaling</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-hand text-ink-black">Daily Reminders</p>
                <p className="text-lg font-hand text-slate-400">Get a nudge to scribble your day</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-sm transition-colors relative border-2 border-ink-black ${notifications ? 'bg-marker-yellow' : 'bg-paper-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-ink-black transition-transform ${notifications ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="paper-sheet overflow-hidden -rotate-1">
          <div className="p-8 border-b-2 border-slate-100 border-dashed flex items-center gap-4">
            <CloudUpload className="text-ink-blue w-8 h-8" />
            <h2 className="text-3xl">Storage</h2>
          </div>
          <div className="p-8 space-y-6">
            <button 
              onClick={handleReset}
              className="w-full flex items-center gap-4 p-5 rounded-sm border-2 border-slate-100 hover:border-marker-yellow hover:bg-marker-yellow/10 transition-all text-ink-black"
            >
              <RefreshCcw className="w-6 h-6 text-ink-pencil" />
              <div className="text-left">
                <p className="text-2xl font-hand">Reset Today's Log</p>
                <p className="text-lg font-hand text-slate-400">Start fresh for today</p>
              </div>
            </button>

            <button 
              onClick={handleClearHistory}
              className="w-full flex items-center gap-4 p-5 rounded-sm border-2 border-rose-100 hover:bg-rose-50 transition-all text-rose-500"
            >
              <Trash2 className="w-6 h-6" />
              <div className="text-left">
                <p className="text-2xl font-hand">Burn All Records</p>
                <p className="text-lg font-hand text-rose-300">Permanently delete everything</p>
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="paper-sheet p-8 text-center space-y-4 rotate-2">
          <div className="w-16 h-16 bg-paper-200 rounded-sm flex items-center justify-center mx-auto border-2 border-slate-200">
            <ShieldCheck className="w-10 h-10 text-ink-blue" />
          </div>
          <div>
            <h3 className="text-3xl text-ink-blue">FocusFlow Journal</h3>
            <p className="text-xl font-hand text-slate-400">v1.0.0 • Made for you</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
