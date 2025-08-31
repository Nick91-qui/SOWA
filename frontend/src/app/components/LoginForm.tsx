// frontend/src/app/components/LoginForm.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @component LoginForm
 * @description Componente de formulário de login para autenticação de usuários.
 * Gerencia o estado dos campos de e-mail e senha, exibe mensagens de erro e lida com o envio do formulário.
 */
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  /**
   * @function handleSubmit
   * @description Lida com o envio do formulário de login.
   * Realiza validações de entrada, envia as credenciais para a API de login e redireciona o usuário em caso de sucesso.
   * Exibe mensagens de erro em caso de falha na validação ou na autenticação.
   * @param {React.FormEvent} e - O evento de formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Validação de formato de e-mail simples
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    // Validação de comprimento da senha
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    console.log('Login attempt with:', { email, password });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login/access-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Melhorar a mensagem de erro com base na resposta do backend
        if (response.status === 400) {
          setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } else {
          setError(data.detail || 'Erro ao fazer login. Tente novamente mais tarde.');
        }
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');

    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Entrar</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Login
        </button>
      </div>
      <p className="text-center text-gray-600 text-sm mt-4">
        Não tem uma conta? <a href="/register" className="text-blue-500 hover:text-blue-800">Registre-se aqui</a>.
      </p>
    </form>
  );
};

export default LoginForm;