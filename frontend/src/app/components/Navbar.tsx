import Link from 'next/link';

/**
 * @component Navbar
 * @description Componente de barra de navegação para o aplicativo.
 * Exibe links para as páginas de Login, Registro e Dashboard.
 * @returns {JSX.Element} O componente da barra de navegação.
 */
export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full z-10 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          SOWA
        </Link>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link href="/register" className="text-gray-300 hover:text-white">
            Register
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}