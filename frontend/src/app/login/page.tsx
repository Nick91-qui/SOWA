// frontend/src/app/login/page.tsx

import React from 'react';
import LoginForm from '../components/LoginForm';

/**
 * @component LoginPage
 * @description Página de login da aplicação. Renderiza o componente `LoginForm`
 * para permitir que os usuários insiram suas credenciais e façam login.
 *
 * @returns {JSX.Element} O componente da página de login.
 */
const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24 bg-gray-100">
      <LoginForm />
    </main>
  );
};

export default LoginPage;