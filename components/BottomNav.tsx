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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <button
              key={item.route}
              onClick={() => router.push(item.route)}
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}