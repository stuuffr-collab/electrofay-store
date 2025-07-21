import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        onComplete?.();
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isExpired) {
    return (
      <div className="text-xl font-bold text-red-400">
        انتهى العرض!
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4 space-x-reverse">
      <div className="bg-white/20 rounded-lg p-4 min-w-16 text-center">
        <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-sm">يوم</div>
      </div>
      <div className="bg-white/20 rounded-lg p-4 min-w-16 text-center">
        <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-sm">ساعة</div>
      </div>
      <div className="bg-white/20 rounded-lg p-4 min-w-16 text-center">
        <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-sm">دقيقة</div>
      </div>
      <div className="bg-white/20 rounded-lg p-4 min-w-16 text-center">
        <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-sm">ثانية</div>
      </div>
    </div>
  );
}
