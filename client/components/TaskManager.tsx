import React, { useState } from 'react';
import { Task, User } from '../types';
import { taskService } from '../services/api';
import { Plus, Check, Trash2, Calendar, Clock, AlertTriangle, ListTodo, Hourglass } from 'lucide-react';

interface TaskManagerProps {
  user: User | null;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ user, tasks, onUpdateTasks }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState(60); // Default 60 mins

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    if (!user) {
      alert("Error: User not found. Please log in again.");
      return;
    }

    const today = new Date();
    // Manual YYYY-MM-DD formatting to be 100% safe
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    try {
      await taskService.createTask({
        userId: user.id,
        title: newTitle,
        dueDate: dateStr,
        completed: false,
        priority: newPriority,
        duration_minutes: newDuration
      });

      setNewTitle('');
      setNewTime('');
      setNewDuration(60);
      alert("Task created successfully!");
      // Refresh tasks from backend
      onUpdateTasks([]);
    } catch (e) {
      console.error('Error creating task:', e);
      alert("Failed to create task: " + ((e as any).response?.data?.error || (e as any).message));
    }
  };

  const toggleTask = async (id: number, currentStatus: boolean) => {
    try {
      const res = await taskService.updateTask(id, { completed: !currentStatus });
      if (res.pointsChange && res.pointsChange !== 0) {
        // Optional: Notify user of points change
        // console.log(`Points ${res.pointsChange > 0 ? 'added' : 'removed'}: ${res.pointsChange}`);
      }
      onUpdateTasks([]);
    } catch (e) {
      console.error(e);
    }
  };

  const removeTask = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      onUpdateTasks([]);
    } catch (e) {
      console.error(e);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Sort by priority logic if needed, but due date is usually primary
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Study Tasks</h2>
        <p className="text-slate-500">Stay organized and productive with your daily plan.</p>
      </header>

      <form onSubmit={addTask} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="What needs to be studied today?"
            className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-colors"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-400">PRIORITY:</span>
            {(['low', 'medium', 'high'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPriority(p)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${newPriority === p ? getPriorityColor(p) + ' ring-2 ring-offset-1 ring-current' : 'bg-transparent text-slate-400 border-slate-200'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <Hourglass size={18} className="text-indigo-500" />
              <input
                type="number"
                min="5"
                step="5"
                value={newDuration}
                onChange={e => setNewDuration(Number(e.target.value))}
                className="bg-transparent font-bold outline-none w-12 text-center"
                title="Duration (minutes)"
              />
              <span className="text-xs font-bold text-slate-400">min</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Clock size={18} />
              <input
                type="time"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="bg-transparent font-bold outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Plus size={20} /> Add Task
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {sortedTasks.map(task => (
          <div
            key={task.id}
            className={`group p-5 bg-white border rounded-2xl flex items-center gap-4 transition-all ${task.completed ? 'opacity-60 border-slate-100 shadow-none' : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
          >
            <button
              onClick={() => toggleTask(task.id, task.completed)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-indigo-500'
                }`}
            >
              {task.completed && <Check size={16} strokeWidth={3} />}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className={`font-bold transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                  {task.priority || 'medium'}
                </span>
                {task.reminded && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-600 border border-orange-200">
                    <AlertTriangle size={10} /> Missed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-slate-400 text-xs">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1 text-indigo-500 font-bold ml-2">
                  <Hourglass size={12} /> {task.duration_minutes || 60}m
                  <span className="ml-1 text-[10px] bg-indigo-50 px-1.5 rounded text-indigo-600">+{Math.round((task.duration_minutes || 60) * 0.83)} pts</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => removeTask(task.id)}
              className="text-slate-200 group-hover:text-red-400 transition-colors p-2"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl">
            <ListTodo size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Your study plan is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
