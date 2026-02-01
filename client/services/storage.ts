
import { Task, Subject, UserStats, Exam } from '../types';
import { STORAGE_KEYS } from '../constants';

export const storage = {
  getTasks: (): Task[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]'),
  setTasks: (tasks: Task[]) => localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)),
  
  getSubjects: (): Subject[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]'),
  setSubjects: (subjects: Subject[]) => localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects)),
  
  getStats: (): UserStats => JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || JSON.stringify({
    targetGpa: 4.0,
    streak: 0,
    lastActiveDate: null,
    points: 0,
    unlockedCharacters: [],
  })),
  setStats: (stats: UserStats) => localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats)),
  
  getExams: (): Exam[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS) || '[]'),
  setExams: (exams: Exam[]) => localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams)),
};
