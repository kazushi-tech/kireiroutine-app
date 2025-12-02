import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Trash2,
  X,
  BedDouble,
  Utensils,
  Bath,
  LayoutGrid,
  Sparkles,
  DoorOpen
} from 'lucide-react';
import { getAllSectionMeta, formatDateForDisplay, updateSectionMeta, normalizeDateInput, clearNextDueDate, isDueToday, getTodayDateString } from './sectionMetaStorage';
import { SectionMetaMap, Frequency, CleaningSection, SectionMeta } from './types';
import { CLEANING_DATA } from './constants';
import { isJpHoliday } from './src/utils/jpHolidays';

// UI用の型定義
type UIFrequency = 'daily' | 'weekly' | 'monthly';

// localStorage key for selected tasks
const SELECTED_TASKS_KEY = 'kireiRoutine_selectedTasks';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [metaMap, setMetaMap] = useState<SectionMetaMap>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  
  // Task completion tracking (deprecated - using selectedTasksByDate instead)
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  
  // Bottom sheet state
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // Selected tasks by date (for localStorage persistence)
  const [selectedTasksByDate, setSelectedTasksByDate] = useState<Record<string, string[]>>({});
  
  // Reschedule State
  const [rescheduleSectionId, setRescheduleSectionId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  
  // Bulk Reschedule State
  const [isBulkRescheduleOpen, setIsBulkRescheduleOpen] = useState(false);
  const [bulkRescheduleDate, setBulkRescheduleDate] = useState('');

  // Bulk Delete State
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Delete State
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);

  // localStorage helper functions
  const loadSelectedTasksFromStorage = (): Record<string, string[]> => {
    try {
      const saved = localStorage.getItem(SELECTED_TASKS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load selected tasks', e);
      return {};
    }
  };

  const saveSelectedTasksToStorage = (data: Record<string, string[]>) => {
    try {
      localStorage.setItem(SELECTED_TASKS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save selected tasks', e);
    }
  };

  useEffect(() => {
    setMetaMap(getAllSectionMeta());
    // Load selected tasks from localStorage
    setSelectedTasksByDate(loadSelectedTasksFromStorage());
  }, []);

  const FREQUENCY_SHORT_LABELS: Record<Frequency, string> = {
    [Frequency.Weekly]: '週1',
    [Frequency.BiWeekly]: '2週1',
    [Frequency.Monthly]: '月1',
    [Frequency.Quarterly]: '3ヶ1',
    [Frequency.SemiAnnual]: '半年',
    [Frequency.Annual]: '年1',
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Helper to get sections due on a specific date string (YYYY-MM-DD)
  const getSectionsForDate = (dateStr: string) => {
    const sections = [];
    for (const category of CLEANING_DATA) {
      for (const section of category.sections) {
        const meta = metaMap[section.id];
        if (meta) {
          // Prioritize nextPlannedAt (manual) if available, otherwise nextDueDate (auto)
          let targetDate = meta.nextDueDate;
          if (meta.nextPlannedAt) {
            targetDate = meta.nextPlannedAt.split('T')[0];
          }
          
          if (targetDate === dateStr) {
            sections.push({ ...section, frequency: category.frequency });
          }
        }
      }
    }
    return sections;
  };

  // Helper to get tasks for selected date with section metadata
  const getTasksForSelectedDate = useMemo(() => {
    const sections = getSectionsForDate(selectedDate);
    const selectedTasks = selectedTasksByDate[selectedDate] || [];
    
    return sections.flatMap(section => {
      return section.tasks.map(task => ({
        ...task,
        sectionId: section.id,
        sectionName: section.areaName,
        frequency: section.frequency,
        imageKey: section.imageKey,
        isSelected: selectedTasks.includes(task.id),
      }));
    });
  }, [selectedDate, metaMap, selectedTasksByDate]);

  // Helper to get sections due within the next 7 days (including today and overdue)
  const getWeeklyTasks = () => {
    const tasks = [];
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const todayStr = getTodayDateString();

    for (const category of CLEANING_DATA) {
      for (const section of category.sections) {
        const meta = metaMap[section.id];
        if (meta) {
          let targetDateStr = meta.nextDueDate;
          if (meta.nextPlannedAt) {
            targetDateStr = meta.nextPlannedAt.split('T')[0];
          }

          if (targetDateStr) {
             // Check if overdue or within next 7 days
             // Simple string comparison works for ISO dates
             // But we want "due soon". Let's say <= nextWeekStr
             const nextWeekStr = nextWeek.toISOString().split('T')[0];
             
             if (targetDateStr <= nextWeekStr) {
                 // Determine completion status for today
                 const isDoneToday = meta.lastDoneDate === todayStr;
                 
                 tasks.push({
                     ...section,
                     frequency: category.frequency,
                     targetDate: targetDateStr,
                     isDoneToday,
                     imageKey: section.imageKey,
                     id: section.id,
                     areaName: section.areaName
                 });
             }
          }
        }
      }
    }
    // Sort by date
    return tasks.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  };

  const weeklyTasks = getWeeklyTasks();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleRescheduleConfirm = () => {
    if (!rescheduleSectionId) return;
    
    const normalized = normalizeDateInput(rescheduleDate);
    if (!normalized) return;

    let isoString: string | undefined;
    try {
      const d = new Date(normalized);
      if (!isNaN(d.getTime())) {
        isoString = d.toISOString();
      }
    } catch (e) {
      console.error('Date conversion error', e);
    }

    updateSectionMeta(rescheduleSectionId, {
      nextDueDate: normalized,
      nextPlannedAt: isoString,
    });

    // Refresh meta map
    setMetaMap(getAllSectionMeta());
    
    // Close modal
    setRescheduleSectionId(null);
    setRescheduleDate('');
  };

  const handleBulkRescheduleConfirm = () => {
    const normalized = normalizeDateInput(bulkRescheduleDate);
    if (!normalized) return;

    const sections = getSectionsForDate(selectedDate);
    if (sections.length === 0) return;

    sections.forEach((section) => {
      let isoString: string | undefined;
      try {
        const d = new Date(normalized);
        if (!isNaN(d.getTime())) {
          isoString = d.toISOString();
        }
      } catch (e) {
        console.error('Date conversion error', e);
      }

      updateSectionMeta(section.id, {
        nextDueDate: normalized,
        nextPlannedAt: isoString,
      });
    });

    // Refresh meta map
    setMetaMap(getAllSectionMeta());
    
    // Close modal
    setIsBulkRescheduleOpen(false);
    setBulkRescheduleDate('');
  };

  const handleBulkDeleteConfirm = () => {
    const sections = getSectionsForDate(selectedDate);
    if (sections.length === 0) return;

    sections.forEach((section) => {
      clearNextDueDate(section.id);
    });

    // Refresh meta map
    setMetaMap(getAllSectionMeta());
    
    // Close modal
    setIsBulkDeleteOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteSectionId) return;
    
    clearNextDueDate(deleteSectionId);
    
    // Refresh meta map
    setMetaMap(getAllSectionMeta());
    
    // Close modal
    setDeleteSectionId(null);
  };

  const handleTaskComplete = (sectionId: string, taskId: string, currentlyDone: boolean) => {
    // Toggle task completion in local state
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !currentlyDone,
    }));

    // If marking as done, update section's lastDoneDate
    if (!currentlyDone) {
      const todayStr = getTodayDateString();
      updateSectionMeta(sectionId, {
        lastDoneDate: todayStr,
      });
      
      // Refresh meta map
      setMetaMap(getAllSectionMeta());
    }
  };

  // Handler for task toggle in bottom sheet
  const handleTaskToggleInBottomSheet = (taskId: string) => {
    const currentTasks = selectedTasksByDate[selectedDate] || [];
    const newTasks = currentTasks.includes(taskId)
      ? currentTasks.filter(id => id !== taskId)
      : [...currentTasks, taskId];
    
    const newData = {
      ...selectedTasksByDate,
      [selectedDate]: newTasks,
    };
    
    setSelectedTasksByDate(newData);
    saveSelectedTasksToStorage(newData);
  };

  // Handler to open bottom sheet when date is clicked
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsBottomSheetOpen(true);
  };


  const calendarCells = useMemo(() => {
    const cells = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ day: null, dateStr: '' });
    }
    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr });
    }
    return cells;
  }, [year, month, daysInMonth, firstDayOfMonth]);

  const getFrequencyStyles = (freq: Frequency) => {
    // Map internal Frequency to UI styles
    // Simplified mapping for UI consistency
    switch (freq) {
      case Frequency.Weekly:
      case Frequency.BiWeekly:
        return "bg-sky-100 text-sky-700 border border-sky-200";
      case Frequency.Monthly:
      case Frequency.Quarterly:
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case Frequency.SemiAnnual:
      case Frequency.Annual:
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };
  
  const getFrequencyLabel = (freq: Frequency) => {
      return FREQUENCY_SHORT_LABELS[freq] || 'その他';
  };

  // Icon mapping helper
  const getIconForSection = (imageKey: string) => {
      // Simple mapping based on key keywords or default
      if (imageKey.includes('bed')) return <BedDouble className="w-5 h-5" />;
      if (imageKey.includes('kitchen')) return <Utensils className="w-5 h-5" />;
      if (imageKey.includes('bath')) return <Bath className="w-5 h-5" />;
      if (imageKey.includes('living')) return <LayoutGrid className="w-5 h-5" />;
      if (imageKey.includes('entrance')) return <DoorOpen className="w-5 h-5" />;
      return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col min-h-[80vh]">
        
        {/* Header */}
        <header className="px-6 py-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/20 backdrop-blur-sm">
          {/* Logo & Title */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                K
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">KireiRoutine</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">あなた専用の掃除ルーティン管理アプリ</p>
              </div>
            </div>
            {/* Mobile User Badge */}
            <div className="md:hidden w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-md flex items-center justify-center text-indigo-600 font-bold">
              KZ
            </div>
          </div>

          {/* Navigation */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 sm:gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-full w-full md:w-auto justify-center md:justify-start">
              <button 
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm transition-all text-sm sm:text-base whitespace-nowrap ${
                  location.pathname === '/' || location.pathname === '/list'
                    ? 'bg-white text-slate-800' 
                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>ホーム</span>
              </button>
              <button 
                onClick={() => navigate('/calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm transition-all text-sm sm:text-base whitespace-nowrap ${
                  location.pathname === '/calendar' 
                    ? 'bg-white text-slate-800' 
                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>カレンダー</span>
              </button>
            </div>
            
            {/* Desktop User Badge */}
            <div className="hidden md:flex w-11 h-11 rounded-full bg-indigo-100 border-2 border-white shadow-md items-center justify-center text-indigo-600 font-bold flex-shrink-0">
              KZ
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6">
          
          {/* Left Column: Weekly Tasks */}
          <section className="bg-white/90 backdrop-blur rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col gap-6 order-1 md:order-none">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  今週の掃除タスク
                </h2>
                <p className="text-sm text-slate-500 mt-1">今日〜1週間以内に予定されているタスク</p>
              </div>
              <div className="h-8 px-3 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm border border-slate-200">
                {weeklyTasks.filter(t => !t.isDoneToday).length} Tasks
              </div>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {weeklyTasks.length > 0 ? weeklyTasks.map(task => (
                <div 
                  key={task.id}
                  className={`group flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 transition-all duration-200 ${
                    task.isDoneToday 
                      ? 'bg-slate-50 border-slate-100 opacity-60' 
                      : 'bg-slate-50/70 border-slate-100 hover:border-emerald-200 hover:shadow-sm hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-xl ${task.isDoneToday ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-600 shadow-sm'}`}>
                      {getIconForSection(task.imageKey)}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-medium truncate ${task.isDoneToday ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.areaName}
                      </h3>
                      <div className="flex mt-1 items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${getFrequencyStyles(task.frequency)}`}>
                          {getFrequencyLabel(task.frequency)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            {formatDateForDisplay(task.targetDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/section/${task.id}`}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.isDoneToday
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 text-slate-300 hover:border-emerald-400 hover:text-emerald-400'
                    }`}
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </Link>
                </div>
              )) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                      直近の予定はありません
                  </div>
              )}
            </div>
          </section>

          {/* Right Column: Calendar */}
          <section className="bg-white/90 backdrop-blur rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col gap-6 order-2 md:order-none">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">掃除カレンダー</h2>
                <p className="text-sm text-slate-500 mt-1">{year}年 {month + 1}月</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                >
                  Today
                </button>
                <div className="flex gap-1">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {/* Weekdays */}
              <div className="grid grid-cols-7 mb-2">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                  <div key={day} className={`text-center text-xs font-bold ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((cell, index) => {
                    if (!cell.day) {
                        return <div key={index} className="aspect-square" />;
                    }

                    const sections = getSectionsForDate(cell.dateStr);
                    const isToday = cell.dateStr === getTodayDateString();
                    const hasTask = sections.length > 0;
                    const hasSelectedTasks = (selectedTasksByDate[cell.dateStr] || []).length > 0;
                    const isSelected = cell.dateStr === selectedDate;

                    let cellClass = "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer hover:scale-105 relative";
                    
                    if (isToday) {
                        cellClass += " bg-emerald-500 text-white shadow-md shadow-emerald-300 font-bold";
                    } else if (hasSelectedTasks) {
                        cellClass += " bg-emerald-300 text-emerald-900 border border-emerald-400 font-semibold";
                    } else if (hasTask) {
                        cellClass += " bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium";
                    } else {
                        cellClass += " bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100";
                    }

                    if (isSelected && !isToday) {
                        cellClass += " ring-2 ring-emerald-400 ring-offset-2";
                    } else if (isSelected && isToday) {
                        cellClass += " ring-2 ring-white ring-offset-2 ring-offset-emerald-500";
                    }

                    return (
                        <div 
                            key={index} 
                            className={cellClass}
                            onClick={() => handleDateClick(cell.dateStr)}
                        >
                            <span>{cell.day}</span>
                        </div>
                    );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span>今日</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-300 border border-emerald-400"></div>
                  <span>タスク選択済み</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-200"></div>
                  <span>掃除タスクあり</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-50 border border-slate-200"></div>
                  <span>なし</span>
                </div>
              </div>
            </div>

            {/* Daily Menu (Selected Date) */}
            <div className="mt-6 border-t border-slate-100 pt-4">
                 <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-700">
                        {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}の予定
                    </h3>
                    {getSectionsForDate(selectedDate).length > 0 && (
                        <div className="flex gap-2">
                             <button
                                onClick={() => setIsBulkRescheduleOpen(true)}
                                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-full transition-colors"
                            >
                                まとめて移動
                            </button>
                             <button
                                onClick={() => setIsBulkDeleteOpen(true)}
                                className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-full transition-colors"
                            >
                                まとめて削除
                            </button>
                        </div>
                    )}
                 </div>

                 {getTasksForSelectedDate.length > 0 ? (
                     <div className="space-y-3">
                         {getTasksForSelectedDate.map(task => (
                             <div 
                               key={task.id} 
                               className={`flex items-start gap-3 bg-slate-50 p-3 rounded-xl transition-all ${
                                 task.isDone ? 'opacity-60' : ''
                               }`}
                             >
                                 <button
                                   onClick={() => handleTaskComplete(task.sectionId, task.id, task.isDone)}
                                   className="flex-shrink-0 mt-0.5"
                                 >
                                   {task.isDone ? (
                                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                   ) : (
                                     <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-400" />
                                   )}
                                 </button>
                                 
                                 <div className="flex-1 min-w-0">
                                   <div className="flex items-start justify-between gap-2">
                                     <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                         <div className="bg-white p-1 rounded text-slate-500 shadow-sm">
                                           {getIconForSection(task.imageKey)}
                                         </div>
                                         <span className="text-[11px] font-medium text-slate-500">
                                           {task.sectionName}
                                         </span>
                                       </div>
                                       <p className={`text-sm text-slate-700 leading-relaxed ${
                                         task.isDone ? 'line-through text-slate-400' : ''
                                       }`}>
                                         {task.text}
                                       </p>
                                     </div>
                                   </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <p className="text-xs text-slate-400 text-center py-2">予定はありません</p>
                 )}
            </div>
          </section>

        </main>
      </div>

      {/* Bottom Sheet Modal for Task Selection */}
      {isBottomSheetOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsBottomSheetOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {new Date(selectedDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}の掃除タスク
              </h3>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-5">
              {getTasksForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {getTasksForSelectedDate.map(task => (
                    <label
                      key={task.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        task.isSelected
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.isSelected}
                        onChange={() => handleTaskToggleInBottomSheet(task.id)}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-white p-1.5 rounded-lg text-slate-500 shadow-sm border border-slate-100">
                            {getIconForSection(task.imageKey)}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {task.sectionName}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getFrequencyStyles(task.frequency)}`}>
                            {getFrequencyLabel(task.frequency)}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          task.isSelected ? 'text-slate-700' : 'text-slate-600'
                        }`}>
                          {task.text}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm">この日に予定されているタスクはありません</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {getTasksForSelectedDate.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    選択中: <span className="font-bold text-emerald-600">
                      {(selectedTasksByDate[selectedDate] || []).length} / {getTasksForSelectedDate.length}
                    </span>
                  </span>
                  <button
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                  >
                    完了
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals (Reschedule, Delete, etc.) */}
      {/* Per-Section Reschedule Modal */}
      {rescheduleSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                別の日に移動
              </h3>
              <button
                onClick={() => setRescheduleSectionId(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-slate-500">
              このセクションの次回予定日を、別の日付に変更します。
            </p>
            
            <div className="mb-8">
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                移動先の日付
              </label>
              <input
                type="date"
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-amber-500 focus:ring-amber-500"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setRescheduleSectionId(null)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleRescheduleConfirm}
                disabled={!rescheduleDate}
                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                この日に移動する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reschedule Modal */}
      {isBulkRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                まとめて移動
              </h3>
              <button
                onClick={() => setIsBulkRescheduleOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-slate-500">
              {new Date(selectedDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}に予定されているすべてのセクションの次回予定日を、下で選んだ日付にまとめて移動します。
            </p>
            
            <div className="mb-8">
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                移動先の日付
              </label>
              <input
                type="date"
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-amber-500 focus:ring-amber-500"
                value={bulkRescheduleDate}
                onChange={(e) => setBulkRescheduleDate(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setIsBulkRescheduleOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkRescheduleConfirm}
                disabled={!bulkRescheduleDate}
                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                この日に移動する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                予定を削除
              </h3>
              <button
                onClick={() => setDeleteSectionId(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-slate-500">
              この日の『{CLEANING_DATA.flatMap(c => c.sections).find(s => s.id === deleteSectionId)?.areaName}』の次回予定日を削除します。よろしいですか？
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteSectionId(null)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-full bg-red-500 px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-600"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                まとめて削除
              </h3>
              <button
                onClick={() => setIsBulkDeleteOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-slate-500">
              この日に予定されているすべての掃除セクションの次回予定日を削除します。よろしいですか？
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setIsBulkDeleteOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="rounded-full bg-red-500 px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-600"
              >
                すべて削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SwipeableSectionItemProps {
  section: CleaningSection;
  meta: SectionMeta;
  isDoneToday: boolean;
  selectedDate: string;
  onReschedule: (id: string) => void;
  onDelete: (id: string) => void;
}

const SwipeableSectionItem: React.FC<SwipeableSectionItemProps> = ({
  section,
  meta,
  isDoneToday,
  selectedDate,
  onReschedule,
  onDelete,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const startX = React.useRef(0);
  const currentX = React.useRef(0);
  const isDragging = React.useRef(false);
  const DELETE_BTN_WIDTH = 80;

  // Re-implementing touch logic with startOffset
  const startOffset = React.useRef(0);
  
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startOffset.current = offsetX;
    isDragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentTouchX = e.touches[0].clientX;
    const diff = currentTouchX - startX.current;
    
    // Calculate new offset
    let newOffset = startOffset.current + diff;
    
    // Constrain: max 0 (closed), min -DELETE_BTN_WIDTH (fully open)
    newOffset = Math.max(-DELETE_BTN_WIDTH, Math.min(0, newOffset));
    
    setOffsetX(newOffset);
    currentX.current = newOffset;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    // Snap logic
    if (offsetX < -DELETE_BTN_WIDTH / 2) {
      setOffsetX(-DELETE_BTN_WIDTH);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-red-500 sm:bg-transparent">
      {/* Background Delete Button (Mobile) */}
      <div className="absolute inset-y-0 right-0 flex w-[80px] items-center justify-center text-white sm:hidden">
        <button
          onClick={() => onDelete(section.id)}
          className="flex h-full w-full flex-col items-center justify-center gap-1 font-bold text-xs"
        >
          <Trash2 className="h-5 w-5" />
          <span>削除</span>
        </button>
      </div>

      {/* Foreground Content */}
      <div
        className="relative flex flex-col gap-2 bg-white p-3 shadow-sm ring-1 ring-slate-100 transition-transform duration-200 ease-out sm:flex-row sm:items-center sm:justify-between sm:p-4 sm:transform-none"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-bold text-slate-900">{section.areaName}</div>
            {isDoneToday && (
              <span className="text-[14px] sm:text-xs font-bold text-emerald-600">
                ✓ 完了済み
              </span>
            )}
            {meta?.nextPlannedAt && meta.nextPlannedAt.split('T')[0] === selectedDate && (
              <div className="text-[14px] sm:text-xs text-slate-500 mt-0.5">
                目安: {formatDateForDisplay(meta.nextPlannedAt)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReschedule(section.id)}
            className="text-[15px] sm:text-sm text-slate-400 underline hover:text-slate-600"
          >
            別の日に移動
          </button>
          <Link
            to={`/section/${section.id}`}
            className="rounded-full bg-orange-50 px-3 py-1.5 text-[15px] sm:text-sm font-bold text-orange-600 transition hover:bg-orange-100"
          >
            詳細へ
          </Link>
          
          {/* Desktop Delete Button */}
          <button
            onClick={() => onDelete(section.id)}
            className="hidden rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 sm:block"
            title="予定を削除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const getFrequencyColor = (freq: Frequency): string => {
  switch (freq) {
    case Frequency.Weekly: return '#f97316'; // orange-500
    case Frequency.BiWeekly: return '#eab308'; // yellow-500
    case Frequency.Monthly: return '#84cc16'; // lime-500
    case Frequency.Quarterly: return '#10b981'; // emerald-500
    case Frequency.SemiAnnual: return '#06b6d4'; // cyan-500
    case Frequency.Annual: return '#6366f1'; // indigo-500
    default: return '#94a3b8'; // slate-400
  }
};

export default CalendarPage;
