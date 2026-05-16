import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  PieChart, 
  Zap, 
  Flame 
} from 'lucide-react';
import { format, subDays, addDays, parseISO } from 'date-fns';

const Dashboard = () => {
  const { 
    todayData, 
    isLoading, 
    fetchTodayData, 
    fetchHistory,
    getStreaks,
    addTask, 
    toggleTask, 
    deleteTask, 
    updateTaskNote, 
    updateCommentary,
    viewDate,
    currentDate,
    setViewDate,
    updateTodayData
  } = useStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    const unsubHistory = fetchHistory();
    return () => unsubHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const unsubToday = fetchTodayData();
    return () => unsubToday();
  }, [fetchTodayData, viewDate]);

  const handlePrevDay = () => {
    const prevDate = format(subDays(parseISO(viewDate), 1), 'yyyy-MM-dd');
    setViewDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = format(addDays(parseISO(viewDate), 1), 'yyyy-MM-dd');
    setViewDate(nextDate);
  };

  const handleGoToToday = () => {
    setViewDate(currentDate);
  };

  const { currentStreak, maxStreak } = getStreaks();

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all tasks for today?")) {
      updateTodayData({ tasks: [] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-ink-blue rounded-full animate-spin" />
        <p className="text-2xl font-hand text-slate-500">Sharpening pencils...</p>
      </div>
    );
  }

  const completedCount = todayData.tasks.filter(t => t.completed).length;
  const totalCount = todayData.tasks.length;
  const progress = todayData.completionPercentage;

  const getProgressColor = (val) => {
    if (val < 40) return 'text-accent-rose';
    if (val < 80) return 'text-accent-amber';
    return 'text-ink-blue';
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-200 pb-8 border-dashed">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevDay}
              className="p-2 hover:bg-marker-yellow/20 rounded-sm transition-colors border border-transparent hover:border-slate-200"
              title="Previous Day"
            >
              <Plus className="w-6 h-6 rotate-45 text-ink-pencil" />
            </button>
            
            <p className="text-2xl font-hand text-slate-500">
              {format(parseISO(viewDate), 'EEEE, MMMM do')}
              {viewDate === currentDate && <span className="ml-3 text-sm bg-marker-green/20 px-2 py-0.5 rounded-sm text-ink-blue">TODAY</span>}
            </p>

            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-marker-yellow/20 rounded-sm transition-colors border border-transparent hover:border-slate-200"
              title="Next Day"
            >
              <Plus className="w-6 h-6 -rotate-45 text-ink-pencil" />
            </button>

            {viewDate !== currentDate && (
              <button 
                onClick={handleGoToToday}
                className="ml-2 font-hand text-xl text-ink-blue underline decoration-marker-yellow decoration-4 underline-offset-4"
              >
                Go to Today
              </button>
            )}
          </div>
          <h1 className="text-5xl md:text-6xl text-ink-blue">Daily Log</h1>
        </div>
        
        <div className="paper-sheet p-6 flex items-center gap-6 rotate-1">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#e2e8f0"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="226"
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * progress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={getProgressColor(progress)}
              />
            </svg>
            <span className={`absolute text-xl font-display ${getProgressColor(progress)}`}>
              {progress}%
            </span>
          </div>
          <div>
            <p className="text-sm font-display text-slate-400 uppercase tracking-widest">Score</p>
            <p className="text-2xl font-display text-ink-black">{completedCount}/{totalCount}</p>
          </div>
        </div>
      </header>

      {/* Stats Quick View - Sticky Notes Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={Flame} label="Hot Streak" value={currentStreak} color="bg-marker-yellow rotate-1" />
        <StatCard icon={Zap} label="Best" value={maxStreak} color="bg-marker-green -rotate-2" />
        <StatCard icon={CheckCircle2} label="Done" value={completedCount} color="bg-marker-pink rotate-2" />
        <StatCard icon={Circle} label="Left" value={totalCount - completedCount} color="bg-paper-200 -rotate-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Tasks Section - Takes 2 columns on large screens */}
        <section className="lg:col-span-2 paper-sheet p-8 md:p-12 min-h-[600px] relative">
          <div className="absolute top-0 left-10 bottom-0 w-[2px] bg-rose-200 opacity-50" />
          
          <div className="flex items-center justify-between mb-10 pl-8">
            <h2 className="text-4xl underline decoration-marker-yellow decoration-8 underline-offset-[-2px]">Priorities</h2>
            <button 
              onClick={handleClearAll}
              className="font-hand text-xl text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          <form onSubmit={handleAddTask} className="relative mb-12 pl-8">
            <input
              type="text"
              placeholder="Write a task..."
              className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-2xl focus:outline-none focus:border-ink-blue transition-all placeholder:text-slate-300 font-hand"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-ink-blue hover:scale-110 transition-transform"
            >
              + Add
            </button>
          </form>

          <div className="space-y-4 pl-8">
            <AnimatePresence mode='popLayout'>
              {todayData.tasks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <p className="text-3xl font-hand text-slate-300">Nothing on the list today...</p>
                </motion.div>
              ) : (
                todayData.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex items-start gap-4 py-2"
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`shrink-0 w-8 h-8 flex items-center justify-center transition-all ${
                        task.completed ? 'text-ink-blue' : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      {task.completed ? (
                        <span className="text-3xl font-display -mt-2">X</span>
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-sm" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-3">
                        <p className={`text-2xl font-hand leading-tight ${task.completed ? 'line-through text-slate-400 decoration-ink-pencil' : 'text-ink-black'}`}>
                          {task.title}
                        </p>
                        {task.completed && task.completedAt && (
                          <span className="text-sm font-hand text-slate-300 bg-slate-50 px-2 py-0.5 rounded-sm">
                            {format(
                              task.completedAt instanceof Date 
                                ? task.completedAt 
                                : task.completedAt.toDate ? task.completedAt.toDate() : new Date(task.completedAt), 
                              'p'
                            )}
                          </span>
                        )}
                      </div>
                      {task.note && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-marker-green/30 text-lg italic font-hand text-slate-600 rounded-sm">
                          {task.note}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                      <button 
                        onClick={() => setEditingNoteId(editingNoteId === task.id ? null : task.id)}
                        className="text-slate-400 hover:text-ink-blue"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {editingNoteId === task.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="absolute left-10 right-0 mt-8 z-10"
                      >
                        <div className="bg-paper-50 border-2 border-ink-blue/20 p-4 shadow-xl rounded-sm">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Add a scribbled note..."
                            className="w-full text-xl py-2 bg-transparent border-none focus:ring-0 outline-none font-hand text-ink-blue"
                            value={task.note}
                            onChange={(e) => updateTaskNote(task.id, e.target.value)}
                            onBlur={() => setEditingNoteId(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingNoteId(null)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Commentary Section - Notebook Style, takes 1 column */}
        <section className="paper-sheet p-8 md:p-10 rotate-1 flex flex-col min-h-[600px]">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-4xl text-ink-blue underline decoration-marker-pink decoration-8 underline-offset-[-2px]">Reflections</h2>
          </div>
          <textarea
            placeholder="Write your thoughts here..."
            className="flex-1 w-full p-0 bg-transparent border-none focus:ring-0 text-2xl font-hand text-ink-pencil leading-[2.5rem] resize-none overflow-auto"
            value={todayData.commentary}
            onChange={(e) => updateCommentary(e.target.value)}
            style={{ backgroundImage: 'linear-gradient(transparent, transparent 2.45rem, #e2e8f0 2.45rem)', backgroundSize: '100% 2.5rem' }}
          />
          <div className="mt-6 flex justify-between items-center text-xl font-hand text-slate-400 border-t border-slate-100 pt-4 border-dashed">
            <p className="animate-pulse italic">Ink is drying...</p>
            <p>{todayData.commentary.length} chars</p>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-6 shadow-md border border-black/5 flex flex-col items-center justify-center min-h-[140px] ${color}`}>
    <div className="mb-2 opacity-30">
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-xl font-display mb-1 text-ink-black/60">{label}</p>
    <p className="text-4xl font-display text-ink-black">{value}</p>
    {/* Tape Effect */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 border border-white/20 backdrop-blur-[2px] rotate-[-5deg]" />
  </div>
);

export default Dashboard;