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
      <div style={{height: '80px'}}></div>
      
      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(229, 231, 235, 0.8)',
        boxShadow: '0 -4px 16px 0 rgba(0, 0, 0, 0.1)',
        zIndex: '50'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '80px',
          padding: '0 8px'
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <button
                key={item.route}
                onClick={() => router.push(item.route as any)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '1',
                  padding: '8px 4px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '12px',
                  position: 'relative',
                  transform: 'scale(1)'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6'
                  }} />
                )}
                <div style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{
                    fontSize: '20px',
                    color: isActive ? '#3b82f6' : '#9ca3af',
                    transition: 'color 0.2s ease'
                  }}>
                    {item.icon}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: isActive ? '#3b82f6' : '#9ca3af',
                  transition: 'color 0.2s ease',
                  textAlign: 'center'
                }}>
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