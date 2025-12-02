import React, { useEffect, useMemo, useState } from "react";

type RepeatMode = "once" | "weekly" | "biweekly" | "monthly";

type CalendarTask = {
  id: string;
  label: string;
  sectionLabel?: string;
};

type CalendarMap = Record<string, string[]>;

const CALENDAR_STORAGE_KEY = "kireiroutine_calendar_v1";

// TODO: 実際の manualData / metadata に合わせてここを書き換えてOK
const ALL_TASKS: CalendarTask[] = [
  {
    id: "bed-make",
    label: "ベッドを整える",
    sectionLabel: "寝室・ベッド周り",
  },
  {
    id: "kitchen-counter",
    label: "キッチンのカウンターを拭く",
    sectionLabel: "キッチン",
  },
  {
    id: "bath-mirror",
    label: "洗面所の鏡を拭く",
    sectionLabel: "洗面所",
  },
  {
    id: "living-wiper",
    label: "リビングの床をワイパーがけ",
    sectionLabel: "リビング",
  },
];

const today = new Date();
const todayKey = formatDateKey(today);

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${yyyy}年${mm}月${dd}日（${weekday}）`;
}

function createEmptyCalendarMap(): CalendarMap {
  return {};
}

function loadCalendarMap(): CalendarMap {
  if (typeof window === "undefined") return createEmptyCalendarMap();
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) return createEmptyCalendarMap();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return createEmptyCalendarMap();
    return parsed as CalendarMap;
  } catch {
    return createEmptyCalendarMap();
  }
}

function saveCalendarMap(map: CalendarMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(map));
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

function applyTasksWithRepeat(
  baseDate: Date,
  mode: RepeatMode,
  taskIds: string[],
  prev: CalendarMap
): CalendarMap {
  const next: CalendarMap = { ...prev };

  const addForDate = (d: Date) => {
    const key = formatDateKey(d);
    next[key] = [...taskIds];
  };

  if (mode === "once") {
    addForDate(baseDate);
    return next;
  }

  if (mode === "weekly" || mode === "biweekly") {
    const step = mode === "weekly" ? 7 : 14;
    const limit = new Date(baseDate);
    limit.setMonth(limit.getMonth() + 3); // 約3ヶ月先まで

    for (let d = new Date(baseDate); d <= limit; d.setDate(d.getDate() + step)) {
      addForDate(new Date(d));
    }
    return next;
  }

  if (mode === "monthly") {
    const limit = new Date(baseDate);
    limit.setMonth(limit.getMonth() + 6); // 約6ヶ月先まで
    const baseDay = baseDate.getDate();

    const cursor = new Date(baseDate);
    while (cursor <= limit) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth();
      const last = new Date(y, m + 1, 0).getDate();
      const day = Math.min(baseDay, last);
      addForDate(new Date(y, m, day));
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return next;
  }

  return next;
}

const CalendarPage: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [calendarMap, setCalendarMap] = useState<CalendarMap>(() =>
    loadCalendarMap()
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("once");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // 月のセル
  const cells = useMemo(
    () => buildMonthCells(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const headerText = `${currentYear}年${currentMonth + 1}月`;

  const selectedKey = selectedDate ? formatDateKey(selectedDate) : todayKey;
  const tasksForSelectedDay = calendarMap[selectedKey] ?? [];

  const selectedTasksDetail = tasksForSelectedDay
    .map((id) => ALL_TASKS.find((t) => t.id === id))
    .filter(Boolean) as CalendarTask[];

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
    setSelectedDate(date);
    setSelectedTaskIds(calendarMap[key] ?? []);
    setRepeatMode("once");
    setIsEditorOpen(true);
  };

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSaveTasks = () => {
    if (!selectedDate) return;
    setCalendarMap((prev) => {
      const next = applyTasksWithRepeat(
        selectedDate,
        repeatMode,
        selectedTaskIds,
        prev
      );
      saveCalendarMap(next);
      return next;
    });
    setIsEditorOpen(false);
  };

  const handleClearDay = () => {
    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    setCalendarMap((prev) => {
      const next = { ...prev };
      delete next[key];
      saveCalendarMap(next);
      return next;
    });
    setSelectedTaskIds([]);
    setIsEditorOpen(false);
  };

  // 今日にジャンプ
  const handleJumpToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today);
  };

  // レスポンシブ用に body スクロールを止める（モバイルでのボトムシート）
  useEffect(() => {
    if (!isEditorOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isEditorOpen]);

  return (
    <main className="min-h-screen bg-slate-900 py-6 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-gradient-to-br from-emerald-50 to-sky-50 p-4 sm:p-6 lg:p-8 shadow-xl">
        {/* ヘッダー */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              KireiRoutine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              あなた専用の掃除ルーティン管理アプリ
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm">
              K
            </span>
          </div>
        </header>

        {/* メインレイアウト */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* 左：今週の掃除タスク（今はプレースホルダー） */}
          <section className="rounded-3xl bg-white/80 p-4 sm:p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  今週の掃除タスク
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  今日〜1週間以内に予定されているタスク
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                {tasksForSelectedDay.length} Tasks
              </span>
            </div>

            <div className="mt-6 text-xs sm:text-sm text-slate-400 text-center">
              直近の予定はありません
            </div>
          </section>

          {/* 右：カレンダー */}
          <section className="rounded-3xl bg-white/80 p-4 sm:p-6 shadow-md flex flex-col">
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
                const hasTasks = (calendarMap[key] ?? []).length > 0;

                let baseClasses =
                  "flex h-8 sm:h-9 lg:h-10 items-center justify-center rounded-2xl cursor-pointer text-xs sm:text-sm transition-colors";
                let colorClasses = "";

                if (isToday && hasTasks) {
                  colorClasses = "bg-emerald-500 text-white";
                } else if (hasTasks) {
                  colorClasses = "bg-emerald-100 text-emerald-900";
                } else if (isToday) {
                  colorClasses =
                    "border border-emerald-400 text-emerald-700 bg-white";
                } else {
                  colorClasses =
                    "bg-slate-50 text-slate-500 hover:bg-slate-100";
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectDay(cell.date)}
                    className={`${baseClasses} ${colorClasses}`}
                  >
                    {cell.date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* 凡例 */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>今日 &amp; 掃除タスクあり</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-100 border border-emerald-300" />
                <span>掃除タスクあり</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-50 border border-slate-200" />
                <span>タスクなし</span>
              </div>
            </div>

            {/* 選択日の予定 */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-800">
                {selectedDate
                  ? `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日の予定`
                  : "この日の予定"}
              </h3>
              {selectedTasksDetail.length === 0 ? (
                <p className="mt-2 text-xs sm:text-sm text-slate-400">
                  予定はありません
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {selectedTasksDetail.map((task) => (
                    <li key={task.id} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>
                        {task.sectionLabel && (
                          <span className="text-slate-400 mr-1">
                            [{task.sectionLabel}]
                          </span>
                        )}
                        {task.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ボトムシート：タスク編集 */}
      {isEditorOpen && selectedDate && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 px-4 pb-4 sm:items-center sm:px-0">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-xl">
            {/* ヘッダー */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6">
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            {/* 繰り返し */}
            <div className="px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-0">
              <p className="text-xs font-medium text-slate-700 mb-2">
                繰り返し
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { mode: "once", label: "今日だけ" },
                  { mode: "weekly", label: "毎週" },
                  { mode: "biweekly", label: "2週に1回" },
                  { mode: "monthly", label: "月1" },
                ].map((item) => {
                  const active = repeatMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() =>
                        setRepeatMode(item.mode as RepeatMode)
                      }
                      className={`rounded-full border px-3 py-1.5 ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* タスク一覧 */}
            <div className="mt-3 max-h-72 overflow-y-auto border-t border-slate-100 px-4 py-3 sm:px-6">
              {ALL_TASKS.length === 0 ? (
                <p className="text-xs text-slate-400">
                  まだ掃除タスクが登録されていません。
                </p>
              ) : (
                <ul className="space-y-2">
                  {ALL_TASKS.map((task) => {
                    const checked = selectedTaskIds.includes(task.id);
                    return (
                      <li
                        key={task.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-2"
                      >
                        <div className="flex flex-col">
                          {task.sectionLabel && (
                            <span className="text-[11px] text-slate-400">
                              {task.sectionLabel}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm text-slate-800">
                            {task.label}
                          </span>
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
              )}
            </div>

            {/* フッター */}
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                type="button"
                onClick={handleClearDay}
                className="text-xs text-slate-400 underline-offset-2 hover:underline"
              >
                この日の予定をすべて削除
              </button>
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:w-auto"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSaveTasks}
                  className="w-full rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-600 sm:w-auto"
                >
                  この日の掃除タスクを保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CalendarPage;
