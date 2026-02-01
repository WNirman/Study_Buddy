import React, { useState, useEffect } from 'react';
import { Task, Subject } from '../types';
import { getStudyAnalysis } from '../services/gemini';
import { Sparkles, Loader2, CheckCircle, XCircle, Target, Zap } from 'lucide-react';

interface DailyAnalysisProps {
  tasks: Task[];
  subjects: Subject[];
}

const DailyAnalysis: React.FC<DailyAnalysisProps> = ({ tasks, subjects }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      // Ensure we don't crash if Gemini API key is missing or fails
      try {
        const res = await getStudyAnalysis(subjects, tasks);
        setAnalysis(res);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, [subjects, tasks]);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = (tasks || []).filter(t => t?.dueDate?.startsWith(today));
  const completedCount = todayTasks.filter(t => t.completed).length;
  // Type: completed is boolean now
  const missedCount = todayTasks.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-800" size={48} />
        <p className="text-black font-black">AI is analyzing your study performance...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-950">Daily Insight</h2>
        <p className="text-slate-900 font-bold">AI-driven analysis of your academic progress.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm dark:shadow-none">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="text-indigo-600" /> Task Statistics
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <span className="font-bold text-green-700">Completed</span>
              </div>
              <span className="text-2xl font-bold text-green-700">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-500" />
                <span className="font-bold text-red-700">Missed</span>
              </div>
              <span className="text-2xl font-bold text-red-700">{missedCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap /> AI Focus Order
          </h3>
          <ol className="space-y-3">
            {analysis?.focusOrder?.map((name: string, idx: number) => (
              <li key={idx} className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold">{name}</span>
              </li>
            ))}
            {!analysis?.focusOrder && <p className="opacity-70">No data available</p>}
          </ol>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm dark:shadow-none relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
            <Sparkles size={22} /> Strategic Summary
          </h3>
          <p className="text-slate-950 leading-relaxed font-bold mb-8">
            {analysis?.summary || 'No analysis generated.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysis?.tips?.map((tip: string, idx: number) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-3">
                  {idx + 1}
                </div>
                <p className="text-sm font-black text-slate-950">{tip}</p>
              </div>
            ))}
          </div>
        </div>
        <Sparkles className="absolute top-10 right-10 text-indigo-50 opacity-50" size={120} />
      </div>
    </div>
  );
};

export default DailyAnalysis;
