'use client';

import Link from 'next/link';
import AuthModal from './AuthModal';
import { useContext } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import useAuth from '../../hooks/useAuth';

export default function NavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signOut } = useAuth();

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
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button className="bg-blue-400 text-white border p-1 px-4 rounded mr-3" onClick={signOut}>
                Logout
              </button>
            ) : (
              <>
                <AuthModal isSignIn />
                <AuthModal />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
