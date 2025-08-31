// frontend/src/app/register/page.tsx

import React from 'react';
import RegisterForm from '../components/RegisterForm';

/**
 * @component RegisterPage
 * @description Página de registro da aplicação. Renderiza o componente `RegisterForm`
 * para permitir que novos usuários criem uma conta.
 *
 * @returns {JSX.Element} O componente da página de registro.
 */
const RegisterPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24 bg-gray-100">
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;