import axios from 'axios';
import { Task, Subject, Exam, UserStats } from '../types';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const authService = {
    register: async (data: any) => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },
    login: async (data: any) => {
        const res = await api.post('/auth/login', data);
        return res.data;
    },
};

export const taskService = {
    getTasks: async (userId: number): Promise<Task[]> => {
        const res = await api.get(`/tasks?userId=${userId}`);
        // Convert 0/1 to boolean if needed, though often JS handles it loosely. 
        // Best to map it.
        return res.data.map((t: any) => ({
            ...t,
            dueDate: t.due_date, // Map from backend snake_case
            completed: Boolean(t.completed),
            reminded: Boolean(t.reminded),
            priority: t.priority || 'medium',
            duration_minutes: t.duration_minutes || 60
        }));
    },
    createTask: async (task: Omit<Task, 'id'> & { userId: number }) => {
        console.log('[API] Creating task with payload:', task);
        const res = await api.post('/tasks', {
            userId: task.userId,
            title: task.title,
            due_date: task.dueDate,
            priority: task.priority,
            duration_minutes: task.duration_minutes
        });
        console.log('[API] Create task response:', res.data);
        return res.data;
    },
    updateTask: async (id: number, updates: Partial<Task>) => {
        const res = await api.put(`/tasks/${id}`, updates);
        return res.data;
    },
    deleteTask: async (id: number) => {
        await api.delete(`/tasks/${id}`);
    },
};

export const subjectService = {
    getSubjects: async (userId: number): Promise<Subject[]> => {
        const res = await api.get(`/subjects?userId=${userId}`);
        return res.data.map((s: any) => ({
            ...s,
            credit_hours: Number(s.credit_hours || 0),
            marks: (s.marks || []).map((m: any) => ({
                ...m,
                score: Number(m.score || 0),
                max_score: Number(m.max_score || 0),
                weightage: Number(m.weightage || 0)
            }))
        }));
    },
    createSubject: async (data: { userId: number, name: string, credit_hours: number }) => {
        const res = await api.post('/subjects', data);
        return res.data;
    },
    addMark: async (subjectId: number, mark: any) => {
        const res = await api.post(`/subjects/${subjectId}/marks`, mark);
        return res.data;
    },
};

export const statsService = {
    getStats: async (userId: number): Promise<UserStats> => {
        const res = await api.get(`/stats?userId=${userId}`);
        return {
            ...res.data,
            points: Number(res.data.points || 0),
            target_gpa: Number(res.data.target_gpa || 4.0),
            streak: Number(res.data.streak || 0)
        };
    },
    logFocus: async (data: { userId: number, duration: number, points: number }) => {
        const res = await api.post('/stats/focus', data);
        return res.data;
    },
};

export const examService = {
    getExams: async (userId: number): Promise<Exam[]> => {
        const res = await api.get(`/exams?userId=${userId}`);
        return res.data.map((e: any) => ({
            ...e,
            subjectName: e.subject_name || 'N/A',
            date: e.date
        }));
    },
    createExam: async (data: { userId: number, subject_name: string, date: string, description?: string }) => {
        const res = await api.post('/exams', data);
        return res.data;
    },
    updateExam: async (id: number, updates: Partial<Exam>) => {
        const res = await api.put(`/exams/${id}`, updates);
        return res.data;
    },
    deleteExam: async (id: number) => {
        await api.delete(`/exams/${id}`);
    },
};

export const unlocksService = {
    getUnlocks: async (userId: number): Promise<string[]> => {
        const res = await api.get(`/unlocks?userId=${userId}`);
        return res.data;
    },
    unlockCharacter: async (userId: number, characterId: string) => {
        const res = await api.post('/unlocks', { userId, characterId });
        return res.data;
    },
};
