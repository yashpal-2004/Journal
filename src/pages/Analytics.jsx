import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import useStore from '../store/useStore';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { TrendingUp, BarChart3, Zap } from 'lucide-react';

const Analytics = () => {
  const { history } = useStore();

  const last7Days = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = history.find(e => e.id === dateStr);
      return {
        name: format(date, 'EEE'),
        percentage: entry ? entry.completionPercentage : 0,
        tasks: entry ? entry.tasks.length : 0,
        completed: entry ? entry.tasks.filter(t => t.completed).length : 0,
      };
    });
  }, [history]);

  const averageCompletion = useMemo(() => {
    if (history.length === 0) return 0;
    const total = history.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0);
    return Math.round(total / history.length);
  }, [history]);

  const totalTasks = useMemo(() => {
    return history.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
  }, [history]);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="border-b-2 border-slate-200 pb-8 border-dashed">
        <h1 className="text-5xl md:text-6xl text-ink-blue">Analytics Log</h1>
        <p className="text-2xl font-hand text-slate-500 mt-2">Statistical scribble of your progress</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="paper-sheet p-8 bg-marker-yellow/20 -rotate-1 border-ink-blue/20">
          <TrendingUp className="w-8 h-8 mb-4 text-ink-blue opacity-50" />
          <p className="text-xl font-display text-ink-pencil mb-1">Avg. Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-display text-ink-blue">{averageCompletion}%</span>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 border border-white/20 backdrop-blur-[2px]" />
        </div>
        
        <div className="paper-sheet p-8 bg-marker-green/20 rotate-1 border-ink-blue/20">
          <BarChart3 className="w-8 h-8 mb-4 text-ink-blue opacity-50" />
          <p className="text-xl font-display text-ink-pencil mb-1">Tasks Logged</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-display text-ink-black">{totalTasks}</span>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 border border-white/20 backdrop-blur-[2px]" />
        </div>

        <div className="paper-sheet p-8 bg-marker-pink/20 -rotate-2 border-ink-blue/20">
          <Zap className="w-8 h-8 mb-4 text-ink-blue opacity-50" />
          <p className="text-xl font-display text-ink-pencil mb-1">Consistency</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-display text-ink-blue">Solid</span>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 border border-white/20 backdrop-blur-[2px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Weekly Trend Chart */}
        <section className="paper-sheet p-8 md:p-10">
          <h3 className="text-3xl mb-10 underline decoration-marker-yellow decoration-8 underline-offset-[-2px]">Weekly Trend</h3>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2b3481" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2b3481" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4a4a4a', fontSize: 16, fontFamily: 'Patrick Hand' }}
                  dy={10}
                />
                <YAxis 
                  hide={true} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fdfcf0', 
                    borderRadius: '0px', 
                    border: '1px solid #e2e8f0',
                    fontFamily: 'Patrick Hand'
                  }}
                  itemStyle={{ color: '#2b3481', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#2b3481" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPercentage)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Tasks vs Completion Chart */}
        <section className="paper-sheet p-8 md:p-10 rotate-1">
          <h3 className="text-3xl mb-10 underline decoration-marker-green decoration-8 underline-offset-[-2px]">Task Depth</h3>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4a4a4a', fontSize: 16, fontFamily: 'Patrick Hand' }}
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#fdfcf0', 
                    borderRadius: '0px', 
                    border: '1px solid #e2e8f0',
                    fontFamily: 'Patrick Hand'
                  }}
                />
                <Bar dataKey="tasks" fill="#cbd5e1" radius={[2, 2, 0, 0]} name="Total Tasks" />
                <Bar dataKey="completed" fill="#2b3481" radius={[2, 2, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
