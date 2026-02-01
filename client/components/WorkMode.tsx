
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, CheckCircle, Coffee, ArrowLeft, Trophy } from 'lucide-react';

interface WorkModeProps {
  onComplete: (points: number) => void;
  onExit: () => void;
}

const WorkMode: React.FC<WorkModeProps> = ({ onComplete, onExit }) => {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes default
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (!isBreak) {
        setShowDone(true);
        setIsActive(false);
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60); // Reset for next work
        setIsActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const progress = useMemo(() => {
    return ((duration - timeLeft) / duration) * 100;
  }, [timeLeft, duration]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartWork = () => {
    setIsActive(true);
    setShowDone(false);
  };

  const handleSetBreak = (mins: number) => {
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
    setIsBreak(true);
    setIsActive(true);
    setShowDone(false);
  };

  const handleFinish = () => {
    onComplete(50); // Award 50 points
  };

  if (showDone) {
    return (
      <div className="fixed inset-0 bg-indigo-900/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
          <p className="text-slate-500 mb-8">Great job staying focused. You earned <span className="text-indigo-600 font-bold">50 points</span>!</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleSetBreak(5)}
              className="w-full py-4 bg-indigo-50 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              <Coffee size={20} /> Take 5 Min Break
            </button>
            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Finish for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center font-mono">
      <button 
        onClick={onExit}
        className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Exit Work Mode
      </button>

      <div className="absolute top-8 right-8 text-right">
        <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Local Time</p>
        <p className="text-4xl font-bold text-indigo-400">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>

      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
        {/* Progress Gauge */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle 
            cx="50%" cy="50%" r="45%" 
            fill="transparent" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="4" 
          />
          <circle 
            cx="50%" cy="50%" r="45%" 
            fill="transparent" 
            stroke={isBreak ? "#10b981" : "#4f46e5"} 
            strokeWidth="10" 
            strokeDasharray="283%"
            strokeDashoffset={`${283 - (283 * progress / 100)}%`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="text-center z-10">
          <p className="text-slate-400 text-sm uppercase tracking-[0.3em] mb-4">
            {isBreak ? 'Break Time' : (isActive ? 'Keep Focusing' : 'Ready to Work?')}
          </p>
          <h2 className="text-8xl md:text-9xl font-bold tracking-tighter mb-8">
            {formatTime(timeLeft)}
          </h2>
          
          {!isActive && (
            <button 
              onClick={handleStartWork}
              className="px-10 py-4 bg-indigo-600 rounded-full text-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-500/20"
            >
              START
            </button>
          )}

          {isActive && (
             <button 
                onClick={() => setIsActive(false)}
                className="px-8 py-3 border-2 border-slate-700 rounded-full text-slate-400 hover:text-white hover:border-white transition-all"
             >
               PAUSE
             </button>
          )}
        </div>
      </div>

      <div className="mt-16 text-slate-500 text-sm max-w-sm text-center">
        {isBreak ? (
          "Enjoy your break! Refresh and get ready for the next session."
        ) : (
          "Avoid distractions and focus on your current subject."
        )}
      </div>
    </div>
  );
};

export default WorkMode;
