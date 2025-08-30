import React from 'react';

interface ExamContainerProps {
  children: React.ReactNode;
}

const ExamContainer: React.FC<ExamContainerProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-gray-100">
      {children}
    </main>
  );
};

export default ExamContainer;