import React, { useState } from 'react';
import { Subject, Mark, Exam, User } from '../types';
import { subjectService, examService } from '../services/api';
import { Plus, Trash2, Edit3, Calculator, Calendar } from 'lucide-react';

interface AcademicTrackerProps {
  user: User;
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
  targetGpa: number;
  onUpdateTargetGpa: (gpa: number) => void;
  exams: Exam[];
  onUpdateExams: (exams: Exam[]) => void;
}

const getTimeRemaining = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, total: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, total: diff };
};

const AcademicTracker: React.FC<AcademicTrackerProps> = ({
  user,
  subjects,
  onUpdateSubjects,
  targetGpa,
  onUpdateTargetGpa,
  exams,
  onUpdateExams
}) => {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', credit_hours: 3 });

  const [showAddExam, setShowAddExam] = useState(false);
  const [newExam, setNewExam] = useState({ subject_name: '', date: '' });

  const isUG = user.student_type === 'undergraduate';

  const addSubject = async () => {
    if (!newSubject.name) return;
    try {
      await subjectService.createSubject({
        userId: user.id,
        name: newSubject.name,
        credit_hours: newSubject.credit_hours
      });
      onUpdateSubjects([]);
      setNewSubject({ name: '', credit_hours: 3 });
      setShowAddSubject(false);
    } catch (e) {
      console.error(e);
      alert("Failed to add subject");
    }
  };

  const addMark = async (subjectId: number, type: 'ICA' | 'Exam') => {
    const scoreStr = prompt(`Enter ${type} Score (0-100):`);
    if (scoreStr === null || isNaN(Number(scoreStr))) return;
    const score = Math.min(100, Math.max(0, Number(scoreStr)));

    try {
      await subjectService.addMark(subjectId, {
        name: type === 'ICA' ? `ICA` : 'Final Exam',
        type,
        score,
        max_score: 100,
        weightage: type === 'ICA' ? 30 : 70
      });
      onUpdateSubjects([]);
    } catch (e) {
      console.error(e);
      alert("Failed to add mark");
    }
  };

  const addExam = async () => {
    if (!newExam.subject_name || !newExam.date) return;
    try {
      await examService.createExam({
        userId: user.id,
        subject_name: newExam.subject_name,
        date: newExam.date,
        description: ''
      });
      onUpdateExams([]);
      setNewExam({ subject_name: '', date: '' });
      setShowAddExam(false);
    } catch (e) {
      console.error(e);
      alert("Failed to add exam");
    }
  };

  const deleteExam = async (examId: number) => {
    try {
      await examService.deleteExam(examId);
      onUpdateExams(exams.filter(e => e.id !== examId));
    } catch (e) {
      console.error(e);
      alert("Failed to delete exam");
    }
  };

  const calculateTotal = (subject: Subject) => {
    const icas = subject.marks?.filter(m => m.type === 'ICA') || [];
    const icaTotal = icas.reduce((a, b) => a + b.score, 0);
    const icaAvg = icas.length > 0 ? icaTotal / icas.length : 0;

    const finalExam = subject.marks?.find(m => m.type === 'Exam');
    const final = finalExam?.score || 0;

    return (icaAvg * 0.3) + (final * 0.7);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white">Academic Tracker</h2>
          <p className="text-slate-700 dark:text-slate-400 font-medium">Manage your marks and calculate your semester progress.</p>
        </div>

        {isUG && (
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs text-black dark:text-slate-300 font-black uppercase tracking-wider">Target GPA</span>
              <div className="flex items-center gap-2">
                <Calculator size={18} className="text-indigo-700 dark:text-indigo-400" />
                <input
                  type="number"
                  step="0.1"
                  max="4.0"
                  min="0"
                  value={targetGpa}
                  onChange={(e) => onUpdateTargetGpa(Number(e.target.value))}
                  className="text-2xl font-black text-black dark:text-white bg-transparent w-20 focus:outline-none focus:text-indigo-700 dark:focus:text-indigo-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-black dark:text-slate-200 flex items-center gap-2">
            <Calendar className="text-indigo-700 dark:text-indigo-400" />
            Exam Schedule
          </h3>
          <button
            onClick={() => setShowAddExam(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus size={18} /> Add Exam
          </button>
        </div>

        {showAddExam && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Subject Name"
                className="flex-1 p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl outline-none focus:border-indigo-500"
                value={newExam.subject_name}
                onChange={e => setNewExam({ ...newExam, subject_name: e.target.value })}
              />
              <input
                type="datetime-local"
                className="p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl outline-none focus:border-indigo-500"
                value={newExam.date}
                onChange={e => setNewExam({ ...newExam, date: e.target.value })}
              />
              <button onClick={addExam} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Add</button>
              <button onClick={() => setShowAddExam(false)} className="px-6 py-3 text-slate-400 font-medium hover:text-slate-600">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => {
            const remaining = getTimeRemaining(exam.date);
            const isPast = remaining.total <= 0;

            return (
              <div key={exam.id} className={`p-4 bg-white dark:bg-slate-800 border ${isPast ? 'border-slate-200 opacity-60' : 'border-indigo-200 dark:border-slate-700'} rounded-2xl flex flex-col gap-3 group transition-all hover:shadow-md dark:hover:shadow-none`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-slate-900 dark:text-slate-200">{exam.subjectName}</p>
                    <p className="text-xs text-slate-800 dark:text-slate-400 font-black">{new Date(exam.date).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {!isPast && (
                  <div className="flex gap-2">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg text-center">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{remaining.days}d</span>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg text-center">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{remaining.hours}h</span>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg text-center">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{remaining.minutes}m</span>
                    </div>
                  </div>
                )}
                {isPast && (
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Ended</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-black dark:text-slate-200 flex items-center gap-2">
            <Edit3 className="text-indigo-700 dark:text-indigo-400" />
            Subject Management
          </h3>
          <button
            onClick={() => setShowAddSubject(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>

        {showAddSubject && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Subject Name"
                className="flex-1 p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl outline-none focus:border-indigo-500"
                value={newSubject.name}
                onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Credits"
                className="w-24 p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl outline-none focus:border-indigo-500"
                value={newSubject.credit_hours}
                onChange={e => setNewSubject({ ...newSubject, credit_hours: Number(e.target.value) })}
              />
              <button onClick={addSubject} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Add</button>
              <button onClick={() => setShowAddSubject(false)} className="px-6 py-3 text-slate-400 font-medium hover:text-slate-600">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {subjects.map(subject => (
            <div key={subject.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white">{subject.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{subject.credit_hours} Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">Current Avg</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{calculateTotal(subject).toFixed(1)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-600 dark:text-slate-300 text-sm">ICAs (30%)</p>
                    <button onClick={() => addMark(subject.id, 'ICA')} className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">+ Add Score</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subject.marks?.filter(m => m.type === 'ICA').map(ica => (
                      <div key={ica.id} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-2 rounded-xl flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">{ica.name}:</span>
                        <span className="font-bold text-slate-700 dark:text-white">{ica.score}</span>
                      </div>
                    ))}
                    {(!subject.marks || subject.marks.filter(m => m.type === 'ICA').length === 0) && <p className="text-xs text-slate-400 italic">No ICA marks added yet.</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-600 dark:text-slate-300 text-sm">Final Exam (70%)</p>
                    <button onClick={() => addMark(subject.id, 'Exam')} className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">Edit Score</button>
                  </div>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900 p-4 rounded-2xl">
                    {subject.marks?.find(m => m.type === 'Exam') ? (
                      <p className="text-2xl font-bold text-slate-700 dark:text-white">{subject.marks.find(m => m.type === 'Exam')?.score}%</p>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic">Score not yet entered.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {subjects.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
              <Calculator size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">Add your first subject to start tracking.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AcademicTracker;
