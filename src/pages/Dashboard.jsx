import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  Zap, 
  Flame,
  RefreshCcw 
} from 'lucide-react';
import { format, subDays, addDays, parseISO } from 'date-fns';

const safeDateFormat = (dateValue) => {
  if (!dateValue) return '';
  try {
    let dateObj;
    if (dateValue instanceof Date) {
      dateObj = dateValue;
    } else if (dateValue && typeof dateValue.toDate === 'function') {
      dateObj = dateValue.toDate();
    } else {
      dateObj = new Date(dateValue);
    }
    
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, 'p');
  } catch (e) {
    return '';
  }
};

const JournalColumn = ({ title, children, color, icon: Icon, isDone = false, count = 0 }) => {
  return (
    <div className={`paper-sheet p-6 min-h-[500px] flex flex-col ${color}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-ink-pencil/40" />}
          <h2 className={`text-3xl font-hand ${isDone ? 'text-slate-400' : 'text-ink-black underline decoration-marker-yellow decoration-4 underline-offset-[-2px]'}`}>
            {title}
          </h2>
        </div>
        <span className="bg-paper-100 px-3 py-1 rounded-sm text-sm font-display text-slate-400 border border-slate-200">
          {count}
        </span>
      </div>
      
      <div className="flex-1 space-y-4 relative">
        {!isDone && <div className="absolute top-0 left-1 bottom-0 w-[1px] bg-rose-100" />}
        {children}
        {count === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-20 text-center">
            <Icon className="w-12 h-12 mb-2" />
            <p className="font-hand text-xl italic">Empty section...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, deleteTask, updateTaskNote, editingNoteId, setEditingNoteId, toggleTask }) => {
  return (
    <div
      className={`group relative p-4 rounded-sm border-2 transition-all ${
        task.completed 
          ? 'bg-paper-50 border-slate-100 grayscale-[0.5] opacity-60 hover:opacity-100' 
          : 'bg-paper-50 border-ink-pencil/5 shadow-sm hover:shadow-md hover:border-ink-blue/10'
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-1 flex-shrink-0 transition-transform active:scale-90 ${
            task.completed ? 'text-marker-green' : 'text-slate-300 hover:text-ink-blue'
          }`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <Circle className="w-7 h-7" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className={`text-2xl font-hand leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-ink-black'}`}>
                {task.title}
              </p>
              {task.completed && task.completedAt && (
                <span className="text-sm font-hand text-slate-300 mt-1 block">
                  Done at {safeDateFormat(task.completedAt)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingNoteId(editingNoteId === task.id ? null : task.id)}
                className="p-1.5 text-slate-400 hover:text-ink-blue rounded-sm hover:bg-slate-50"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-sm hover:bg-slate-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {task.note && (
            <div className="mt-2 px-2 py-1 bg-marker-green/10 border-l-2 border-marker-green text-lg italic font-hand text-slate-600 rounded-sm">
              {task.note}
            </div>
          )}

          <AnimatePresence>
            {editingNoteId === task.id && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ReflectionModal = ({ isOpen, onClose, commentary, onUpdate }) => {
  const [localText, setLocalText] = useState(commentary || '');

  useEffect(() => {
    setLocalText(commentary || '');
  }, [commentary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localText !== commentary) {
        onUpdate(localText);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localText, commentary, onUpdate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl paper-sheet p-8 md:p-12 shadow-2xl rotate-1 h-[80vh] flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Plus className="w-8 h-8 rotate-45 text-slate-400" />
            </button>

            <div className="flex items-center gap-3 mb-10">
              <h2 className="text-5xl text-ink-blue underline decoration-marker-pink decoration-8 underline-offset-[-4px]">
                Daily Reflections
              </h2>
            </div>

            <textarea
              autoFocus
              placeholder="Scribble your thoughts about today..."
              className="flex-1 w-full p-0 bg-transparent border-none focus:ring-0 text-3xl font-hand text-ink-pencil leading-[3rem] resize-none overflow-auto"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              style={{ backgroundImage: 'linear-gradient(transparent, transparent 2.95rem, #e2e8f0 2.95rem)', backgroundSize: '100% 3rem' }}
            />

            <div className="mt-8 flex justify-between items-center text-sm font-display text-slate-300 border-t border-slate-100 pt-6 border-dashed uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-marker-green rounded-full animate-pulse" />
                <p>Auto-saving...</p>
              </div>
              <p>{localText.length} characters</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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
    updateTodayData,
    fetchUserDefaults,
    seedTodayWithDefaults
  } = useStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  useEffect(() => {
    const unsubHistory = fetchHistory();
    const unsubDefaults = fetchUserDefaults();
    return () => {
      unsubHistory();
      if (typeof unsubDefaults === 'function') unsubDefaults();
    };
  }, [fetchHistory, fetchUserDefaults]);

  useEffect(() => {
    const unsubToday = fetchTodayData();
    return () => unsubToday();
  }, [fetchTodayData, viewDate]);

  const handlePrevDay = () => {
    try {
      const prevDate = format(subDays(parseISO(viewDate), 1), 'yyyy-MM-dd');
      setViewDate(prevDate);
    } catch (err) {
      console.error("Navigation error:", err);
      setViewDate(currentDate);
    }
  };

  const handleNextDay = () => {
    try {
      const nextDate = format(addDays(parseISO(viewDate), 1), 'yyyy-MM-dd');
      setViewDate(nextDate);
    } catch (err) {
      console.error("Navigation error:", err);
      setViewDate(currentDate);
    }
  };

  const handleGoToToday = () => {
    setViewDate(currentDate);
  };

  const { currentStreak, maxStreak } = getStreaks();

  const handleAddTask = (e, category = 'Work') => {
    e.preventDefault();
    const form = e.target;
    const input = category === 'Work' ? form.priorityTitle : form.routineTitle;
    const value = input ? input.value : newTaskTitle;
    
    if (value.trim()) {
      addTask(value.trim(), category);
      if (input) {
        input.value = '';
      } else {
        setNewTaskTitle('');
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all tasks for today?")) {
      updateTodayData({ tasks: [] });
    }
  };

  const isDataMismatched = todayData?.date !== viewDate;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-ink-blue rounded-full animate-spin" />
        <p className="text-2xl font-hand text-slate-500">Sharpening pencils...</p>
      </div>
    );
  }

  const tasks = isDataMismatched ? [] : (todayData?.tasks || []);
  const routineTasks = tasks.filter(t => !t.completed && t.category === 'Routine');
  const workTasks = tasks.filter(t => !t.completed && (t.category === 'Work' || !t.category));
  const doneTasks = tasks.filter(t => t.completed);

  const completedCount = doneTasks.length;
  const totalCount = tasks.length;
  const progress = todayData?.completionPercentage || 0;

  const getProgressColor = (val) => {
    if (val < 40) return 'text-accent-rose';
    if (val < 80) return 'text-accent-amber';
    return 'text-ink-blue';
  };

  return (
    <div className={`animate-fade-in pb-12 space-y-8 transition-opacity duration-300 ${isDataMismatched ? 'opacity-40' : 'opacity-100'}`}>
      {isDataMismatched && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <RefreshCcw className="w-4 h-4 animate-spin text-ink-blue" />
          <span className="text-sm font-hand text-ink-black uppercase tracking-widest">Snapshotting...</span>
        </div>
      )}
      
      {/* Top Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6 border-dashed">
        <div className="flex items-center gap-4">
          <button onClick={handlePrevDay} className="p-1.5 hover:bg-marker-yellow/20 rounded-sm transition-colors border border-transparent hover:border-slate-200">
            <Plus className="w-5 h-5 rotate-45 text-ink-pencil" />
          </button>
          
          <div className="flex flex-col">
            <p className="text-2xl font-hand text-ink-black leading-none">
              {format(parseISO(viewDate), 'EEEE, MMMM do')}
              {viewDate === currentDate && <span className="ml-2 text-xs bg-marker-green/20 px-1.5 py-0.5 rounded-sm text-ink-blue">TODAY</span>}
            </p>
            {viewDate !== currentDate && (
              <button onClick={handleGoToToday} className="text-left font-hand text-sm text-ink-blue underline decoration-marker-yellow decoration-2 underline-offset-2">
                Back to Today
              </button>
            )}
          </div>

          <button onClick={handleNextDay} className="p-1.5 hover:bg-marker-yellow/20 rounded-sm transition-colors border border-transparent hover:border-slate-200">
            <Plus className="w-5 h-5 -rotate-45 text-ink-pencil" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:gap-8">
          <button onClick={() => setIsReflectionOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-paper-50 border border-slate-200 rounded-sm font-hand text-xl text-ink-blue hover:bg-marker-yellow/10 transition-colors shadow-sm">
            <MessageSquare className="w-5 h-5 opacity-50" />
            Daily Reflections
          </button>

          <div className="flex items-center gap-6 bg-paper-50 p-3 rounded-sm border border-slate-100 shadow-sm rotate-1">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-200 border-dashed">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="3" fill="transparent" />
                  <motion.circle
                    cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6"
                    initial={{ strokeDashoffset: 125.6 }}
                    animate={{ strokeDashoffset: 125.6 - (125.6 * progress) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={getProgressColor(progress)}
                  />
                </svg>
                <span className={`absolute text-xs font-display ${getProgressColor(progress)}`}>{progress}%</span>
              </div>
              <div>
                <p className="text-[10px] font-display text-slate-400 uppercase">Score</p>
                <p className="text-lg font-display text-ink-black leading-tight">{completedCount}/{totalCount}</p>
              </div>
            </div>

            <div className="flex gap-4 lg:gap-6">
              <MicroStat icon={Flame} label="Streak" value={currentStreak} />
              <MicroStat icon={Zap} label="Best" value={maxStreak} />
              <MicroStat icon={CheckCircle2} label="Done" value={completedCount} />
              <MicroStat icon={Circle} label="Left" value={totalCount - completedCount} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 items-start">
        {tasks.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="paper-sheet p-12 text-center border-dashed border-slate-200 rotate-1 mb-8">
            <RefreshCcw className="w-16 h-16 text-ink-pencil/20 mx-auto mb-6 animate-spin-slow" />
            <h2 className="text-4xl font-hand text-ink-black mb-4">A blank page awaits...</h2>
            <p className="text-xl font-hand text-slate-400 mb-8 max-w-lg mx-auto">Would you like to load your daily blueprint from settings, or start fresh with new goals?</p>
            <button onClick={seedTodayWithDefaults} className="bg-ink-blue text-paper-50 px-10 py-4 rounded-sm font-display text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-3 mx-auto">
              <Plus className="w-6 h-6" /> LOAD TODAY'S PLAN
            </button>
          </motion.div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${tasks.length === 0 ? 'opacity-20 pointer-events-none' : ''}`}>
          <div className="space-y-6">
            <form onSubmit={(e) => handleAddTask(e, 'Work')} className="paper-sheet p-4 flex gap-2 border-marker-yellow/40">
              <input type="text" name="priorityTitle" placeholder="New priority..." className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-hand" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              <button type="submit" className="text-ink-blue font-display hover:scale-110 transition-transform">+</button>
            </form>
            <JournalColumn title="Priorities" icon={Zap} color="border-marker-yellow/20" count={workTasks.length}>
              {workTasks.map((task) => (
                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTaskNote={updateTaskNote} toggleTask={toggleTask} editingNoteId={editingNoteId} setEditingNoteId={setEditingNoteId} />
              ))}
            </JournalColumn>
          </div>

          <div className="space-y-6">
            <form onSubmit={(e) => handleAddTask(e, 'Routine')} className="paper-sheet p-4 flex gap-2 border-marker-green/40">
              <input type="text" name="routineTitle" placeholder="New routine..." className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-hand" />
              <button type="submit" className="text-ink-blue font-display hover:scale-110 transition-transform">+</button>
            </form>
            <JournalColumn title="Routine" icon={Circle} color="border-marker-green/20" count={routineTasks.length}>
              {routineTasks.map((task) => (
                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTaskNote={updateTaskNote} toggleTask={toggleTask} editingNoteId={editingNoteId} setEditingNoteId={setEditingNoteId} />
              ))}
            </JournalColumn>
          </div>

          <div className="space-y-6">
            <div className="paper-sheet p-4 flex justify-between items-center bg-marker-pink/5 border-marker-pink/20">
              <span className="font-hand text-xl">Completed Today</span>
              <button onClick={handleClearAll} className="text-xs font-display text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-wider">Clear</button>
            </div>
            <JournalColumn title="Done" icon={CheckCircle2} isDone={true} color="border-slate-100 bg-paper-50/30" count={doneTasks.length}>
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTaskNote={updateTaskNote} toggleTask={toggleTask} editingNoteId={editingNoteId} setEditingNoteId={setEditingNoteId} />
              ))}
            </JournalColumn>
          </div>
        </div>
      </div>

      <ReflectionModal isOpen={isReflectionOpen} onClose={() => setIsReflectionOpen(false)} commentary={todayData.commentary} onUpdate={updateCommentary} />
    </div>
  );
};

const MicroStat = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center">
    <p className="text-[10px] font-display text-slate-400 uppercase mb-0.5">{label}</p>
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-slate-300" />
      <p className="text-lg font-display text-ink-black leading-none">{value}</p>
    </div>
  </div>
);

export default Dashboard;