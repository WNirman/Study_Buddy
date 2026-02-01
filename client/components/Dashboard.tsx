import React, { useMemo } from 'react';
import { Subject, Task, Exam, UserStats, AppView, User } from '../types';
import { GPA_SCALE } from '../constants';
import {
  Bell,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  user: User;
  tasks: Task[];
  subjects: Subject[];
  exams: Exam[];
  stats: UserStats;
  studentType: string; // Add studentType prop
  onViewChange: (view: AppView) => void;
  onRequestNotifications: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  tasks,
  subjects,
  exams,
  stats,
  studentType, // Destructure studentType
  onViewChange,
  onRequestNotifications
}) => {
  // Manual YYYY-MM-DD formatting for consistency
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayTasks = tasks.filter(t => t.dueDate.startsWith(today));
  const completedToday = todayTasks.filter(t => t.completed).length;

  const currentGpa = useMemo(() => {
    if (subjects.length === 0) return 0;
    const gpas = subjects.map(s => {
      // Calculate ICA Average
      const icas = s.marks?.filter(m => m.type === 'ICA') || [];
      const icaTotal = icas.reduce((acc, curr) => acc + curr.score, 0);
      // Assuming simple average of ICAs for now, or use weighted if provided
      const icaAvg = icas.length > 0 ? icaTotal / icas.length : 0;

      const finalExam = s.marks?.find(m => m.type === 'Exam');
      const final = finalExam?.score || 0;

      // 30% ICA, 70% Final
      const total = (icaAvg * 0.3) + (final * 0.7);
      const grade = GPA_SCALE.find(g => total >= g.min);
      return (grade?.gpa || 0) * s.credit_hours;
    });
    const totalCredits = subjects.reduce((acc, curr) => acc + curr.credit_hours, 0);
    return totalCredits > 0 ? Number((gpas.reduce((a, b) => a + b, 0) / totalCredits).toFixed(2)) : 0;
  }, [subjects]);

  const { nearestExam, upcomingExams } = useMemo(() => {
    const futureExams = [...exams]
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return {
      nearestExam: futureExams[0],
      upcomingExams: futureExams.slice(1) // Show all exams after the nearest
    };
  }, [exams]);

  const getTimeRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, total: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, total: diff };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-950">Hello, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}! 👋</h2>
          <p className="text-slate-800 font-black">Ready to crush your study goals today?</p>
        </div>
        <button
          onClick={onRequestNotifications}
          className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
        >
          <Bell size={20} />
        </button>
      </header>

      <div className={`grid gap-6 ${studentType === 'undergraduate' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Exam Countdown - Only for Undergraduates - Hero Style */}
        {studentType === 'undergraduate' && (
          <div className="md:col-span-2 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-center h-full">
            <div className="relative z-10">
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-3 opacity-80">Next Academic Milestone</p>

              {nearestExam ? (
                <div className="flex flex-col gap-6">
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">{nearestExam.subjectName}</h3>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2">
                      <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl flex flex-col items-center min-w-[70px]">
                        <span className="text-3xl font-black leading-none">{getTimeRemaining(nearestExam.date).days}</span>
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mt-1">Days</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl flex flex-col items-center min-w-[70px]">
                        <span className="text-3xl font-black leading-none">{getTimeRemaining(nearestExam.date).hours}</span>
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mt-1">Hrs</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl flex flex-col items-center min-w-[70px]">
                        <span className="text-3xl font-black leading-none">{getTimeRemaining(nearestExam.date).minutes}</span>
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mt-1">Min</span>
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-white/10">
                      <p className="font-bold text-lg md:text-xl">Countdown</p>
                      <p className="text-indigo-200 text-sm font-medium">{new Date(nearestExam.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6 py-4 text-indigo-100/80">
                  <Calendar size={64} strokeWidth={1} />
                  <div>
                    <p className="text-xl font-bold text-white">No Exams Scheduled</p>
                    <p className="text-sm">Stay ahead by adding your exams in GPA & Marks.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          </div>
        )}

        {/* GPA tracker Column */}
        {studentType === 'undergraduate' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-slate-700 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Your Progress</p>
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * (currentGpa / 4.0))}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-3xl font-bold text-slate-800">{currentGpa.toFixed(2)}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-400 font-black">Current GPA</p>
            <p className="text-slate-800 dark:text-slate-400 text-sm font-black">Target: <span className="font-black text-slate-950 dark:text-slate-600">{stats.target_gpa?.toFixed(2) || 'N/A'}</span></p>
          </div>
        )}

        {/* Schedule List - Redefined Horizontal List */}
        {studentType === 'undergraduate' && upcomingExams.length > 0 && (
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Upcoming Schedule</h4>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">Next {upcomingExams.length} Exams</span>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-2 custom-scrollbar">
              {upcomingExams.map(exam => {
                const rem = getTimeRemaining(exam.date);
                return (
                  <div key={exam.id} className="min-w-[200px] bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-all flex flex-col justify-between group">
                    <div>
                      <p className="font-bold text-slate-700 text-base mb-1 group-hover:text-indigo-600 transition-colors truncate">{exam.subjectName}</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-black mb-3">{new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm shadow-indigo-100">
                        {rem.days}d {rem.hours}h
                      </div>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-400">remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-indigo-600" />
              Today's Tasks
            </h4>
            <button onClick={() => onViewChange('tasks')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  {task.completed ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.title}
                    </p>
                    {task.reminded && (
                      <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1 inline-block">Missed Previously</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-400">No tasks for today. Take a break or plan ahead!</p>
              </div>
            )}
          </div>

          {todayTasks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-700 font-bold">Daily Progress</span>
              <span className="text-sm font-black text-slate-900">{completedToday} / {todayTasks.length}</span>
            </div>
          )}
        </div>

        {/* Motivation Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-black text-orange-900 mb-2">Keep the Streak!</h4>
            <p className="text-orange-900 font-medium mb-6">Complete all your daily tasks to unlock exclusive study characters.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
              🔥
            </div>
            <div>
              <p className="text-orange-950 font-black text-lg">{stats.streak} Day Streak</p>
              <p className="text-orange-900 font-bold text-sm">Next reward in {7 - (stats.streak % 7)} days</p>
            </div>
          </div>

          <button
            onClick={() => onViewChange('collection')}
            className="mt-6 w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100 dark:shadow-none"
          >
            Go to Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
