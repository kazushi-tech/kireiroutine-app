import React, { useState, useEffect, useMemo } from 'react';
import { CLEANING_DATA, IMAGE_URLS } from './constants';
import { Frequency, ScheduleCategory } from './types';
import { Sparkles, CheckCircle2, Circle, Wrench, Info, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeFrequency, setActiveFrequency] = useState<Frequency>(Frequency.Weekly);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kireiRoutineProgress');
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  // Save state to local storage on change
  useEffect(() => {
    localStorage.setItem('kireiRoutineProgress', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const activeCategory = useMemo(() => 
    CLEANING_DATA.find(c => c.frequency === activeFrequency) || CLEANING_DATA[0],
  [activeFrequency]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calculateProgress = (category: ScheduleCategory) => {
    let total = 0;
    let done = 0;
    category.sections.forEach(section => {
      section.tasks.forEach(task => {
        total++;
        if (completedTasks[task.id]) done++;
      });
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const progress = calculateProgress(activeCategory);

  const handleReset = () => {
    if (confirm("現在の頻度のチェックをすべてリセットしますか？")) {
      const newCompleted = { ...completedTasks };
      activeCategory.sections.forEach(s => {
        s.tasks.forEach(t => {
          delete newCompleted[t.id];
        });
      });
      setCompletedTasks(newCompleted);
      setShowResetConfirm(false);
    }
  };

  // UI Components
  const TabButton: React.FC<{ freq: Frequency; label: string }> = ({ freq, label }) => {
    const isActive = activeFrequency === freq;
    return (
      <button
        onClick={() => setActiveFrequency(freq)}
        className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-200 whitespace-nowrap
          ${isActive 
            ? 'bg-warm-500 text-white shadow-md shadow-orange-200' 
            : 'bg-white text-stone-600 hover:bg-warm-100'
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-warm-50 font-sans text-stone-800 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-warm-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-warm-100 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-warm-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-warm-800 tracking-tight">KireiRoutine</h1>
                <p className="text-sm text-warm-600 font-medium">掃除ルーティン完全表</p>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="p-2 text-stone-400 hover:text-warm-600 transition-colors"
              title="リセット"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {CLEANING_DATA.map((cat) => (
              <TabButton key={cat.frequency} freq={cat.frequency} label={cat.label} />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Progress Section */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-warm-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">{activeCategory.label}</h2>
            <p className="text-stone-500 text-base mb-4">{activeCategory.description}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warm-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-warm-600 font-bold font-mono text-lg">{progress}%</span>
            </div>
          </div>
          {/* Decorative background blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-warm-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCategory.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-warm-100 flex flex-col group">
              
              {/* Card Image */}
              <div className="aspect-video w-full overflow-hidden relative">
                <img 
                  src={IMAGE_URLS[section.imageKey]} 
                  alt={section.areaName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('bg-warm-200');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-900/70 via-warm-900/20 to-transparent flex items-end">
                  <h3 className="text-white font-bold text-2xl px-5 py-3 drop-shadow-md tracking-wide">{section.areaName}</h3>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  {section.tasks.map((task) => {
                    const isDone = !!completedTasks[task.id];
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                          isDone 
                            ? 'bg-stone-50' 
                            : 'hover:bg-warm-50 border border-transparent hover:border-warm-100'
                        }`}
                      >
                        <div className={`mt-0.5 transition-colors ${isDone ? 'text-warm-500' : 'text-stone-300 group-hover:text-warm-400'}`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5 fill-warm-100" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <span className={`text-lg leading-relaxed transition-all duration-300 ${isDone ? 'text-stone-400 line-through decoration-warm-300' : 'text-stone-700'}`}>
                          {task.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tools Section */}
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 mb-2 text-warm-600">
                    <Wrench className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">使用道具</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {section.tools.map((tool, idx) => (
                      <span key={idx} className="inline-block px-2.5 py-1 bg-stone-50 text-stone-600 text-sm rounded-md border border-stone-200 font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer / Tip */}
      <footer className="max-w-4xl mx-auto px-4 mt-8 mb-4 text-center">
        <div className="bg-warm-100/50 p-4 rounded-xl inline-flex items-start gap-3 text-left max-w-2xl">
          <Info className="w-5 h-5 text-warm-600 shrink-0 mt-0.5" />
          <div className="text-base text-warm-900">
            <p className="font-bold mb-1">運用のコツ</p>
            <p>まずは「週1」だけを確実に回すのを最優先にしましょう。余裕がある週に「2週間に1回」「月1」から1〜2ブロックだけ追加していくイメージでOKです。</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;