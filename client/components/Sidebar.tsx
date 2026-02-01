import React from 'react';
import { AppView } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  ListTodo,
  Trophy,
  LineChart,
  PlayCircle,
  Flame,
  Coins,
  LogOut,
  Sun,
  Moon,
  User
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  streak: number;
  points: number;
  isDark: boolean;
  toggleTheme: () => void;
  studentType?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, streak, points, isDark, toggleTheme, studentType }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    ...(studentType === 'undergraduate' ? [{ id: 'academic', label: 'GPA & Marks', icon: <GraduationCap size={20} /> }] : []),
    { id: 'tasks', label: 'Task List', icon: <ListTodo size={20} /> },
    { id: 'analysis', label: 'Performance', icon: <LineChart size={20} /> },
    { id: 'collection', label: 'Rewards', icon: <Trophy size={20} /> },
  ];

  return (
    <aside className={`w-64 border-r flex flex-col hidden md:flex transition-colors ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
      <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <h1 className="text-xl font-bold text-indigo-500 flex items-center gap-2">
          StudyBuddy
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as AppView)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id
                ? 'bg-indigo-500/10 text-indigo-500 font-semibold'
                : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button
            onClick={() => onViewChange('work')}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            <PlayCircle size={22} />
            <span>START WORKING</span>
          </button>
        </div>

        <div className="pt-2 space-y-2">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-yellow-400' : 'text-slate-500 hover:bg-slate-50 hover:text-amber-500'
              }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => onViewChange('login')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400' : 'text-slate-500 hover:bg-slate-50 hover:text-red-500'
              }`}
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      <div className={`p-4 border-t ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-orange-500 font-bold">
            <Flame size={18} fill="currentColor" />
            <span>{streak} Days</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-500 font-bold">
            <Coins size={18} fill="currentColor" />
            <span>{points} pts</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
