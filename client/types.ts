export interface User {
  id: number;
  username: string;
  student_type: 'school' | 'undergraduate' | 'other';
  target_gpa?: number;
  points: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  reminded?: boolean;
  priority: 'low' | 'medium' | 'high';
  duration_minutes: number;
}

export interface Mark {
  id: number;
  subject_id: number;
  name: string;
  type: 'ICA' | 'Exam';
  score: number;
  max_score: number;
  weightage: number;
}

export interface Subject {
  id: number;
  name: string;
  credit_hours: number;
  marks?: Mark[];
}

export interface UserStats {
  points: number;
  target_gpa: number;
  streak: number; // Calculated or from DB
  student_type: string;
  unlockedCharacters?: string[];
  hotplate: { date: string; count: number }[];
}

export interface Exam {
  id: number;
  subjectName: string;
  date: string;
}

export type AppView = 'login' | 'register' | 'dashboard' | 'academic' | 'tasks' | 'collection' | 'analysis' | 'work' | 'profile';
