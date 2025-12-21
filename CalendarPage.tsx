import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CLEANING_DATA, FREQUENCY_SUMMARY_META } from "./constants";
import { Frequency } from "./types";
import { Trash2 } from "lucide-react";
import {
  CalendarMap,
  clearDateTasks,
  loadCalendarMap,
  updateCalendarMap,
} from "./calendarStorage";

type RepeatType =
  | "once"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "yearly";

type OnceFilter =
  | "all"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "yearly";

type CalendarTask = {
  id: string;
  label: string;
  sectionLabel?: string;
  frequency: Frequency;
  repeatType: RepeatType;
};

const frequencyToRepeatType: Record<Frequency, RepeatType> = {
  [Frequency.Weekly]: "weekly",
  [Frequency.BiWeekly]: "biweekly",
  [Frequency.Monthly]: "monthly",
  [Frequency.Quarterly]: "quarterly",
  [Frequency.SemiAnnual]: "semiannual",
  [Frequency.Annual]: "yearly",
};

const CALENDAR_TASKS: CalendarTask[] = CLEANING_DATA.flatMap((category) =>
  category.sections.flatMap((section) =>
    section.tasks.map((task) => ({
      id: task.id,
      label: task.text,
      sectionLabel: section.areaName,
      frequency: category.frequency,
      repeatType: frequencyToRepeatType[category.frequency],
    }))
  )
);

const TASK_MAP: Record<string, CalendarTask> = CALENDAR_TASKS.reduce(
  (acc, task) => {
    acc[task.id] = task;
    return acc;
  },
  {} as Record<string, CalendarTask>
);

const REPEAT_TABS: { value: RepeatType; label: string }[] = [
  { value: "once", label: "今日だけ" },
  { value: "weekly", label: "毎週" },
  { value: "biweekly", label: "2週に1回" },
  { value: "monthly", label: "月1" },
  { value: "quarterly", label: "3ヶ月に1回" },
  { value: "semiannual", label: "半年に1回" },
  { value: "yearly", label: "年1" },
];

// 頻度ごとの色マッピング
const FREQUENCY_COLORS: Record<Frequency, { bg: string; border: string; text: string; icon: string; dot: string }> = {
  [Frequency.Weekly]: {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-900',
    icon: 'text-orange-500',
    dot: 'bg-orange-400',
  },
  [Frequency.BiWeekly]: {
    bg: 'bg-sky-100',
    border: 'border-sky-200',
    text: 'text-sky-900',
    icon: 'text-sky-500',
    dot: 'bg-sky-400',
  },
  [Frequency.Monthly]: {
    bg: 'bg-violet-100',
    border: 'border-violet-200',
    text: 'text-violet-900',
    icon: 'text-violet-500',
    dot: 'bg-violet-400',
  },
  [Frequency.Quarterly]: {
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-900',
    icon: 'text-pink-500',
    dot: 'bg-pink-400',
  },
  [Frequency.SemiAnnual]: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  [Frequency.Annual]: {
    bg: 'bg-rose-100',
    border: 'border-rose-200',
    text: 'text-rose-900',
    icon: 'text-rose-500',
    dot: 'bg-rose-400',
  },
};

const today = new Date();
const todayKey = formatDateKey(today);

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function frequencyToLabel(freq: Frequency): string {
  return FREQUENCY_SUMMARY_META[freq]?.label ?? freq;
}

function formatDisplayDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${yyyy}年${mm}月${dd}日（${weekday}）`;
}

type DayCell = {
  date: Date | null;
  key: string | null;
  isCurrentMonth: boolean;
};

function buildMonthCells(year: number, month: number): DayCell[] {
  // month: 0-11
  const first = new Date(year, month, 1);
  const firstDay = first.getDay(); // 0=Sun
  const lastDay = new Date(year, month + 1, 0).getDate();

  const cells: DayCell[] = [];

  // leading blanks
  for (let i = 0; i < firstDay; i++) {
    cells.push({ date: null, key: null, isCurrentMonth: false });
  }

  // days in month
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    cells.push({
      date,
      key: formatDateKey(date),
      isCurrentMonth: true,
    });
  }

  // trailing blanks to fill 6 rows * 7 cols = 42
  while (cells.length < 42) {
    cells.push({ date: null, key: null, isCurrentMonth: false });
  }

  return cells;
}

function addMonthsPreserveDay(date: Date, months: number, baseDay: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(baseDay, lastDay));
  return d;
}

function applyTasksWithRepeat(
  baseDate: Date,
  mode: RepeatType,
  taskIds: string[],
  prev: CalendarMap
): CalendarMap {
  return updateCalendarMap(prev, (draft) => {
    const limit = new Date(baseDate);
    limit.setFullYear(limit.getFullYear() + 1);

    const addForDate = (d: Date, options?: { mergeExisting?: boolean }) => {
      const key = formatDateKey(d);
      const shouldMerge = options?.mergeExisting !== false;
      const existing = shouldMerge ? draft[key] ?? [] : [];
      const merged = Array.from(new Set([...existing, ...taskIds]));
      draft[key] = merged;
    };

    if (mode === "once") {
      addForDate(baseDate, { mergeExisting: false });
      return;
    }

    const dayStep =
      mode === "weekly" ? 7 : mode === "biweekly" ? 14 : null;

    const monthStep =
      mode === "monthly"
        ? 1
        : mode === "quarterly"
        ? 3
        : mode === "semiannual"
        ? 6
        : mode === "yearly"
        ? 12
        : null;

    // まず選択日を反映
    addForDate(baseDate, { mergeExisting: false });

    if (dayStep) {
      for (
        let d = new Date(baseDate.getTime());
        d <= limit;
        d.setDate(d.getDate() + dayStep)
      ) {
        if (d.getTime() === baseDate.getTime()) continue;
        addForDate(new Date(d));
      }
      return;
    }

    if (monthStep) {
      let cursor = new Date(baseDate.getTime());
      const baseDay = baseDate.getDate();
      while (true) {
        cursor = addMonthsPreserveDay(cursor, monthStep, baseDay);
        if (cursor > limit) break;
        addForDate(new Date(cursor));
      }
    }
  });
}

const CalendarPage: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [calendarMap, setCalendarMap] = useState<CalendarMap>(() =>
    loadCalendarMap()
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>("once");
  const [onceFilter, setOnceFilter] = useState<OnceFilter>("all");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // View Mode for Left Column
  const [viewMode, setViewMode] = useState<"summary" | "agenda">("summary");
  
  // モバイルでの左ペイン（タスクサマリー）- 常に展開状態
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(true);
  
  // Bulk Assign Mode
  const [isBulkAssignMode, setIsBulkAssignMode] = useState(false);
  const [bulkFrequencyId, setBulkFrequencyId] = useState<Frequency | null>(null);
  const [bulkSelectedDates, setBulkSelectedDates] = useState<Set<string>>(new Set());

  // モーダル表示中はbodyスクロールを防止し、タブバーを隠す（iOS Safari対策・統合版）
  useEffect(() => {
    if (isEditorOpen) {
      // 現在のスクロール位置を保存してbodyを固定
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.dataset.scrollY = String(scrollY);
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'contain';
      
      // タブバーを隠す
      const tabBar = document.querySelector('nav.fixed.bottom-0');
      if (tabBar) {
        (tabBar as HTMLElement).style.display = 'none';
      }
    } else {
      // スクロール位置を復元
      const scrollY = Number(document.body.dataset.scrollY || 0);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      window.scrollTo(0, scrollY);
      
      // タブバーを表示
      const tabBar = document.querySelector('nav.fixed.bottom-0');
      if (tabBar) {
        (tabBar as HTMLElement).style.display = '';
      }
    }
    
    return () => {
      // cleanup: 必ず元に戻す
      const scrollY = Number(document.body.dataset.scrollY || 0);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      window.scrollTo(0, scrollY);
      
      const tabBar = document.querySelector('nav.fixed.bottom-0');
      if (tabBar) {
        (tabBar as HTMLElement).style.display = '';
      }
    };
  }, [isEditorOpen]);

  // 月のセル
  const cells = useMemo(
    () => buildMonthCells(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const headerText = `${currentYear}年${currentMonth + 1}月`;

  const selectedKey = selectedDate ? formatDateKey(selectedDate) : todayKey;
  const tasksForSelectedDay = calendarMap[selectedKey] ?? [];

  const filteredTasks = useMemo(() => {
    if (repeatType !== "once") {
      return CALENDAR_TASKS.filter((task) => task.repeatType === repeatType);
    }
    if (onceFilter === "all") return CALENDAR_TASKS;
    return CALENDAR_TASKS.filter((task) => task.repeatType === onceFilter);
  }, [repeatType, onceFilter]);

  const filteredTaskIds = useMemo(
    () => filteredTasks.map((task) => task.id),
    [filteredTasks]
  );

  const allFilteredSelected =
    filteredTaskIds.length > 0 &&
    filteredTaskIds.every((id) => selectedTaskIds.includes(id));

  const selectedTasksDetail = tasksForSelectedDay
    .map(
      (id) =>
        TASK_MAP[id] ?? ({
          id,
          label: id,
          repeatType: "once",
          frequency: Frequency.Weekly,
        } as CalendarTask)
    )
    .filter(Boolean);

  const upcomingDays = useMemo(() => {
    const result: {
      date: Date;
      key: string;
      tasks: CalendarTask[];
      offset: number;
    }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = formatDateKey(d);
      const ids = calendarMap[key] ?? [];
      const tasks = ids
        .map((id) => TASK_MAP[id])
        .filter((task): task is CalendarTask => !!task && task.id !== undefined);
      // Include all 7 days, even if they have no tasks
      result.push({ date: d, key, tasks, offset: i });
    }
    return result;
  }, [calendarMap]);

  const weeklyTotalCount = useMemo(() => {
    return upcomingDays.reduce((acc, day) => acc + day.tasks.length, 0);
  }, [upcomingDays]);

  // 月送り
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleSelectDay = (date: Date | null) => {
    if (!date) return;
    const key = formatDateKey(date);
    
    // If in bulk assign mode, toggle date selection
    if (isBulkAssignMode) {
      setBulkSelectedDates(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
      return;
    }
    
    // Always set selected date (for PC agenda panel)
    setSelectedDate(date);
    setSelectedTaskIds(calendarMap[key] ?? []);
    
    // Mobile: open modal immediately
    // PC: just update selection (agenda shown inline)
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (isMobile) {
      setRepeatType("once");
      setOnceFilter("all");
      setIsEditorOpen(true);
      setIsRescheduleMode(false);
      setRescheduleTargetDate("");
    }
  };
  
  // PC用：編集モーダルを開く
  const handleOpenEditor = () => {
    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    setSelectedTaskIds(calendarMap[key] ?? []);
    setRepeatType("once");
    setOnceFilter("all");
    setIsEditorOpen(true);
    setIsRescheduleMode(false);
    setRescheduleTargetDate("");
  };

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleToggleVisibleTasks = () => {
    setSelectedTaskIds((prev) => {
      if (filteredTaskIds.length === 0) return prev;
      const hasAll = filteredTaskIds.every((id) => prev.includes(id));
      if (hasAll) {
        return prev.filter((id) => !filteredTaskIds.includes(id));
      }
      return Array.from(new Set([...prev, ...filteredTaskIds]));
    });
  };

  const handleSaveTasks = () => {
    if (!selectedDate) return;
    const tasksToPersist =
      repeatType === "once"
        ? selectedTaskIds
        : selectedTaskIds.filter((id) => filteredTaskIds.includes(id));

    const key = formatDateKey(selectedDate);
    const newMap = applyTasksWithRepeat(selectedDate, repeatType, tasksToPersist, calendarMap);
    setCalendarMap(newMap);
    // Update selectedTaskIds to reflect saved tasks
    setSelectedTaskIds(newMap[key] ?? []);
    setIsEditorOpen(false);
  };

  const handleClearDay = () => {
    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    const newMap = clearDateTasks(calendarMap, key);
    setCalendarMap(newMap);
    // Update selectedTaskIds to reflect cleared day
    setSelectedTaskIds(newMap[key] ?? []);
    setIsEditorOpen(false);
  };

  // Rescheduling Logic
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  const [rescheduleTargetDate, setRescheduleTargetDate] = useState("");

  const handleMoveTasks = () => {
    if (!selectedDate || !rescheduleTargetDate || selectedTaskIds.length === 0) return;

    const sourceKey = formatDateKey(selectedDate);
    const targetDateObj = new Date(rescheduleTargetDate);
    const targetKey = formatDateKey(targetDateObj);

    if (sourceKey === targetKey) {
      setIsRescheduleMode(false);
      return;
    }

    setCalendarMap((prev) =>
      updateCalendarMap(prev, (draft) => {
        // Remove from source
        const sourceTasks = draft[sourceKey] ?? [];
        draft[sourceKey] = sourceTasks.filter(
          (id) => !selectedTaskIds.includes(id)
        );
        if (draft[sourceKey].length === 0) delete draft[sourceKey];

        // Add to target (dedup)
        const targetTasks = draft[targetKey] ?? [];
        draft[targetKey] = Array.from(
          new Set([...targetTasks, ...selectedTaskIds])
        );
      })
    );

    setIsEditorOpen(false);
    setIsRescheduleMode(false);
    setRescheduleTargetDate("");
  };

  // 今日にジャンプ
  const handleJumpToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today);
  };



  // Individual Rescheduling Logic
  const [reschedulingTaskId, setReschedulingTaskId] = useState<string | null>(null);
  const [individualTargetDate, setIndividualTargetDate] = useState("");

  const startIndividualReschedule = (taskId: string) => {
    setReschedulingTaskId(taskId);
    setIndividualTargetDate(formatDateKey(selectedDate!));
  };

  const cancelIndividualReschedule = () => {
    setReschedulingTaskId(null);
    setIndividualTargetDate("");
  };

  const confirmIndividualReschedule = (taskId: string) => {
    if (!selectedDate || !individualTargetDate) return;
    
    const sourceKey = formatDateKey(selectedDate);
    const targetDateObj = new Date(individualTargetDate);
    const targetKey = formatDateKey(targetDateObj);

    if (sourceKey === targetKey) {
      cancelIndividualReschedule();
      return;
    }

    setCalendarMap((prev) =>
      updateCalendarMap(prev, (draft) => {
        // Remove from source
        const sourceTasks = draft[sourceKey] ?? [];
        draft[sourceKey] = sourceTasks.filter((id) => id !== taskId);
        if (draft[sourceKey].length === 0) delete draft[sourceKey];

        // Add to target
        const targetTasks = draft[targetKey] ?? [];
        if (!targetTasks.includes(taskId)) {
          draft[targetKey] = [...targetTasks, taskId];
        }
      })
    );

    // Also update selectedTaskIds if it was selected
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
    }

    cancelIndividualReschedule();
  };

  const handleQuickMove = (taskId: string, days: number) => {
    if (!selectedDate) return;
    const sourceKey = formatDateKey(selectedDate);
    
    // Calculate target date
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const targetKey = formatDateKey(d);

    setCalendarMap((prev) =>
      updateCalendarMap(prev, (draft) => {
        const sourceTasks = draft[sourceKey] ?? [];
        draft[sourceKey] = sourceTasks.filter((id) => id !== taskId);
        if (draft[sourceKey].length === 0) delete draft[sourceKey];

        const targetTasks = draft[targetKey] ?? [];
        if (!targetTasks.includes(taskId)) {
          draft[targetKey] = [...targetTasks, taskId];
        }
      })
    );
  };

  // Bulk Assign Mode Functions
  const handleStartBulkAssign = (freq: Frequency) => {
    setIsBulkAssignMode(true);
    setBulkFrequencyId(freq);
    setBulkSelectedDates(new Set());
  };

  const handleCancelBulkAssign = () => {
    setIsBulkAssignMode(false);
    setBulkFrequencyId(null);
    setBulkSelectedDates(new Set());
  };

  const handleBulkAssign = () => {
    if (!bulkFrequencyId || bulkSelectedDates.size === 0) return;
    
    // Get all task IDs for this frequency
    const tasksForFrequency = CALENDAR_TASKS.filter(
      task => task.frequency === bulkFrequencyId
    ).map(task => task.id);
    
    setCalendarMap(prev =>
      updateCalendarMap(prev, (draft) => {
        bulkSelectedDates.forEach(dateKey => {
          const existing = draft[dateKey] ?? [];
          draft[dateKey] = Array.from(
            new Set([...existing, ...tasksForFrequency])
          );
        });
      })
    );
    
    // Reset bulk mode
    handleCancelBulkAssign();
  };

  // Frequency Summary Logic
  const frequencySummary = useMemo(() => {
    const summary: {
      frequency: Frequency;
      label: string;
      nextDate: Date | null;
      count: number;
    }[] = [];

    const frequencyOrder = [
      Frequency.Weekly,
      Frequency.BiWeekly,
      Frequency.Monthly,
      Frequency.Quarterly,
      Frequency.SemiAnnual,
      Frequency.Annual,
    ];

    frequencyOrder.forEach((freq) => {
      let nextDate: Date | null = null;
      let count = 0;

      // 1. Check upcomingDays first (next 7 days)
      const upcoming = upcomingDays.find(day => 
        day.tasks.some(t => t.frequency === freq)
      );

      if (upcoming) {
        nextDate = upcoming.date;
        count = upcoming.tasks.filter(t => t.frequency === freq).length;
      }

      // 2. If not found in upcomingDays, scan future keys in calendarMap
      if (!nextDate) {
         const sortedKeys = Object.keys(calendarMap).sort();
         const futureKeys = sortedKeys.filter(k => k >= todayKey);
         
         for (const key of futureKeys) {
           const taskIds = calendarMap[key] ?? [];
           const tasksInDay = taskIds.map(id => TASK_MAP[id]).filter((task): task is CalendarTask => !!task && task.id !== undefined);
           const hasFreq = tasksInDay.some(t => t.frequency === freq);
           if (hasFreq) {
             nextDate = new Date(key);
             count = tasksInDay.filter(t => t.frequency === freq).length;
             break;
           }
         }
      }

      // Always add the frequency item, even if no next date (user might want to see it)
      // But per requirement "next date" is key. If no tasks, maybe skip?
      // The requirement says "Frequency Summary Card... Next Date... Count".
      // Let's include it even if count is 0, or maybe just if defined in META.
      if (FREQUENCY_SUMMARY_META[freq]) {
        summary.push({
          frequency: freq,
          label: FREQUENCY_SUMMARY_META[freq].label,
          nextDate,
          count,
        });
      }
    });

    return summary;
  }, [calendarMap, upcomingDays]);



  const handleFrequencyClick = (freq: Frequency) => {
    navigate("/", { state: { initialFrequency: freq } });
  };



  return (
    <main className="min-h-screen bg-[#f7f1e7] py-6 px-4 sm:px-6 page-content">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* ヘッダー */}
        <header className="text-center py-4">
          <h1 className="text-2xl font-bold text-slate-900">📅 掃除カレンダー</h1>
          <p className="text-sm text-slate-600 mt-1">
            掃除の予定を確認・登録できます
          </p>
        </header>

        {/* メインレイアウト - モバイルでは1カラム、PCでは2カラム */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* 掃除タスク (モバイルでは2番目、デスクトップでは1番目) */}
          <section className="order-2 lg:order-1 rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-orange-100 flex flex-col">
            {/* ヘッダー（常に展開状態） */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  掃除タスク
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  {viewMode === "summary" ? "頻度ごとの予定サマリー" : "今日〜1週間のアジェンダ"}
                </p>
              </div>
              {/* PC: タブ切替 */}
              <div className="hidden lg:flex bg-slate-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("summary")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === "summary"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  サマリー
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("agenda")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === "agenda"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  アジェンダ
                </button>
              </div>
            </div>

            {/* コンテンツ（モバイルでは条件付き表示、PCでは常に表示） */}
            <div 
              id="task-panel-content"
              className={`${isTaskPanelOpen ? "block" : "hidden"} lg:block mt-4`}
            >

            <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-2">
              {viewMode === "summary" ? (
                // Frequency Summary View
                <div className="space-y-3">
                  {frequencySummary.map((item) => (
                    <FrequencySummaryCard
                      key={item.frequency}
                      frequencyId={item.frequency}
                      nextDate={item.nextDate}
                      taskCount={item.count}
                      onClick={() => handleFrequencyClick(item.frequency)}
                      onBulkAssignClick={(e) => {
                        e.stopPropagation();
                        handleStartBulkAssign(item.frequency);
                      }}
                      isBulkActive={isBulkAssignMode && bulkFrequencyId === item.frequency}
                    />
                  ))}
                </div>
              ) : (
                // Agenda View (DnD)
                // Agenda View (List)
                <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-4">
                  {upcomingDays.map((day) => {
                    const isToday = day.offset === 0;
                    // Count by frequency
                    const byFreq: Record<string, number> = {};
                    day.tasks.forEach(t => {
                      byFreq[t.frequency] = (byFreq[t.frequency] || 0) + 1;
                    });
                    
                    return (
                      <div key={day.key} className={`rounded-2xl border p-3 ${isToday ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-slate-100"}`}>
                         <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold ${isToday ? "text-emerald-600" : "text-slate-700"}`}>
                            {isToday ? "今日" : day.offset === 1 ? "明日" : `${day.date.getMonth() + 1}/${day.date.getDate()} (${["日", "月", "火", "水", "木", "金", "土"][day.date.getDay()]})`}
                          </span>
                          <span className="text-[10px] text-slate-400">{day.tasks.length}件</span>
                        </div>
                        
                        {day.tasks.length === 0 ? (
                          <div className="text-[10px] text-slate-300 text-center py-2 border-dashed border border-slate-100 rounded">
                            予定なし
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {Object.entries(byFreq).map(([freq, count]) => {
                              const f = freq as Frequency;
                              return (
                                <div key={freq} className="flex items-center justify-between text-[11px] text-slate-600 px-2 py-1 bg-slate-50 rounded">
                                  <span>{FREQUENCY_SUMMARY_META[f]?.label ?? f}</span>
                                  <span className="font-medium">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>合計: {weeklyTotalCount}件</span>
                <Link to="/" className="hover:text-emerald-600 hover:underline">
                  ホームで確認 &rarr;
                </Link>
              </div>
            </div>
            </div>
          </section>

          {/* カレンダー (モバイルでは1番目、デスクトップでは2番目) */}
          <section className="order-1 lg:order-2 rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-orange-100 flex flex-col">
            {/* カレンダーヘッダー */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  掃除カレンダー
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  タスクが入っている日を色付きで表示します
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleJumpToday}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Today
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label="前の月"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label="次の月"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* 月表示 */}
            <div className="mt-4 flex items-center justify-center text-sm font-semibold text-slate-700">
              {headerText}
            </div>
            
            {/* Bulk Assign Mode Banner */}
            {isBulkAssignMode && bulkFrequencyId && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                <p className="text-sm font-semibold text-emerald-800">
                  📅 {FREQUENCY_SUMMARY_META[bulkFrequencyId]?.label}のタスクを一括登録中
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  カレンダーから日付をタップして選択してください
                </p>
              </div>
            )}

            {/* 曜日ヘッダー */}
            <div className="mt-3 grid grid-cols-7 text-center text-[11px] sm:text-xs font-medium text-slate-400">
              {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* 日付グリッド */}
            <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2 text-sm">
              {cells.map((cell, idx) => {
                if (!cell.date || !cell.key) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="h-8 sm:h-9 lg:h-10"
                    />
                  );
                }

                const key = cell.key;
                const isToday = key === todayKey;
                const taskIds = calendarMap[key] ?? [];
                const hasTasks = taskIds.length > 0;
                const isBulkSelected = isBulkAssignMode && bulkSelectedDates.has(key);
                // 通常モードでの選択状態（PC用）
                const isNormalSelected = !isBulkAssignMode && selectedDate && key === formatDateKey(selectedDate);
                
                // タスクの頻度を取得（複数ある場合は最も高頻度のものを使用）
                const tasksInDay = taskIds.map(id => TASK_MAP[id]).filter((t): t is CalendarTask => !!t);
                const frequencies = tasksInDay.map(t => t.frequency);
                // 優先度: Weekly > BiWeekly > Monthly > Quarterly > SemiAnnual > Annual
                const dominantFreq = frequencies.includes(Frequency.Weekly) ? Frequency.Weekly
                  : frequencies.includes(Frequency.BiWeekly) ? Frequency.BiWeekly
                  : frequencies.includes(Frequency.Monthly) ? Frequency.Monthly
                  : frequencies.includes(Frequency.Quarterly) ? Frequency.Quarterly
                  : frequencies.includes(Frequency.SemiAnnual) ? Frequency.SemiAnnual
                  : frequencies.includes(Frequency.Annual) ? Frequency.Annual
                  : null;
                
                const freqColors = dominantFreq ? FREQUENCY_COLORS[dominantFreq] : null;

                // タップ領域は最低44px（h-11相当）を確保
                // touch-manipulation: iOSでタップが確実に効くようにする
                let baseClasses =
                  "relative flex h-11 sm:h-12 lg:h-14 items-center justify-center rounded-2xl cursor-pointer text-xs sm:text-sm transition-all active:scale-[0.97] touch-manipulation focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 outline-none";
                let colorClasses = "";
                let iconColorClass = "text-slate-400";

                if (isBulkSelected) {
                  colorClasses = "bg-orange-200 text-orange-900 border-2 border-orange-500 ring-2 ring-orange-300";
                  iconColorClass = "text-orange-600";
                } else if (isNormalSelected && isToday && hasTasks && freqColors) {
                  // 今日+タスクあり+選択中
                  colorClasses = "bg-orange-500 text-white shadow-md ring-2 ring-orange-300 ring-offset-2";
                  iconColorClass = "text-white";
                } else if (isNormalSelected && hasTasks && freqColors) {
                  // タスクあり+選択中
                  colorClasses = `${freqColors.bg} ${freqColors.text} border ${freqColors.border} ring-2 ring-orange-300 ring-offset-2`;
                  iconColorClass = freqColors.icon;
                } else if (isNormalSelected) {
                  // タスクなし+選択中
                  colorClasses = "bg-orange-50 text-orange-700 border-2 border-orange-400 ring-2 ring-orange-200";
                } else if (isToday && hasTasks && freqColors) {
                  colorClasses = "bg-orange-500 text-white shadow-md";
                  iconColorClass = "text-white";
                } else if (hasTasks && freqColors) {
                  colorClasses = `${freqColors.bg} ${freqColors.text} border ${freqColors.border}`;
                  iconColorClass = freqColors.icon;
                } else if (isToday) {
                  colorClasses =
                    "border-2 border-orange-400 text-orange-700 bg-white";
                } else {
                  colorClasses =
                    "bg-slate-50 text-slate-500 hover:bg-slate-100";
                }

                // 曜日の日本語表記
                const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
                const dayOfWeek = dayNames[cell.date.getDay()];
                
                // aria-label を詳細に
                const ariaLabelParts = [
                  `${cell.date.getFullYear()}年${cell.date.getMonth() + 1}月${cell.date.getDate()}日（${dayOfWeek}）`,
                ];
                if (hasTasks) ariaLabelParts.push(`${taskIds.length}件の予定`);
                if (isToday) ariaLabelParts.push("今日");
                if (isNormalSelected) ariaLabelParts.push("選択中");
                const ariaLabel = ariaLabelParts.join("、");
                
                // ドット表示用: タスクの頻度から色を取得（最大3つ）
                const uniqueFrequencies = [...new Set(tasksInDay.map(t => t.frequency))];
                const dotColors = uniqueFrequencies.slice(0, 3).map(f => FREQUENCY_COLORS[f]?.dot || 'bg-slate-400');
                const hasMoreTasks = uniqueFrequencies.length > 3;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectDay(cell.date)}
                    className={`${baseClasses} ${colorClasses}`}
                    aria-label={ariaLabel}
                    aria-current={isToday ? "date" : undefined}
                    aria-selected={isNormalSelected || undefined}
                  >
                    {/* 日付数字 */}
                    <span>{cell.date.getDate()}</span>
                    
                    {/* ドット表示（タスクありの場合、セル下部に表示）- pointer-events-none でタップを邪魔しない */}
                    {hasTasks && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 pointer-events-none">
                        {dotColors.map((dotColor, idx) => (
                          <span
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full ${dotColor}`}
                          />
                        ))}
                        {hasMoreTasks && (
                          <span className="text-[8px] text-slate-400 font-medium">+</span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 凡例 */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>今日</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-orange-300 ring-offset-1 bg-white" />
                <span>選択中</span>
              </div>
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
                <span className="flex gap-0.5">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${FREQUENCY_COLORS[Frequency.Weekly].dot}`} />
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${FREQUENCY_COLORS[Frequency.Monthly].dot}`} />
                </span>
                <span>予定あり</span>
              </div>
            </div>
            
            {/* Bulk Assign Mode Footer */}
            {isBulkAssignMode && bulkFrequencyId && (
              <div className="mt-4 rounded-xl bg-white border border-emerald-200 p-3">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold">選択中:</span>{' '}
                    {bulkSelectedDates.size === 0 ? (
                      <span className="text-slate-400">日付を選択してください</span>
                    ) : (
                      <span>
                        {Array.from(bulkSelectedDates)
                          .sort()
                          .map(dateKey => {
                            const d = new Date(dateKey);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          })
                          .join(', ')}
                        {' '}({bulkSelectedDates.size}日)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleCancelBulkAssign}
                      className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkAssign}
                      disabled={bulkSelectedDates.size === 0}
                      className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      選択した日に{FREQUENCY_SUMMARY_META[bulkFrequencyId]?.label}のタスクを登録
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 当日アジェンダ（PC/Mobile両方で表示） */}
            {selectedDate && !isBulkAssignMode && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      📋 {selectedDate.getMonth() + 1}/{selectedDate.getDate()}（{["日", "月", "火", "水", "木", "金", "土"][selectedDate.getDay()]}）の予定
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedKey === todayKey ? "今日" : formatDisplayDate(selectedDate)}
                    </p>
                  </div>
                  {/* PCのみ: 予定あり時は編集ボタン表示 */}
                  {selectedTasksDetail.length > 0 && (
                    <button
                      type="button"
                      onClick={handleOpenEditor}
                      className="hidden lg:inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 transition-colors"
                      aria-label="予定を編集"
                    >
                      ✏️ 編集
                    </button>
                  )}
                </div>
                
                {selectedTasksDetail.length === 0 ? (
                  // Empty State - 予定なし
                  <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-4 text-center">
                    <p className="text-sm text-slate-600 mb-1">
                      この日は予定がありません
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      この日に掃除タスクを割り当てよう
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenEditor}
                      className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-sm active:scale-[0.98]"
                      aria-label="予定を登録する"
                    >
                      ✏️ 予定を登録する
                    </button>
                    <Link
                      to="/"
                      className="inline-block mt-2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ホームで確認 →
                    </Link>
                  </div>
                ) : (
                  // Task List - 予定あり
                  <div className="space-y-2">
                    {selectedTasksDetail.map((task) => {
                      const colors = FREQUENCY_COLORS[task.frequency];
                      return (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${colors.bg} ${colors.border}`}
                        >
                          <div className={`flex-shrink-0 h-2 w-2 rounded-full ${colors.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${colors.text} truncate`}>
                              {task.label}
                            </p>
                            <p className="text-xs text-slate-500">
                              {FREQUENCY_SUMMARY_META[task.frequency]?.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* フッター: 件数 + 編集ボタン */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <p className="text-xs text-slate-400">
                        合計 {selectedTasksDetail.length} 件
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenEditor}
                        className="rounded-lg bg-orange-100 px-4 py-2 text-xs font-medium text-orange-700 hover:bg-orange-200 transition-colors"
                        aria-label="予定を編集"
                      >
                        ✏️ 編集（追加/削除）
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </section>
        </div>
      </div>

      {/* タスク編集モーダル - スマホではBottomSheet風 */}
      {isEditorOpen && selectedDate && (
        <div 
          className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsEditorOpen(false)}
        >
          {/* スマホ: BottomSheet（下から85vh）、PC: 中央モーダル */}
          <div 
            className="fixed inset-x-0 bottom-0 top-auto z-[121] flex flex-col bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up overscroll-contain touch-manipulation
                       sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-[calc(100%-2rem)] sm:max-h-[90vh] sm:rounded-3xl sm:shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
              {/* ドラッグハンドル（スマホのみ） */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>
              
              {/* ヘッダー */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-6"
              >
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    掃除タスクを編集
                  </p>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                    {formatDisplayDate(selectedDate)}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"
                  aria-label="閉じる"
                >
                  ✕
                </button>
              </div>

              {/* コンテンツ - フッター分の余白を確保（約120px）*/}
              <div className="flex-1 overflow-y-auto overscroll-contain bg-white px-4 sm:px-6 py-3 pb-[120px] sm:pb-4">
                {!reschedulingTaskId && (
                  <div className="pb-3 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-700 mb-2">
                      繰り返し
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {REPEAT_TABS.map((item) => {
                        const active = repeatType === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setRepeatType(item.value);
                              if (item.value !== "once") setOnceFilter("all");
                            }}
                            className={`rounded-full border px-3 py-1.5 transition-colors ${
                              active
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    {repeatType === "once" && (
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                        {[
                          { value: "all", label: "全て" },
                          { value: "weekly", label: "週1" },
                          { value: "biweekly", label: "2週に1回" },
                          { value: "monthly", label: "月1" },
                          { value: "quarterly", label: "3ヶ月に1回" },
                          { value: "semiannual", label: "半年に1回" },
                          { value: "yearly", label: "年1" },
                        ].map((chip) => {
                          const active = onceFilter === chip.value;
                          return (
                            <button
                              key={chip.value}
                              type="button"
                              onClick={() =>
                                setOnceFilter(chip.value as OnceFilter)
                              }
                              className={`rounded-full border px-3 py-1 transition ${
                                active
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* タスク一覧 */}
                <div className="mt-3">
                  {filteredTasks.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      まだ掃除タスクが登録されていません。
                    </p>
                  ) : (
                    <>
                      {!reschedulingTaskId && (
                        <div className="mb-2 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                          <button
                            type="button"
                            onClick={handleToggleVisibleTasks}
                            className={`rounded-full border px-3 py-1 font-medium transition ${
                              allFilteredSelected
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            この頻度のタスクをまとめて選択
                          </button>
                          <span className="text-slate-400">
                            {filteredTaskIds.filter((id) =>
                              selectedTaskIds.includes(id)
                            ).length}
                            /{filteredTasks.length} 選択中
                          </span>
                        </div>
                      )}
                      <ul className="space-y-2 pb-4">
                        {filteredTasks.map((task) => {
                          const checked = selectedTaskIds.includes(task.id);
                          const isRescheduling = reschedulingTaskId === task.id;

                          if (isRescheduling) {
                            return (
                              <li
                                key={task.id}
                                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3"
                              >
                                <div className="flex flex-col gap-2">
                                  <span className="text-sm font-semibold text-slate-800">
                                    {task.label}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                      移動先:
                                    </span>
                                    <input
                                      type="date"
                                      className="flex-1 rounded-lg border-slate-300 text-sm py-1 px-2"
                                      value={individualTargetDate}
                                      onChange={(e) =>
                                        setIndividualTargetDate(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2 mt-1">
                                    <button
                                      onClick={cancelIndividualReschedule}
                                      className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-full"
                                    >
                                      キャンセル
                                    </button>
                                    <button
                                      onClick={() =>
                                        confirmIndividualReschedule(task.id)
                                      }
                                      className="px-3 py-1 text-xs bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 shadow-sm"
                                    >
                                      移動確定
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          }

                          return (
                            <li
                              key={task.id}
                              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-2 group hover:border-emerald-200 transition-colors"
                            >
                              <div className="flex flex-col flex-1">
                                {task.sectionLabel && (
                                  <span className="text-[11px] text-slate-400">
                                    {task.sectionLabel}
                                  </span>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm text-slate-800">
                                    {task.label}
                                  </span>
                                  {!reschedulingTaskId && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startIndividualReschedule(task.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 flex items-center gap-1"
                                      title="日付を変更"
                                    >
                                      📅 <span className="hidden sm:inline">変更</span>
                                    </button>
                                  )}
                                </div>
                                {!reschedulingTaskId && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickMove(task.id, 1);
                                      }}
                                      className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 hover:text-emerald-600 hover:border-emerald-200"
                                      title="明日へ移動"
                                    >
                                      +1日
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickMove(task.id, 7);
                                      }}
                                      className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 hover:text-emerald-600 hover:border-emerald-200"
                                      title="来週へ移動"
                                    >
                                      +1週
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startIndividualReschedule(task.id);
                                      }}
                                      className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 hover:text-emerald-600 hover:border-emerald-200"
                                      title="日付を指定して移動"
                                    >
                                      移動...
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleTask(task.id);
                                      }}
                                      className="text-[10px] bg-white border border-red-200 rounded px-1.5 py-0.5 text-red-400 hover:text-red-600 hover:border-red-400 hover:bg-red-50"
                                      title="この予定を削除"
                                      aria-label="削除"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <label className="inline-flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                  checked={checked}
                                  onChange={() => handleToggleTask(task.id)}
                                />
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* フッター - 完全固定配置でsafe-areaを考慮 */}
              <div
                className="fixed bottom-0 left-0 right-0 z-[122] border-t border-slate-100 bg-white px-4 py-4 sm:static sm:z-auto sm:border-t sm:bg-white sm:px-6 sm:py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] sm:shadow-none"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
              >
                {isRescheduleMode ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        選択したタスクの移動先:
                      </span>
                      <button
                        onClick={() => setIsRescheduleMode(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        キャンセル
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 rounded-lg border-slate-200 text-sm"
                        value={rescheduleTargetDate}
                        onChange={(e) => setRescheduleTargetDate(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleMoveTasks}
                        disabled={!rescheduleTargetDate}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        一括移動
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleClearDay}
                        className="text-xs text-red-400 hover:text-red-500 hover:underline"
                      >
                        全削除
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
                      {selectedTaskIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsRescheduleMode(true)}
                          className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                          選択分を移動...
                        </button>
                      )}
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setIsEditorOpen(false)}
                          className="flex-1 sm:flex-none rounded-full border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          キャンセル
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveTasks}
                          className="flex-1 sm:flex-none rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-all hover:shadow-lg active:scale-95"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CalendarPage;

function formatNextLabel(nextDate: Date | null): string {
  if (!nextDate) return '予定なし';
  const today = new Date();

  const isToday =
    nextDate.getFullYear() === today.getFullYear() &&
    nextDate.getMonth() === today.getMonth() &&
    nextDate.getDate() === today.getDate();

  if (isToday) return '今日';

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow =
    nextDate.getFullYear() === tomorrow.getFullYear() &&
    nextDate.getMonth() === tomorrow.getMonth() &&
    nextDate.getDate() === tomorrow.getDate();

  if (isTomorrow) return '明日';

  return `${nextDate.getMonth() + 1}/${nextDate.getDate()}`;
}

type FrequencySummaryProps = {
  frequencyId: Frequency;
  nextDate: Date | null;
  taskCount: number;
  onClick: () => void;
  onBulkAssignClick: (e: React.MouseEvent) => void;
  isBulkActive?: boolean;
};

function FrequencySummaryCard({
  frequencyId,
  nextDate,
  taskCount,
  onClick,
  onBulkAssignClick,
  isBulkActive = false,
}: FrequencySummaryProps) {
  const meta = FREQUENCY_SUMMARY_META[frequencyId];
  const colors = FREQUENCY_COLORS[frequencyId];
  if (!meta) return null;

  return (
    <div className={`w-full rounded-xl border ${colors.bg} p-3 shadow-sm transition ${isBulkActive ? 'border-emerald-500 ring-2 ring-emerald-200' : colors.border}`}>
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left transition hover:-translate-y-0.5 group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${colors.dot} flex-shrink-0`} />
              <p className="text-xs font-semibold text-slate-700">{meta.label}</p>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-slate-500">
              {meta.shortDescription}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400">次回</p>
            <p className={`text-sm font-semibold ${nextDate && formatNextLabel(nextDate) === '今日' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {formatNextLabel(nextDate)}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">{taskCount}件</p>
          </div>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-500 transition-colors">{meta.examples}</p>
      </button>
      
      <button
        type="button"
        onClick={onBulkAssignClick}
        className={`mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-medium transition ${
          isBulkActive
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'bg-white/80 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
        }`}
      >
        {isBulkActive ? '📅 選択中... (キャンセルはカレンダー下部から)' : '📅 一括登録'}
      </button>
    </div>
  );
}
