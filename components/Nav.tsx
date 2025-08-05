'use client';

import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';

export default function Nav() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <nav className="backdrop-blur-lg border-b" style={{ 
      background: 'rgba(var(--background), 0.8)', 
      borderColor: 'var(--border-color)' 
    }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-bg-blue rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L13.09 8.26L19 7.27L14.18 11.97L20 16.64L13.83 14.18L12 21L10.17 14.18L4 16.64L9.82 11.97L5 7.27L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Wake Launch Sequence
            </h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-lg border z-10" style={{
                background: 'var(--card-background)',
                borderColor: 'var(--border-color)'
              }}>
                <div className="p-2">
                  <button
                    onClick={() => {
                      signOut();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Sign Out
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