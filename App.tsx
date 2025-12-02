// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SchedulePage from './SchedulePage';
import SectionDetailPage from './SectionDetailPage';
import CalendarPage from './CalendarPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f1e7] text-slate-900">
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/list" element={<SchedulePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/section/:sectionId" element={<SectionDetailPage />} />
      </Routes>
    </div>
  );
};


export default App;
