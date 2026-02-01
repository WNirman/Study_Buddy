import React, { useMemo } from 'react';
import { User, UserStats } from '../types';
import { Flame, Coins, Trophy, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { CHARACTERS } from '../constants';

interface ProfileProps {
  user: User;
  stats: UserStats;
}

const Profile: React.FC<ProfileProps> = ({ user, stats }) => {
  // Generate hotplate data for the current year
  const hotplateData = useMemo(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysInYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

    const grid: any = {};
    const hotplate = stats?.hotplate || [];
    for (let i = 0; i < daysInYear; i++) {
      const date = new Date(startOfYear);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = hotplate.find(h => h.date === dateStr);
      grid[dateStr] = activity?.count || 0;
    }
    return grid;
  }, [stats.hotplate]);

  // Get next unlockable character
  const nextUnlock = useMemo(() => {
    const unlocked = stats.unlockedCharacters || [];
    const sortedChars = CHARACTERS.sort((a, b) => a.requiredStreak - b.requiredStreak);
    return sortedChars.find(c => !unlocked.includes(c.id));
  }, [stats.unlockedCharacters]);

  // Calculate yearly activity summary
  const totalDaysActive = Object.values(hotplateData).filter((count: number) => count > 0).length;
  const maxActivityDay = Math.max(...Object.values(hotplateData) as number[], 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-8 rounded-3xl shadow-lg shadow-indigo-200 dark:shadow-none">
        <div>
          <h1 className="text-4xl font-bold">{(user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)) || 'Student'}</h1>
          <p className="text-indigo-100 mt-2 capitalize">{user?.student_type || 'Student'} Student</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-orange-300 text-xl font-bold mb-2">
              <Flame fill="currentColor" /> {stats.streak}
            </div>
            <p className="text-xs uppercase tracking-widest text-indigo-200">Day Streak</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-300 text-xl font-bold mb-2">
              <Coins fill="currentColor" /> {stats.points}
            </div>
            <p className="text-xs uppercase tracking-widest text-indigo-200">Points</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Yearly Activity Heatmap */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-indigo-700" />
            <h3 className="text-xl font-black text-slate-950">Yearly Activity</h3>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="inline-block min-w-full">
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))' }}>
                {Object.entries(hotplateData).map(([date, count]) => {
                  const intensity = Math.min((count as number) / maxActivityDay, 1);
                  const colors = [
                    'bg-slate-100',
                    'bg-green-200',
                    'bg-green-400',
                    'bg-green-600',
                    'bg-green-800'
                  ];
                  const colorIndex = Math.floor(intensity * (colors.length - 1));

                  return (
                    <div
                      key={date}
                      title={`${date}: ${count} activity`}
                      className={`w-3 h-3 rounded-sm ${colors[colorIndex]} cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-800">{totalDaysActive}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Days Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{maxActivityDay}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Peak Activity</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{(totalDaysActive / new Date().getDate()).toFixed(1)}%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Consistency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Reward */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-3xl p-8 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-orange-600" />
            <h3 className="text-xl font-black text-slate-950">Next Reward</h3>
          </div>

          {nextUnlock ? (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">{nextUnlock.emoji}</div>
              <h4 className="font-bold text-lg text-slate-800 mb-2">{nextUnlock.name}</h4>
              <p className="text-sm text-slate-600 mb-6">{nextUnlock.description}</p>

              <div className="relative pt-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{stats.streak} / {nextUnlock.requiredStreak}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full transition-all duration-500"
                    style={{ width: `${(stats.streak / nextUnlock.requiredStreak) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-orange-600 font-bold mt-4">
                {Math.max(0, nextUnlock.requiredStreak - stats.streak)} days to unlock
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="mx-auto text-yellow-400 mb-4" size={48} />
              <p className="text-slate-700 font-bold mb-2">Master Collector!</p>
              <p className="text-sm text-slate-600">You've unlocked all rewards</p>
            </div>
          )}
        </div>
      </div>

      {/* Unloacked Rewards */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="text-indigo-700" />
          <h3 className="text-xl font-black text-slate-950">Rewards Unlocked</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {CHARACTERS.map(char => {
            const isUnlocked = stats.unlockedCharacters?.includes(char.id);
            return (
              <div
                key={char.id}
                className={`p-4 rounded-2xl text-center transition-all ${isUnlocked
                  ? 'bg-indigo-50 border-2 border-indigo-300 scale-100'
                  : 'bg-slate-50 border-2 border-dashed border-slate-300 opacity-50 grayscale'
                  }`}
              >
                <div className="text-4xl mb-2">{char.emoji}</div>
                <h4 className={`font-bold text-sm ${isUnlocked ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {char.name}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPA for UG students */}
      {user.student_type === 'undergraduate' && stats.target_gpa && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-3xl p-8 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-purple-700" />
            <h3 className="text-xl font-black text-slate-950">Academic Target</h3>
          </div>

          <div className="text-center py-8">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {stats.target_gpa.toFixed(2)}
            </div>
            <p className="text-slate-600 mb-8">Target GPA</p>
            <p className="text-sm text-slate-600">
              Keep up consistent studying to achieve your academic goals. Track your progress in the GPA & Marks section.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
