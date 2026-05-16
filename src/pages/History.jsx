import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  ClipboardList,
  PieChart
} from 'lucide-react';

const History = () => {
    const { history, fetchHistory, updateDataForDate } = useStore();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
  
    useEffect(() => {
      const unsubscribe = fetchHistory();
      return () => unsubscribe && typeof unsubscribe === 'function' && unsubscribe();
    }, [fetchHistory]);
  
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  
    const getDayData = (date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return history.find(entry => entry.id === dateStr);
    };
  
    const toggleHistoricalTask = (date, taskId) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayData = getDayData(date);
      if (!dayData) return;
  
      const updatedTasks = dayData.tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null } 
          : task
      );
      updateDataForDate(dateStr, { tasks: updatedTasks });
    };
  
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  
    return (
      <div className="space-y-12 animate-fade-in pb-12">
        <header className="border-b-2 border-slate-200 pb-8 border-dashed">
          <h1 className="text-5xl md:text-6xl text-ink-blue">History Log</h1>
          <p className="text-2xl font-hand text-slate-500 mt-2">Flip through your past entries</p>
        </header>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Calendar View */}
          <section className="lg:col-span-2 paper-sheet p-8 md:p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl flex items-center gap-3">
                <CalendarIcon className="text-ink-blue w-8 h-8" />
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-4">
                <button onClick={prevMonth} className="p-2 hover:bg-marker-yellow/20 rounded-full transition-colors">
                  <ChevronLeft className="w-8 h-8 text-ink-pencil" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-marker-yellow/20 rounded-full transition-colors">
                  <ChevronRight className="w-8 h-8 text-ink-pencil" />
                </button>
              </div>
            </div>
  
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xl font-display text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>
  
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                const data = getDayData(day);
                const isSelected = selectedDay && format(day, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd');
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(day)}
                    disabled={!isSameMonth(day, currentMonth)}
                    className={`
                      relative h-24 p-2 border-2 transition-all group
                      ${!isSameMonth(day, currentMonth) ? 'opacity-0 pointer-events-none' : 'hover:border-ink-blue'}
                      ${isSelected ? 'border-ink-blue bg-marker-yellow/20' : 'border-slate-100'}
                      ${isToday(day) ? 'bg-marker-green/10' : ''}
                    `}
                  >
                    <span className={`text-2xl font-hand ${isToday(day) ? 'text-ink-blue font-bold underline' : 'text-ink-pencil'}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {data && (
                      <div className="mt-2 flex flex-col items-center">
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-ink-blue" 
                            style={{ width: `${data.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-hand mt-1">{data.completionPercentage}%</span>
                      </div>
                    )}
  
                    {/* Scribble effect on select */}
                    {isSelected && (
                      <motion.div 
                        layoutId="scribble"
                        className="absolute inset-0 border-4 border-ink-blue/10 pointer-events-none -rotate-1"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
  
          {/* Selected Day Summary */}
          <section className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedDay ? (
                <motion.div
                  key={format(selectedDay, 'yyyy-MM-dd')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="paper-sheet p-8 rotate-1"
                >
                  <h3 className="text-3xl mb-6 border-b-2 border-slate-200 border-dashed pb-4">
                    {format(selectedDay, 'MMM do')}
                  </h3>
  
                  {getDayData(selectedDay) ? (
                    <div className="space-y-8">
                      <div className="flex items-center gap-4 bg-paper-200 p-4 rounded-sm">
                        <div className="p-3 bg-white border border-slate-200 rotate-3">
                          <PieChart className="w-8 h-8 text-ink-blue" />
                        </div>
                        <div>
                          <p className="text-3xl font-display">{getDayData(selectedDay).completionPercentage}%</p>
                          <p className="text-lg font-hand text-slate-500">Day Score</p>
                        </div>
                      </div>
  
                      <div className="space-y-4">
                        <p className="text-2xl font-display text-ink-blue underline">Reflections:</p>
                        <p className="text-2xl font-hand text-ink-pencil leading-relaxed italic">
                          "{getDayData(selectedDay).commentary || 'No scribbles for this day...'}"
                        </p>
                      </div>
  
                      <div className="space-y-3">
                        <p className="text-2xl font-display text-ink-blue underline">Checklist:</p>
                        {getDayData(selectedDay).tasks.map(task => (
                          <div 
                            key={task.id} 
                            className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-1 rounded-sm transition-colors"
                            onClick={() => toggleHistoricalTask(selectedDay, task.id)}
                          >
                            <span className="text-2xl font-display shrink-0 w-8">{task.completed ? 'X' : 'O'}</span>
                            <span className={`text-xl font-hand ${task.completed ? 'line-through text-slate-400' : ''}`}>
                              {task.title}
                            </span>
                            {task.completed && task.completedAt && (
                              <span className="text-sm font-hand text-slate-300">
                                {format(
                                  task.completedAt instanceof Date 
                                    ? task.completedAt 
                                    : (task.completedAt.toDate ? task.completedAt.toDate() : new Date(task.completedAt)), 
                                  'p'
                                )}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <p className="text-3xl font-hand text-slate-300">Blank page...</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="paper-sheet p-8 flex flex-col items-center justify-center text-center space-y-4 text-slate-400 h-64 opacity-60">
                <CalendarIcon className="w-16 h-16 mb-2" />
                <p className="text-2xl font-hand">Pick a day to read its log</p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default History;
