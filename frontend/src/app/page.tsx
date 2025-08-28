import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to SOWA!</h1>
      <p className="text-lg text-center mb-8">Your Secure Online Web Assessment Application</p>
      <div className="flex space-x-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
          Register
        </Link>
      </div>
    </main>
  );
}
