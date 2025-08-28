import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src="/images/logo_SOWA.png"
        alt="SOWA Logo"
        width={300}
        height={150}
        priority
      />
      <h1 className="text-6xl font-bold mt-8">Welcome to SOWA!</h1>
      <p className="text-xl mt-4">Your Secure Online Web Assessment Application</p>
      <Image
        src="/images/banner.png"
        alt="SOWA Banner"
        width={800}
        height={400}
        className="mt-12"
      />
    </div>
  );
}
