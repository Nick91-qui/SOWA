import Link from 'next/link';

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