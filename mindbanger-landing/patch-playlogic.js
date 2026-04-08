const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace(
  'const bgAudioRef = useRef<HTMLAudioElement | null>(null);',
  'const bgAudioRef = useRef<HTMLAudioElement | null>(null);\n  const playedOnceRef = useRef(false);'
);

const oldTogglePlay = \  const togglePlay = () => {
    // Clear fade timers on interaction
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (bgAudioRef.current) bgAudioRef.current.pause();
      } else {
        // RESET Background Volume before playing
        if (bgAudioRef.current) {
            bgAudioRef.current.volume = musicVolume;
            bgAudioRef.current.play().catch(e => console.error("Background audio play failed:", e));
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };\;

const newTogglePlay = \  const togglePlay = () => {
    // Clear fade timers on interaction
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (bgAudioRef.current) bgAudioRef.current.pause();
      } else {
        // RESET Background Volume before playing
        if (bgAudioRef.current) {
            bgAudioRef.current.volume = musicVolume;
            bgAudioRef.current.play().catch(e => console.error("Background audio play failed:", e));
        }
        audioRef.current.play();

        // Track play count for individual recordings
        if (recordingId && !playedOnceRef.current) {
            playedOnceRef.current = true;
            fetch('/api/user/recordings/track-play', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recordingId })
            }).catch(e => console.error('Error tracking play', e));
        }
      }
      setIsPlaying(!isPlaying);
    }
  };\;

c = c.replace(oldTogglePlay, newTogglePlay);

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('patched playlogic');
