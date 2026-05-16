import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings as SettingsIcon,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/history', icon: Calendar, label: 'History' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-paper-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-paper-50 border-r-2 border-slate-200 p-8 fixed h-full z-10 shadow-lg">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-12 h-12 rounded-lg bg-ink-blue flex items-center justify-center text-white shadow-[4px_4px_0px_#abced4]">
            <Zap className="w-8 h-8" />
          </div>
          <span className="text-3xl font-display text-ink-blue">Journal</span>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-ink-black' : 'text-slate-400'}`} />
                  <span className="text-xl">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-paper-200 border-2 border-ink-pencil/20 rounded-sm rotate-1 shadow-sm">
          <p className="text-lg font-display text-ink-pencil mb-2">Note to self:</p>
          <p className="text-md text-ink-blue italic">"The secret of getting ahead is getting started."</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pb-24 md:pb-0">
        <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-14">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-paper-50 border-2 border-ink-black px-2 py-3 flex justify-around items-center z-20 rounded-2xl shadow-xl">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive ? 'text-ink-blue scale-110' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'bg-marker-yellow -rotate-3 px-2 rounded-sm' : ''}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-display">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;
