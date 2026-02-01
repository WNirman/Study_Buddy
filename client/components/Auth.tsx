import React, { useState } from 'react';
import { authService } from '../services/api';
import { User } from '../types';

interface AuthProps {
    onLogin: (user: User) => void;
    onViewChange: (view: 'login' | 'register') => void;
    view: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ onLogin, onViewChange, view }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        student_type: 'undergraduate',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            let user;
            if (view === 'login') {
                user = await authService.login({
                    username: formData.username,
                    password: formData.password
                });
            } else {
                user = await authService.register({
                    username: formData.username,
                    password: formData.password,
                    student_type: formData.student_type
                });
            }
            onLogin(user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
                    {view === 'login' ? 'Welcome Back' : 'Join StudyBuddy'}
                </h2>

                {error && <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-cyan-400 focus:outline-none"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-cyan-400 focus:outline-none"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {view === 'register' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">I am a...</label>
                                <select
                                    className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                                    value={formData.student_type}
                                    onChange={e => setFormData({ ...formData, student_type: e.target.value })}
                                >
                                    <option value="school">School Student</option>
                                    <option value="undergraduate">Undergraduate</option>
                                    <option value="other">Working / Online Learner</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded transition-colors"
                    >
                        {view === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    {view === 'login' ? (
                        <p>New here? <button onClick={() => onViewChange('register')} className="text-cyan-400 hover:underline">Sign up</button></p>
                    ) : (
                        <p>Already have an account? <button onClick={() => onViewChange('login')} className="text-cyan-400 hover:underline">Log in</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
