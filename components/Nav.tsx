'use client';

import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';

export default function Nav() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">
                Wake Launch <span className="text-primary">Sequence</span>
              </h1>
            </div>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <span className="mr-2">{user.email}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      signOut();
                      setShowMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}