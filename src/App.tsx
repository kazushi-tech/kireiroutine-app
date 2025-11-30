import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConceptVisualsPage from './pages/ConceptVisualsPage';
import ConceptVisualsPromptSample from './pages/ConceptVisualsPromptSample';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/concept-visuals" element={<ConceptVisualsPage />} />
        <Route path="/projects/concept-visuals/prompt-sample" element={<ConceptVisualsPromptSample />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;