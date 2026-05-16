import { create } from 'zustand';
import { db } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  collection,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { format } from 'date-fns';

const useStore = create((set, get) => ({
  todayData: {
    tasks: [],
    commentary: '',
    completionPercentage: 0,
    updatedAt: new Date(),
  },
  history: [],
  isLoading: true,
  viewDate: format(new Date(), 'yyyy-MM-dd'),
  currentDate: format(new Date(), 'yyyy-MM-dd'),

  setViewDate: (dateStr) => {
    set({ 
      viewDate: dateStr,
      todayData: { tasks: [], commentary: '', completionPercentage: 0, updatedAt: new Date() }
    });
  },

  // Fetch data for the current viewDate and subscribe to changes
  fetchTodayData: () => {
    const { viewDate } = get();
    if (!db) {
      set({ isLoading: false });
      return () => {};
    }
    const docRef = doc(db, 'dailyEntries', viewDate);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      const data = docSnap.exists() ? docSnap.data() : null;
      
      // If data exists and has tasks, just use it
      if (data && (data.tasks.length > 0 || data.commentary)) {
        set({ todayData: data, isLoading: false });
      } else {
        // Initialize new day with default tasks
        const defaultTasks = [
          "Wake up at 7:00 AM",
          "Get Ready",
          "Breakfast Done",
          "Morning Study Session (1-2 hrs)",
          "Back Workout 5 min",
          "Lunch Done",
          "Afternoon Study Session (1-2hrs)",
          "Snacks Done",
          "Dinner Done",
          "Night Study Session (1-2hrs)",
          "Plan next day",
          "6 hrs of Study",
          "3 Bottle of water",
          "Sleep btw 12:00-1:00 AM"
        ].map(title => ({
          id: Math.random().toString(36).substr(2, 9),
          title,
          completed: false,
          note: '',
          createdAt: new Date()
        }));

        const newData = {
          tasks: defaultTasks,
          commentary: '',
          completionPercentage: 0,
          updatedAt: new Date(),
        };
        
        set({ todayData: newData, isLoading: false });
        
        // Save to Firestore so it persists
        setDoc(docRef, newData).catch(err => console.error("Initial save failed:", err));
      }
    });

    return unsubscribe;
  },

  // Save/Update data for a specific date
  updateDataForDate: async (dateStr, newData) => {
    const { history, todayData, currentDate } = get();
    
    // Get existing data for that date
    let targetData;
    if (dateStr === currentDate) {
      targetData = { ...todayData, ...newData };
    } else {
      const existing = history.find(e => e.id === dateStr);
      targetData = { ...existing, ...newData };
    }

    targetData.updatedAt = new Date();
    
    // Recalculate percentage if tasks changed
    if (newData.tasks) {
      const total = targetData.tasks.length;
      const completed = targetData.tasks.filter(t => t.completed).length;
      targetData.completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    // Update local state
    if (dateStr === currentDate) {
      set({ todayData: targetData });
    } else {
      const newHistory = history.map(h => h.id === dateStr ? targetData : h);
      set({ history: newHistory });
    }
    
    if (!db) return;
    try {
      await setDoc(doc(db, 'dailyEntries', dateStr), targetData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  },

  updateTodayData: (newData) => {
    const { viewDate, updateDataForDate } = get();
    updateDataForDate(viewDate, newData);
  },

  addTask: (title) => {
    const { todayData, updateTodayData } = get();
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      note: '',
      createdAt: new Date(),
    };
    updateTodayData({ tasks: [...todayData.tasks, newTask] });
  },

  toggleTask: (id) => {
    const { todayData, updateTodayData } = get();
    const updatedTasks = todayData.tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null } 
        : task
    );
    updateTodayData({ tasks: updatedTasks });
  },

  updateTaskNote: (id, note) => {
    const { todayData, updateTodayData } = get();
    const updatedTasks = todayData.tasks.map(task => 
      task.id === id ? { ...task, note } : task
    );
    updateTodayData({ tasks: updatedTasks });
  },

  deleteTask: (id) => {
    const { todayData, updateTodayData } = get();
    const updatedTasks = todayData.tasks.filter(task => task.id !== id);
    updateTodayData({ tasks: updatedTasks });
  },

  reorderTasks: (newTasks) => {
    const { updateTodayData } = get();
    updateTodayData({ tasks: newTasks });
  },

  updateCommentary: (commentary) => {
    const { updateTodayData } = get();
    updateTodayData({ commentary });
  },

  fetchHistory: () => {
    if (!db) return () => {};
    // This could be optimized to fetch only a range
    const q = query(collection(db, 'dailyEntries'), orderBy('updatedAt', 'desc'), limit(30));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      set({ history });
    });
    return unsubscribe;
  },

  getStreaks: () => {
    const { history, todayData } = get();
    // Combine history and today's status
    const allEntries = [...history];
    // Check if today is completed enough to count (e.g. > 80%) or just any completion?
    // Usually a streak is days where completionPercentage > 80 or 90
    
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Sort history by date descending for current streak
    const sortedHistory = [...history].sort((a, b) => b.id.localeCompare(a.id));
    
    // Check current streak (starting from today if today > 0% or just history?)
    // For now, let's just count days with > 0% completion as active days
    for (const entry of sortedHistory) {
      if (entry.completionPercentage > 0) {
        tempStreak++;
      } else {
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        tempStreak = 0;
      }
    }
    if (tempStreak > maxStreak) maxStreak = tempStreak;

    // Current streak is special: it must include yesterday or today
    currentStreak = 0;
    for (const entry of sortedHistory) {
      if (entry.completionPercentage > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { currentStreak, maxStreak };
  }
}));

export default useStore;
