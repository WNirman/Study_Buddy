import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Task, Subject, UserStats, Exam, User } from './types';
import { taskService, subjectService, statsService, examService } from './services/api';
import Dashboard from './components/Dashboard';
import AcademicTracker from './components/AcademicTracker';
import TaskManager from './components/TaskManager';
import Collection from './components/Collection';
import DailyAnalysis from './components/DailyAnalysis';
import Profile from './components/Profile';
import WorkMode from './components/WorkMode';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const [isDark, setIsDark] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    streak: 0,
    target_gpa: 4.0,
    student_type: 'undergraduate',
    unlockedCharacters: [],
    hotplate: []
  });
  const [exams, setExams] = useState<Exam[]>([]);

  // Theme Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [fetchedTasks, fetchedSubjects, fetchedStats, fetchedExams] = await Promise.all([
        taskService.getTasks(user.id),
        subjectService.getSubjects(user.id),
        statsService.getStats(user.id),
        examService.getExams(user.id)
      ]);
      setTasks(fetchedTasks);
      setSubjects(fetchedSubjects);
      setStats({
        points: fetchedStats.points || 0,
        streak: fetchedStats.streak || 0,
        target_gpa: fetchedStats.target_gpa || 4.0,
        student_type: fetchedStats.student_type || user.student_type, // Fallback to user type
        unlockedCharacters: fetchedStats.unlockedCharacters || [],
        hotplate: fetchedStats.hotplate || []
      });
      setExams(fetchedExams);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // Handle Logout
  const handleViewChange = (newView: AppView) => {
    if (newView === 'login') {
      setUser(null);
    }
    setView(newView);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView('dashboard');
  };

  const updateTasks = async (newTasks: Task[]) => {
    // Add small delay to ensure database has processed the request
    await new Promise(resolve => setTimeout(resolve, 500));
    loadData();
  };

  const updateSubjects = (newSubjects: Subject[]) => {
    loadData();
  };

  const updateExams = (newExams: Exam[]) => {
    loadData();
  };

  const addPoints = async (amount: number) => {
    if (user) {
      await statsService.logFocus({ userId: user.id, duration: 25, points: amount });
      loadData();
    }
  };

  // Notification logic
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.completed && !task.reminded) {
          const taskTime = new Date(task.dueDate);
          if (now >= taskTime && now.getTime() - taskTime.getTime() < 60000) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Study Alert!", { body: `Time to start: ${task.title}` });
            }
          }
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [tasks, user]);

  const requestNotifications = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} onViewChange={(v) => setView(v)} view={view === 'register' ? 'register' : 'login'} />;
  }

  // If Work Mode is active, we render it full screen
  if (view === 'work') {
    return (
      <WorkMode
        onComplete={(earned) => {
          addPoints(earned);
          setView('dashboard');
        }}
        onExit={() => setView('dashboard')}
      />
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar
        currentView={view}
        onViewChange={handleViewChange}
        streak={stats.streak}
        points={stats.points}
        isDark={isDark}
        toggleTheme={toggleTheme}
        studentType={user.student_type}
      />

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        {view === 'dashboard' && (
          <Dashboard
            user={user}
            tasks={tasks}
            subjects={subjects}
            exams={exams}
            stats={stats}
            studentType={user.student_type}
            onViewChange={handleViewChange}
            onRequestNotifications={requestNotifications}
          />
        )}
        {view === 'profile' && (
          <Profile user={user} stats={stats} />
        )}
        {view === 'academic' && (
          <AcademicTracker
            user={user}
            subjects={subjects}
            onUpdateSubjects={updateSubjects}
            targetGpa={stats.target_gpa}
            onUpdateTargetGpa={(gpa) => {
              // Update stats with new GPA
              setStats({ ...stats, target_gpa: gpa });
              // Potentially save to DB if needed, but for now local state sync
            }}
            exams={exams}
            onUpdateExams={updateExams}
          />
        )}
        {view === 'tasks' && (
          <TaskManager user={user} tasks={tasks} onUpdateTasks={updateTasks} />
        )}
        {view === 'collection' && (
          <Collection unlockedIds={stats.unlockedCharacters} />
        )}
        {view === 'analysis' && (
          <DailyAnalysis tasks={tasks} subjects={subjects} />
        )}
      </main>
    </div>
  );
};

export default App;
