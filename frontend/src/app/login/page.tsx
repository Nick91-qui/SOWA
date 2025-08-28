// frontend/src/app/login/page.tsx

import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24 bg-gray-100">
      <LoginForm />
    </main>
  );
};

export default LoginPage;