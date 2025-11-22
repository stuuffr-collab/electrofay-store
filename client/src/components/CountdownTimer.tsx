import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2 text-red-500 ${className}`}>
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">انتهت الفترة</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-orange-500 ${className}`}>
      <Clock className="w-4 h-4" />
      <div className="flex items-center gap-1 text-sm font-mono">
        <span className="bg-orange-100 dark:bg-orange-900 px-1.5 py-1 rounded text-orange-800 dark:text-orange-200 font-bold">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="bg-orange-100 dark:bg-orange-900 px-1.5 py-1 rounded text-orange-800 dark:text-orange-200 font-bold">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="bg-orange-100 dark:bg-orange-900 px-1.5 py-1 rounded text-orange-800 dark:text-orange-200 font-bold">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
