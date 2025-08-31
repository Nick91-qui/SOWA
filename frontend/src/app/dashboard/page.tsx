// frontend/src/app/dashboard/page.tsx

import React from 'react';
import TeacherInterface from './teacher-interface';

/**
 * @component DashboardPage
 * @description Página do dashboard do professor, que exibe a interface do professor.
 * @returns {JSX.Element} O componente da página do dashboard.
 */
const DashboardPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-8">Dashboard do Professor</h1>
      <TeacherInterface />
    </div>
  );
};

export default DashboardPage;