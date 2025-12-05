// App.tsx
import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import SchedulePage from './SchedulePage';
import SectionDetailPage from './SectionDetailPage';
import CalendarPage from './CalendarPage';
import BottomNav, { TabType } from './src/components/BottomNav';
import GuidePage from './src/components/GuidePage';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // セクション詳細ページではタブを非表示
  const isSectionDetail = location.pathname.startsWith('/section/');
  
  // タブ状態管理
  const getInitialTab = (): TabType => {
    if (location.pathname === '/calendar') return 'calendar';
    if (location.pathname === '/guide') return 'guide';
    return 'home';
  };
  
  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'calendar') {
      navigate('/calendar');
    } else if (tab === 'guide') {
      navigate('/guide');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1e7] text-slate-900">
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/list" element={<SchedulePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/section/:sectionId" element={<SectionDetailPage />} />
      </Routes>
      
      {/* 下部ナビ（セクション詳細以外で表示） */}
      {!isSectionDetail && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default App;
