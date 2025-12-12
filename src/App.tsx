import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import ConceptVisualsPage from './pages/ConceptVisualsPage';
import ConceptVisualsPromptSample from './pages/ConceptVisualsPromptSample';
import KireiRoutinePage from './pages/KireiRoutinePage';
import UrbanGrindPage from './pages/UrbanGrindPage';
import AiNewsBotPage from './pages/AiNewsBotPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/concept-visuals" element={<ConceptVisualsPage />} />
        <Route path="/projects/concept-visuals/prompt-sample" element={<ConceptVisualsPromptSample />} />
        <Route path="/projects/kireiroutine" element={<KireiRoutinePage />} />
        <Route path="/projects/urban-grind" element={<UrbanGrindPage />} />
        <Route path="/projects/ai-news-bot" element={<AiNewsBotPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;