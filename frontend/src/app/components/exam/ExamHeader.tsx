import React from 'react';
import ExamTimer from '@/app/components/ExamTimer';

interface ExamHeaderProps {
  examTitle: string;
  durationInMinutes?: number;
  onTimeUp: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  durationInMinutes,
  onTimeUp,
}) => {
  return (
    <div className="w-full flex flex-col items-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800">{examTitle}</h1>
      {durationInMinutes && (
        <ExamTimer durationInMinutes={durationInMinutes} onTimeUp={onTimeUp} />
      )}
    </div>
  );
};

export default ExamHeader;