'use client';

import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { label: 'Summary', icon: '🏠', route: '/home' },
    { label: 'Reaction', icon: '⚡', route: '/reaction-test' },
    { label: 'Sunrise', icon: '☀️', route: '/sunrise-plan' },
    { label: 'Trends', icon: '📊', route: '/trends' },
    { label: 'Profile', icon: '👤', route: '/profile' },
  ];

  return (
    <>
      {/* Safe area spacer */}
      <div className="h-20"></div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-20 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <button
                key={item.route}
                onClick={() => router.push(item.route as any)}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`text-2xl mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-semibold transition-all duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}