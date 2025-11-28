import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Calendar, Trash2 } from 'lucide-react';
import { getAllSectionMeta, formatDateForDisplay, updateSectionMeta, normalizeDateInput, getSectionMeta, clearNextDueDate } from './sectionMetaStorage';
import { SectionMetaMap, Frequency, CleaningSection, SectionMeta } from './types';
import { CLEANING_DATA } from './constants';
import { isJpHoliday } from './src/utils/jpHolidays';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [metaMap, setMetaMap] = useState<SectionMetaMap>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
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

  useEffect(() => {
    setMetaMap(getAllSectionMeta());
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
    
    console.log('[CalendarPage] Rescheduled section', {
      sectionId: rescheduleSectionId,
      toDate: normalized,
    });
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
    
    console.log('[CalendarPage] Bulk rescheduled sections', {
      fromDate: selectedDate,
      toDate: normalized,
      count: sections.length,
    });
    console.log('[CalendarPage] Bulk rescheduled sections', {
      fromDate: selectedDate,
      toDate: normalized,
      count: sections.length,
    });
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
    
    console.log('[CalendarPage] Bulk deleted sections', {
      date: selectedDate,
      count: sections.length,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteSectionId) return;
    
    clearNextDueDate(deleteSectionId);
    
    // Refresh meta map
    setMetaMap(getAllSectionMeta());
    
    // Close modal
    setDeleteSectionId(null);
    
    console.log('[CalendarPage] Deleted schedule for section', deleteSectionId);
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

  return (
    <main className="min-h-screen bg-[#f7f1e7] px-4 py-5 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-orange-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-medium text-amber-700 underline underline-offset-2"
            >
              ← ホームに戻る
            </button>
            <h1 className="text-xl font-bold">掃除カレンダー</h1>
          </div>
        </header>

        {/* Month Navigation */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <button onClick={handlePrevMonth} className="rounded-full p-2 hover:bg-slate-100">
            ◀
          </button>
          <h2 className="text-lg font-bold">
            {year}年 {month + 1}月
          </h2>
          <button onClick={handleNextMonth} className="rounded-full p-2 hover:bg-slate-100">
            ▶
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
            <div key={i} className="text-center text-sm sm:text-xs font-bold text-slate-500 py-2">
              {day}
            </div>
          ))}
          
          {calendarCells.map((cell, index) => {
            if (!cell.day) {
              return <div key={index} className="min-h-[80px] rounded-xl bg-transparent" />;
            }
            
            const sections = getSectionsForDate(cell.dateStr);
            const dateObj = new Date(cell.dateStr);
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
            const isSelected = cell.dateStr === selectedDate;
            
            const isSunday = dateObj.getDay() === 0;
            const isSaturday = dateObj.getDay() === 6;
            const isHoliday = isJpHoliday(dateObj);
            
            let dateColorClass = 'text-slate-700';
            let borderColorClass = 'border-transparent';
            
            if (isSunday || isHoliday) {
              dateColorClass = 'text-orange-500';
              if (!isToday && !isSelected) borderColorClass = 'border-orange-100'; // Optional subtle border
            } else if (isSaturday) {
              dateColorClass = 'text-sky-500';
              if (!isToday && !isSelected) borderColorClass = 'border-sky-100';
            }

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`flex min-h-[70px] cursor-pointer flex-col gap-1 rounded-xl p-1 shadow-sm transition-all hover:shadow-md sm:min-h-[80px] sm:p-2 border ${borderColorClass} ${
                  isSelected
                    ? 'ring-2 ring-orange-400 ring-offset-1 bg-white z-10'
                    : isToday
                    ? 'bg-amber-50 border-2 border-amber-200'
                    : 'bg-white'
                }`}
              >
                <div className={`text-xs font-bold ${isToday ? 'text-orange-600' : dateColorClass}`}>
                  {cell.day}
                </div>
                <div className="flex flex-wrap content-start gap-1 overflow-hidden">
                  {/* Show unique frequencies only to save space */}
                  {Array.from(new Set(sections.map(s => s.frequency))).map((freq) => (
                    <span
                      key={freq}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(cell.dateStr);
                      }}
                      className="inline-block cursor-pointer rounded px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm hover:opacity-80"
                      style={{
                        backgroundColor: getFrequencyColor(freq),
                      }}
                    >
                      {FREQUENCY_SHORT_LABELS[freq]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center text-[14px] sm:text-xs text-slate-500 mt-2">
          ※ 次回予定日（nextDueDate）に基づいて表示しています。
        </div>

        {/* Daily Menu Panel */}
        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 mb-8">
          <div className="mb-4 flex flex-col gap-2 border-b border-slate-100 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              {new Date(selectedDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}の掃除メニュー
            </h3>
            {getSectionsForDate(selectedDate).length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  onClick={() => setIsBulkRescheduleOpen(true)}
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[15px] sm:text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Calendar className="h-3 w-3" />
                  <span className="hidden sm:inline">この日のメニューをまとめて別日に移動</span>
                  <span className="sm:hidden">まとめて移動</span>
                </button>
                <button
                  onClick={() => setIsBulkDeleteOpen(true)}
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-[15px] sm:text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="hidden sm:inline">この日のメニューをすべて削除</span>
                  <span className="sm:hidden">すべて削除</span>
                </button>
              </div>
            )}
          </div>
          
          {getSectionsForDate(selectedDate).length > 0 ? (
            <div className="flex flex-col gap-6">
              {/* Group by frequency */}
              {Object.values(Frequency).map((freq) => {
                const sectionsInFreq = getSectionsForDate(selectedDate).filter(s => s.frequency === freq);
                if (sectionsInFreq.length === 0) return null;

                return (
                  <div key={freq} className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <span
                        className="rounded px-2 py-0.5 text-xs text-white"
                        style={{ backgroundColor: getFrequencyColor(freq) }}
                      >
                        {FREQUENCY_SHORT_LABELS[freq]}
                      </span>
                    </h4>
                    <div className="flex flex-col gap-3">
                      {sectionsInFreq.map((section) => {
                        const meta = metaMap[section.id];
                        const isDoneToday = meta?.lastDoneDate === selectedDate;
                        
                        return (
                          <SwipeableSectionItem
                            key={section.id}
                            section={section}
                            meta={meta}
                            isDoneToday={isDoneToday}
                            selectedDate={selectedDate}
                            onReschedule={(id) => {
                              setRescheduleSectionId(id);
                              setRescheduleDate('');
                            }}
                            onDelete={(id) => setDeleteSectionId(id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-slate-500">
              この日に予定されている掃除はありません。
            </p>
          )}
        </section>
      </div>

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
    </main>
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

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].clientX;
    const diff = x - startX.current;
    
    // Only allow swiping left (negative diff)
    // Limit to -DELETE_BTN_WIDTH
    // Also allow swiping back to right if already open (handled by startX logic implicitly if we reset)
    // Actually, if we are already open (offsetX < 0), we need to account for that.
    // But for simplicity, let's assume we start from closed or open state.
    // A simple way: just use diff.
    
    // If we want to support "closing" by swiping right, we need to know initial offset.
    // Let's keep it simple: always start drag from current visual state.
    
    // Better logic:
    // We need to know the offset at the start of the drag.
    // But `offsetX` is state.
    // Let's just use the state `offsetX` as the base.
    
    // Wait, `startX` is just touch position.
    // We need `startOffset` ref.
  };
  
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
    // Add some resistance/overshoot if needed, but let's hard clamp for now
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
