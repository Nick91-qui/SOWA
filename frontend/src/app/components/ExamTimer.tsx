// frontend/src/app/components/ExamTimer.tsx

'use client';

import React, { useState, useEffect } from 'react';

interface ExamTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ durationInMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Tempo Restante: <span className="text-blue-600">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default ExamTimer;