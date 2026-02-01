
import React from 'react';
import { CHARACTERS } from '../constants';
import { Lock, Unlock } from 'lucide-react';

interface CollectionProps {
  unlockedIds: string[] | undefined;
}

const Collection: React.FC<CollectionProps> = ({ unlockedIds = [] }) => {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Your Collection</h2>
        <p className="text-slate-500">Rewards unlocked through consistent study habits.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {CHARACTERS.map(char => {
          const isUnlocked = unlockedIds.includes(char.id);
          return (
            <div 
              key={char.id} 
              className={`relative overflow-hidden group rounded-3xl p-8 transition-all ${
                isUnlocked 
                  ? 'bg-white border-2 border-indigo-500 shadow-xl shadow-indigo-100 scale-100' 
                  : 'bg-slate-100 border-2 border-dashed border-slate-300 opacity-60 grayscale'
              }`}
            >
              <div className="text-6xl mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                {char.emoji}
              </div>
              <div className="text-center">
                <h4 className={`text-xl font-bold mb-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                  {char.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{char.description}</p>
              </div>

              {!isUnlocked && (
                <div className="absolute top-4 right-4 text-slate-400">
                  <Lock size={18} />
                </div>
              )}
              {isUnlocked && (
                 <div className="absolute top-4 right-4 text-indigo-500">
                  <Unlock size={18} />
                </div>
              )}
              
              {isUnlocked && (
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <span className="block w-full text-center text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    MASTERED
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center">
        <p className="text-indigo-800 font-bold text-lg mb-2">How to unlock more?</p>
        <p className="text-indigo-600/70 max-w-lg mx-auto">
          Keep your streak alive by completing all daily tasks! Every 7 days of consecutive study unlocks a new rare companion for your profile.
        </p>
      </div>
    </div>
  );
};

export default Collection;
