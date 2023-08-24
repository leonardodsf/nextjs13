import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="flex items-center justify-center font-bold text-gray-700 text-2xl">
        <img
          className="h-9 w-auto"
          src="//cdn.otstatic.com/cfe/14/images/opentable-logo-153e80.svg"
          alt="OpenTable logo"
        />
      </Link>
      <div>
        <div className="flex">
          <button className="bg-cyan-800 text-white border p-1 px-4 rounded mr-3">Sign in</button>
          <button className="border p-1 px-4 rounded">Sign up</button>
        </div>
      </div>
    </nav>
  );
}
