import { create } from 'zustand';
import { db, auth, googleProvider } from '../firebase/config';
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
import { onAuthStateChanged, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';

let todayUnsub = null;
let historyUnsub = null;
let defaultsUnsub = null;

const useStore = create((set, get) => ({
  todayData: {
    tasks: [],
    commentary: '',
    completionPercentage: 0,
    updatedAt: new Date(),
    date: format(new Date(), 'yyyy-MM-dd')
  },
  history: [],
  isLoading: true,
  authError: null,
  viewDate: format(new Date(), 'yyyy-MM-dd'),
  currentDate: format(new Date(), 'yyyy-MM-dd'),
  user: null,

  // Auth Actions
  loginWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      set({ authError: error.message });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // Helper to get consistent user paths
  getUserPaths: () => {
    const user = auth?.currentUser;
    if (!user) return null;
    return {
      entries: `users/${user.uid}/dailyEntries`,
      settings: `users/${user.uid}/settings`
    };
  },

  // Initialize auth listener
  initAuth: () => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ user, isLoading: false, authError: null });
        get().fetchTodayData();
        get().fetchUserDefaults();
        get().fetchHistory();
      } else {
        set({ user: null });
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous auth failed:", error);
          set({ authError: error.message, isLoading: false });
        }
      }
    }, (error) => {
      console.error("Auth state listener error:", error);
      set({ authError: error.message, isLoading: false });
    });

    setTimeout(() => {
      const { user, authError } = get();
      if (!user && !authError) {
        set({ 
          isLoading: false, 
          authError: "Please enable 'Anonymous Authentication' in your Firebase Console (Authentication > Sign-in method)." 
        });
      }
    }, 10000);

    return unsub;
  },

  setViewDate: (dateStr) => {
    set({ viewDate: dateStr });
  },

  userDefaults: [],

  fetchUserDefaults: () => {
    const paths = get().getUserPaths();
    if (!paths) return;

    if (defaultsUnsub) {
      defaultsUnsub();
      defaultsUnsub = null;
    }

    const docRef = doc(db, paths.settings, 'defaults');
    defaultsUnsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ userDefaults: docSnap.data().tasks || [] });
      } else {
        const initialDefaults = [
          { title: "Wake up at 7:00 AM", category: "Routine" },
          { title: "Get Ready", category: "Routine" },
          { title: "Breakfast Done", category: "Routine" },
          { title: "Morning Study Session (1-2 hrs)", category: "Work" },
          { title: "Back Workout 5 min", category: "Work" },
          { title: "Lunch Done", category: "Routine" },
          { title: "Afternoon Study Session (1-2hrs)", category: "Work" },
          { title: "Snacks Done", category: "Routine" },
          { title: "Dinner Done", category: "Routine" },
          { title: "Night Study Session (1-2hrs)", category: "Work" },
          { title: "Plan next day", category: "Work" },
          { title: "6 hrs of Study", category: "Work" },
          { title: "3 Bottle of water", category: "Routine" },
          { title: "Sleep btw 12:00-1:00 AM", category: "Routine" }
        ];
        setDoc(docRef, { tasks: initialDefaults }).catch(err => console.error("Setting defaults failed:", err));
      }
    });
  },

  updateUserDefaults: async (tasks) => {
    const paths = get().getUserPaths();
    if (!paths) return;
    const docRef = doc(db, paths.settings, 'defaults');
    await setDoc(docRef, { tasks });
  },

  seedTodayWithDefaults: async () => {
    const { userDefaults, updateTodayData } = get();
    
    let defaultsToUse = userDefaults;
    if (!defaultsToUse || defaultsToUse.length === 0) {
      defaultsToUse = [
        { title: "Wake up at 7:00 AM", category: "Routine" },
        { title: "Get Ready", category: "Routine" },
        { title: "Breakfast Done", category: "Routine" },
        { title: "Morning Study Session (1-2 hrs)", category: "Work" },
        { title: "Back Workout 5 min", category: "Work" },
        { title: "Lunch Done", category: "Routine" },
        { title: "Afternoon Study Session (1-2hrs)", category: "Work" },
        { title: "Snacks Done", category: "Routine" },
        { title: "Dinner Done", category: "Routine" },
        { title: "Night Study Session (1-2hrs)", category: "Work" },
        { title: "Plan next day", category: "Work" },
        { title: "6 hrs of Study", category: "Work" },
        { title: "3 Bottle of water", category: "Routine" },
        { title: "Sleep btw 12:00-1:00 AM", category: "Routine" }
      ];
    }

    const seededTasks = defaultsToUse.map(task => ({
      id: Math.random().toString(36).substr(2, 9),
      title: task.title,
      category: task.category,
      completed: false,
      note: '',
      createdAt: new Date()
    }));

    await updateTodayData({ tasks: seededTasks });
  },

  resetUserDefaults: async () => {
    const recommended = [
      { title: "Wake up at 7:00 AM", category: "Routine" },
      { title: "Get Ready", category: "Routine" },
      { title: "Breakfast Done", category: "Routine" },
      { title: "Morning Study Session (1-2 hrs)", category: "Work" },
      { title: "Back Workout 5 min", category: "Work" },
      { title: "Lunch Done", category: "Routine" },
      { title: "Afternoon Study Session (1-2hrs)", category: "Work" },
      { title: "Snacks Done", category: "Routine" },
      { title: "Dinner Done", category: "Routine" },
      { title: "Night Study Session (1-2hrs)", category: "Work" },
      { title: "Plan next day", category: "Work" },
      { title: "6 hrs of Study", category: "Work" },
      { title: "3 Bottle of water", category: "Routine" },
      { title: "Sleep btw 12:00-1:00 AM", category: "Routine" }
    ];
    const { updateUserDefaults } = get();
    await updateUserDefaults(recommended);
  },

  fetchTodayData: () => {
    const { viewDate } = get();
    const paths = get().getUserPaths();
    if (!paths) {
      set({ isLoading: false });
      return;
    }
    
    if (todayUnsub) {
      todayUnsub();
      todayUnsub = null;
    }
    
    const docRef = doc(db, paths.entries, viewDate);
    
    todayUnsub = onSnapshot(docRef, (docSnap) => {
      // Ensure we haven't navigated away from this date since the listener was created
      if (get().viewDate !== viewDate) return;
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ todayData: { ...data, date: viewDate }, isLoading: false });
      } else {
        const emptyData = {
          date: viewDate,
          tasks: [],
          commentary: '',
          completionPercentage: 0,
          updatedAt: new Date(),
        };
        set({ todayData: emptyData, isLoading: false });
      }
    }, (error) => {
      console.error("Snapshot error:", error);
      set({ isLoading: false });
    });
  },

  updateDataForDate: async (dateStr, newData) => {
    const { history, todayData, currentDate } = get();
    const paths = get().getUserPaths();
    if (!paths) return;
    
    let targetData;
    if (dateStr === todayData.date) {
      targetData = { ...todayData, ...newData };
    } else {
      const existing = history.find(e => e.id === dateStr);
      targetData = { ...existing, ...newData };
    }

    targetData.updatedAt = new Date();
    targetData.date = dateStr;
    
    if (newData.tasks) {
      const total = targetData.tasks.length;
      const completed = targetData.tasks.filter(t => t.completed).length;
      targetData.completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    if (dateStr === todayData.date) {
      set({ todayData: targetData });
    } else {
      const newHistory = history.map(h => h.id === dateStr ? targetData : h);
      set({ history: newHistory });
    }
    
    try {
      await setDoc(doc(db, paths.entries, dateStr), targetData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  },

  updateTodayData: (newData) => {
    const { viewDate, updateDataForDate } = get();
    updateDataForDate(viewDate, newData);
  },

  addTask: (title, category = 'Work') => {
    const { todayData, updateTodayData } = get();
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      category,
      completed: false,
      note: '',
      createdAt: new Date(),
    };
    updateTodayData({ tasks: [...(todayData?.tasks || []), newTask] });
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

  updateCommentary: (commentary) => {
    const { updateTodayData } = get();
    updateTodayData({ commentary });
  },

  fetchHistory: () => {
    const paths = get().getUserPaths();
    if (!paths) return;
    
    if (historyUnsub) {
      historyUnsub();
      historyUnsub = null;
    }
    
    const q = query(collection(db, paths.entries), orderBy('updatedAt', 'desc'), limit(30));
    historyUnsub = onSnapshot(q, (querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      set({ history });
    }, (err) => console.error("History fetch failed:", err));
  },

  getStreaks: () => {
    const { history } = get();
    const sortedHistory = [...history].sort((a, b) => b.id.localeCompare(a.id));
    
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (const entry of sortedHistory) {
      if (entry.completionPercentage > 0) {
        tempStreak++;
      } else {
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        tempStreak = 0;
      }
    }
    if (tempStreak > maxStreak) maxStreak = tempStreak;

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
