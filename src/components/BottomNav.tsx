// BottomNav.tsx - 下部固定ナビゲーション
import React from 'react';
import { Home, BookOpen, Calendar } from 'lucide-react';

export type TabType = 'home' | 'guide' | 'calendar';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'ホーム', icon: Home, ariaLabel: 'ホーム画面に移動' },
    { id: 'guide' as TabType, label: '使い方', icon: BookOpen, ariaLabel: '使い方ガイドを表示' },
    { id: 'calendar' as TabType, label: 'カレンダー', icon: Calendar, ariaLabel: 'カレンダー画面に移動' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-orange-50 to-amber-50/90 backdrop-blur-sm border-t border-orange-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden" 
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      role="navigation"
      aria-label="メインナビゲーション"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon, ariaLabel }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              aria-label={ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[44px] min-w-[44px] h-full pt-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-lg ${
                isActive
                  ? 'text-orange-600'
                  : 'text-slate-400 hover:text-orange-500'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-orange-100' : ''}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} aria-hidden="true" />
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-orange-400" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
