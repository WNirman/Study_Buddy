
export const CHARACTERS = [
  { id: '1', name: 'Knowledge Owl', description: 'Unlocked at 7 day streak', requiredStreak: 7, emoji: '🦉' },
  { id: '2', name: 'Study Fox', description: 'Unlocked at 14 day streak', requiredStreak: 14, emoji: '🦊' },
  { id: '3', name: 'Focus Lion', description: 'Unlocked at 21 day streak', requiredStreak: 21, emoji: '🦁' },
  { id: '4', name: 'Master Dragon', description: 'Unlocked at 30 day streak', requiredStreak: 30, emoji: '🐲' },
];

export const GPA_SCALE = [
  { min: 85, gpa: 4.0 },
  { min: 80, gpa: 3.7 },
  { min: 75, gpa: 3.3 },
  { min: 70, gpa: 3.0 },
  { min: 65, gpa: 2.7 },
  { min: 60, gpa: 2.3 },
  { min: 55, gpa: 2.0 },
  { min: 50, gpa: 1.7 },
  { min: 0, gpa: 0.0 },
];

export const STORAGE_KEYS = {
  TASKS: 'academia_tasks',
  SUBJECTS: 'academia_subjects',
  STATS: 'academia_stats',
  EXAMS: 'academia_exams',
};
