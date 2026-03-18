'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useDictionary } from '@/lib/i18n-client';

interface AudioPlayerProps {
  src: string;
  title: string;
  coverArt?: string;
  author?: string;
  compact?: boolean;
}

export default function AudioPlayer({ src, title, coverArt, author = "Mindbanger", compact = false }: AudioPlayerProps) {
  const { dict } = useDictionary();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audio) audio.currentTime = 0;
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full bg-slate-900/80 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden relative group ${compact ? 'p-3' : 'p-4'}`}>
      {/* Decorative ambient gradient behind the player (simulating glow based on cover art vibes) */}
      <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-70 transition-opacity duration-700"></div>

      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 relative z-10 w-full">
        {/* Cover Art Visual */}
        {!compact && (<div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl shadow-lg flex-shrink-0 overflow-hidden group-hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all duration-500">
          {coverArt ? (
            <img 
              src={coverArt} 
              alt={title || "Audio Cover"} 
              className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'scale-105' : 'scale-100'}`} 
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-amber-600 via-purple-700 to-slate-900 relative ${isPlaying ? 'bg-[length:200%_200%] animate-gradient-xy' : ''}`}>
              {/* Abstract visualizer fallback */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className={`w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_60%)] ${isPlaying ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
          )}
          {/* Subtle overlay on cover art */}
          <div className="absolute inset-0 bg-black/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </div>)}

        <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
          <div className={`flex justify-between items-start ${compact ? "mb-2" : "mb-4"}`}>
            <div>
              <p className="text-white font-bold text-lg truncate drop-shadow-md">{title}</p>
              <p className="text-slate-400 text-sm font-medium">{author}</p>
            </div>
            {/* Play Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? (dict.audio?.pause || 'Pause') : (dict.audio?.play || 'Play')}
              title={isPlaying ? (dict.audio?.pause || 'Pause') : (dict.audio?.play || 'Play')}
              className="flex-shrink-0 w-12 h-12 bg-white/10 hover:bg-amber-500 hover:text-slate-900 text-amber-500 border border-white/5 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium w-8 text-right font-mono tracking-tighter">
              {formatTime(currentTime)}
            </span>
            
            <div className="relative flex-1 h-2 group/slider cursor-pointer">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <div className="absolute inset-0 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-150 relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glossy highlight on progress bar */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full"></div>
                </div>
              </div>
            </div>
            
            <span className="text-xs text-slate-400 font-medium w-8 font-mono tracking-tighter">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
