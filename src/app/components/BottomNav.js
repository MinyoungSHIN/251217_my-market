'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    {
      id: 'home',
      label: '홈',
      icon: Home,
      href: '/'
    },
    {
      id: 'chat',
      label: '채팅',
      icon: MessageCircle,
      href: '/chat',
      badge: 3 // 읽지 않은 메시지 수
    },
    {
      id: 'mypage',
      label: '나의땅콩',
      icon: User,
      href: '/mypage'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-base-300 border-t border-base-300 z-50">
      <div className="max-w-screen-xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  isActive ? 'text-primary' : 'text-base-content/60'
                }`}
              >
                <div className="relative">
                  <item.icon 
                    size={24} 
                    className={isActive ? 'fill-current' : ''} 
                    strokeWidth={2}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}