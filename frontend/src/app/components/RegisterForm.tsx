// frontend/src/app/components/RegisterForm.tsx

'use client';

import React, { useState } from 'react';

/**
 * @component RegisterForm
 * @description Componente de formulário de registro para novos usuários.
 * Gerencia o estado dos campos de e-mail, senha e confirmação de senha, exibe mensagens de erro e sucesso, e lida com o envio do formulário.
 */
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userType, setUserType] = useState('student'); // Default to student

  /**
   * @function handleSubmit
   * @description Lida com o envio do formulário de registro.
   * Realiza validações de entrada (e-mail, comprimento da senha, senhas coincidentes), envia os dados para a API de registro.
   * Exibe mensagens de erro ou sucesso com base na resposta da API.
   * @param {React.FormEvent} e - O evento de formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    console.log('Register attempt with:', { email, password });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, user_type: userType }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Melhorar a mensagem de erro com base na resposta do backend
        if (response.status === 409) { // Conflict, e.g., user already exists
          setError('Este e-mail já está registrado. Por favor, use outro ou faça login.');
        } else {
          setError(data.detail || 'Erro ao registrar usuário. Tente novamente mais tarde.');
        }
        return;
      }

      const data = await response.json();
      setSuccess('Registro realizado com sucesso! Você pode fazer login agora.');
      console.log('Registration successful:', data);
      // TODO: Redirecionar para a página de login ou dashboard

    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      console.error('Registration error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrar</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
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
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirmar Senha:</label>
        <input
          type="password"
          id="confirmPassword"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="userType" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Usuário:</label>
        <select
          id="userType"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="student">Aluno</option>
          <option value="teacher">Professor</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Registrar
        </button>
      </div>
      <p className="text-center text-gray-600 text-sm mt-4">
        Já tem uma conta? <a href="/login" className="text-blue-500 hover:text-blue-800">Faça login aqui</a>.
      </p>
    </form>
  );
};

export default RegisterForm;