import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { 
  Save, 
  Trash2, 
  Plus, 
  Settings as SettingsIcon, 
  Zap, 
  Circle,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { 
    userDefaults, 
    updateUserDefaults, 
    fetchUserDefaults,
    resetUserDefaults 
  } = useStore();
  const [newDefaultTitle, setNewDefaultTitle] = useState('');
  const [newDefaultCategory, setNewDefaultCategory] = useState('Work');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const unsub = fetchUserDefaults();
    return () => {
      if (typeof unsub === 'function') unsub();
      else if (unsub instanceof Promise) unsub.then(fn => typeof fn === 'function' && fn());
    };
  }, [fetchUserDefaults]);

  const handleReset = async () => {
    if (window.confirm("Restore the recommended 14-step routine? This will replace your current blueprint.")) {
      await resetUserDefaults();
      showSavedFeedback();
    }
  };

  const handleAddDefault = (e) => {
    e.preventDefault();
    if (!newDefaultTitle.trim()) return;
    
    const updated = [
      ...userDefaults,
      { title: newDefaultTitle.trim(), category: newDefaultCategory }
    ];
    updateUserDefaults(updated);
    setNewDefaultTitle('');
    showSavedFeedback();
  };

  const removeDefault = (index) => {
    const updated = userDefaults.filter((_, i) => i !== index);
    updateUserDefaults(updated);
    showSavedFeedback();
  };

  const showSavedFeedback = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6 animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-slate-200 pb-8 border-dashed gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2 md:p-3 bg-paper-100 rounded-sm rotate-3 border border-slate-200 shadow-sm">
            <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-ink-pencil" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-hand text-ink-blue leading-none">Journal Settings</h1>
            <p className="text-lg md:text-xl font-hand text-slate-400 mt-1">Customize your daily blueprint</p>
          </div>
        </div>
        
        <AnimatePresence>
          {isSaved && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-marker-green font-display text-sm bg-marker-green/10 px-3 py-1 rounded-sm self-start md:self-center"
            >
              <Save className="w-4 h-4" />
              SAVES PERSISTED
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Master Routine Editor */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RefreshCcw className="w-5 h-5 md:w-6 md:h-6 text-ink-pencil/40" />
            <h2 className="text-2xl md:text-3xl font-hand text-ink-black underline decoration-marker-yellow decoration-4 underline-offset-[-2px]">
              Daily Blueprint
            </h2>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 text-xs font-display text-slate-400 hover:text-ink-blue transition-colors px-3 py-2 border border-slate-200 rounded-sm bg-paper-50 w-full sm:w-auto"
          >
            <RefreshCcw className="w-3 h-3" />
            RESTORE RECOMMENDED
          </button>
        </div>

        <div className="paper-sheet p-6 md:p-8 shadow-xl -rotate-1 border-ink-blue/5">
          <p className="text-lg md:text-xl font-hand text-slate-500 mb-8 border-b border-slate-100 pb-4 italic">
            These tasks will be available to load at the start of every new day.
          </p>

          <form onSubmit={handleAddDefault} className="flex flex-col md:flex-row gap-4 mb-10 pb-10 border-b border-slate-100 border-dashed">
            <input
              type="text"
              placeholder="Habit title (e.g. Read 5 pages)..."
              className="flex-1 bg-paper-50 border-2 border-slate-100 focus:border-ink-blue/20 focus:ring-0 rounded-sm px-4 py-3 text-xl md:text-2xl font-hand shadow-inner w-full"
              value={newDefaultTitle}
              onChange={(e) => setNewDefaultTitle(e.target.value)}
            />
            <div className="flex gap-2 w-full md:w-auto">
              <select
                className="flex-1 md:flex-none bg-paper-50 border-2 border-slate-100 focus:border-ink-blue/20 focus:ring-0 rounded-sm px-4 py-3 text-lg md:text-xl font-hand"
                value={newDefaultCategory}
                onChange={(e) => setNewDefaultCategory(e.target.value)}
              >
                <option value="Work">Priority</option>
                <option value="Routine">Routine</option>
              </select>
              <button 
                type="submit"
                className="flex-1 md:flex-none bg-ink-blue text-paper-50 px-6 py-3 rounded-sm font-display text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                ADD
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {userDefaults.length === 0 ? (
              <div className="text-center py-12 opacity-30 italic font-hand text-xl md:text-2xl">
                Your blueprint is empty. Add your first habit above!
              </div>
            ) : (
              userDefaults.map((task, index) => (
                <motion.div 
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-start justify-between p-4 bg-paper-50/50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all rounded-sm gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1.5 flex-shrink-0">
                      {task.category === 'Work' ? (
                        <Zap className="w-5 h-5 text-marker-yellow" />
                      ) : (
                        <Circle className="w-5 h-5 text-marker-green" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-xl md:text-2xl font-hand text-ink-black break-words leading-tight">{task.title}</span>
                      <span className={`self-start text-[10px] font-display px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        task.category === 'Work' ? 'bg-marker-yellow/20 text-ink-pencil' : 'bg-marker-green/20 text-ink-blue'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeDefault(index)}
                    className="md:opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Persistence Note */}
      <footer className="paper-sheet p-6 bg-paper-50/50 border-slate-100 opacity-60">
        <p className="text-base md:text-lg font-hand text-slate-500 italic">
          Tip: Your blueprint is saved in the cloud. You can access it from any device where you're logged into FocusFlow.
        </p>
      </footer>
    </div>
  );
};

export default Settings;
