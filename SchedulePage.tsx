// SchedulePage.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CLEANING_DATA, IMAGE_URLS } from './constants';
import { Frequency, ScheduleCategory, SectionMetaMap } from './types';
import { loadSectionMetaMap, isDueToday, formatDateForDisplay, updateSectionMeta, normalizeDateInput } from './sectionMetaStorage';
import TodayTasksSection from './src/components/TodayTasksSection';
import CollapsibleSection from './src/components/CollapsibleSection';
import FrequencyOverviewSection from './src/components/FrequencyOverviewSection';
import ExecutionGuide from './src/components/ExecutionGuide';
import SimpleDashboard from './src/components/SimpleDashboard';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Wrench,
  Info,
  Trash2,
  BookOpen,
  Calendar,
  X,
} from 'lucide-react';
import { MANUAL_SECTIONS } from './manualData';

type CompletedMap = Record<string, boolean>;

const STORAGE_KEY = 'kireiRoutineProgress';

const frequencyOrder: Frequency[] = [
  Frequency.Weekly,
  Frequency.BiWeekly,
  Frequency.Monthly,
  Frequency.Quarterly,
  Frequency.SemiAnnual,
  Frequency.Annual,
];

const frequencyLabelMap: Record<Frequency, string> = CLEANING_DATA.reduce(
  (acc, category) => {
    acc[category.frequency] = category.label;
    return acc;
  },
  {} as Record<Frequency, string>,
);

// 頻度ごとの表示データ定義
const frequencyDisplayData: Record<Frequency, { title: string; description: string; imageSrc: string; imageAlt: string }> = {
  [Frequency.Weekly]: {
    title: '週1（毎週）のメイン掃除',
    description: '迷ったらここだけやればOKのメインルール。ベッド・キッチン・トイレなど、生活の土台になる場所を週1で整えます。',
    imageSrc: '/images/branding-kirei-frequency-weekly.jpeg',
    imageAlt: '週1のメイン掃除のインフォグラフィック',
  },
  [Frequency.BiWeekly]: {
    title: '2週間に1回のちょい重め掃除',
    description: '週1の掃除にプラスして、汚れがたまりやすい場所をリセットする日。キッチン・浴室・トイレ・玄関を2週間に1回まとめてリフレッシュ。',
    imageSrc: '/images/branding-kirei-frequency-biweekly.jpeg',
    imageAlt: '2週間に1回のちょい重め掃除のインフォグラフィック',
  },
  [Frequency.Monthly]: {
    title: '月1のリセット＆ニオイ対策',
    description: '月末の最終土曜日などにまとめて実行する想定。リセット＆におい対策で、月に1回しっかり整えます。',
    imageSrc: '/images/branding-kirei-frequency-monthly.jpeg',
    imageAlt: '月1のリセット＆ニオイ対策のインフォグラフィック',
  },
  [Frequency.Quarterly]: {
    title: '3ヶ月に1回のプチ大掃除',
    description: 'カビ・油・ホコリを根こそぎリセットするタイミング。季節の変わり目に3ヶ月に1回、しっかり掃除します。',
    imageSrc: '/images/branding-kirei-frequency-quarterly.jpeg',
    imageAlt: '3ヶ月に1回のプチ大掃除のインフォグラフィック',
  },
  [Frequency.SemiAnnual]: {
    title: '半年に1回の中規模リセット',
    description: '模様替え・断捨離も絡めた中規模リセット。半年に1回、大きな掃除をして気分をリフレッシュ。',
    imageSrc: '/images/branding-kirei-frequency-semiannual.jpeg',
    imageAlt: '半年に1回の中規模リセットのインフォグラフィック',
  },
  [Frequency.Annual]: {
    title: '年1の大掃除クラス',
    description: '年末の大掃除シーズンなど、2〜3時間かけて一気にやるイメージ。年に1回、しっかり大掃除します。',
    imageSrc: '/images/branding-kirei-frequency-annual.jpeg',
    imageAlt: '年1の大掃除クラスのインフォグラフィック',
  },
};

const SchedulePage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { initialFrequency?: Frequency; activeFrequency?: Frequency } | null;
  const tabsRef = useRef<HTMLElement>(null);

  const handleStartClick = () => {
    setActiveFrequency(Frequency.Weekly);
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleViewTodayTasks = () => {
    setActiveFrequency(Frequency.Weekly);
    setShowTodayOnly(true);
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // 優先順位: state.initialFrequency > state.activeFrequency > Frequency.Weekly
  const [activeFrequency, setActiveFrequency] = useState<Frequency>(
    state?.initialFrequency ?? state?.activeFrequency ?? Frequency.Weekly
  );

  useEffect(() => {
    if (state?.initialFrequency) {
      setActiveFrequency(state.initialFrequency);
    } else if (state?.activeFrequency) {
      setActiveFrequency(state.activeFrequency);
    }
  }, [state]);
  const [completedTasks, setCompletedTasks] = useState<CompletedMap>({});
  const [sectionMetaMap, setSectionMetaMap] = useState<SectionMetaMap>({});
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  
  // Bulk Schedule State
  const [isBulkScheduleOpen, setIsBulkScheduleOpen] = useState(false);
  
  // Image Zoom State
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const [bulkScheduleDate, setBulkScheduleDate] = useState('');
  
  // Simple Mode State
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  // --- load section meta on mount ---
  useEffect(() => {
    setSectionMetaMap(loadSectionMetaMap());
  }, []);

  // --- load progress from localStorage on mount ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as CompletedMap;
      if (parsed && typeof parsed === 'object') {
        setCompletedTasks(parsed);
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
  }, []);

  // --- save progress whenever it changes ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [completedTasks]);

  const categoriesByFrequency: Record<Frequency, ScheduleCategory | undefined> =
    useMemo(() => {
      const map: Partial<Record<Frequency, ScheduleCategory>> = {};
      for (const category of CLEANING_DATA) {
        map[category.frequency] = category;
      }
      return map as Record<Frequency, ScheduleCategory | undefined>;
    }, []);

  const activeCategory = categoriesByFrequency[activeFrequency];

  // セクションとメタ情報を結合し、フィルタリング
  const displayedSections = useMemo(() => {
    if (!activeCategory) return [];
    const today = new Date();
    
    return activeCategory.sections.filter((section) => {
      if (!showTodayOnly) return true;
      const meta = sectionMetaMap[section.id];
      return isDueToday(meta, today);
    });
  }, [activeCategory, showTodayOnly, sectionMetaMap]);

  const allTasksForActive = useMemo(() => {
    return displayedSections.flatMap((section) => section.tasks);
  }, [displayedSections]);

  const doneCount = allTasksForActive.filter(
    (task) => completedTasks[task.id],
  ).length;
  const totalCount = allTasksForActive.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  // セクション単位の完了数（全タスク完了で1カウント）
  const completedSectionsCount = displayedSections.filter(section => {
    const sectionTasks = section.tasks;
    if (sectionTasks.length === 0) return false;
    return sectionTasks.every(task => completedTasks[task.id]);
  }).length;

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleResetProgress = () => {
    const ok = window.confirm('この掃除ルーティンの進捗をすべてリセットしますか？');
    if (!ok) return;
    setCompletedTasks({});
  };

  const handleBulkScheduleConfirm = () => {
    const normalized = normalizeDateInput(bulkScheduleDate);
    if (!normalized) return;

    if (!activeCategory) return;

    // Update all sections in the active category
    activeCategory.sections.forEach((section) => {
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

    // Refresh meta map to update UI
    setSectionMetaMap(loadSectionMetaMap());
    
    // Close modal and reset
    setIsBulkScheduleOpen(false);
    setBulkScheduleDate('');
    
    console.log('[SchedulePage] Bulk set nextPlannedDate for frequency', {
      frequency: activeFrequency,
      date: normalized,
      sectionCount: activeCategory.sections.length,
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f1e7] px-4 py-5 pb-24 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* header */}
        <header className="flex flex-col gap-3 border-b border-orange-100 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 text-white shadow-sm overflow-hidden border border-orange-200">
              <img 
                src="/branding-kirei-mascot.jpeg" 
                alt="Mascot" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight md:text-xl">
                KireiRoutine
              </h1>
              <p className="text-sm sm:text-xs text-orange-700 md:text-sm">
                掃除ルーティン完全表（かずし専用）
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-slate-600 md:text-sm">
            <Link
              to="/calendar"
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              📅 カレンダー
            </Link>
            <button
              type="button"
              onClick={handleResetProgress}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-sm sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Trash2 className="h-3 w-3" />
              進捗リセット
            </button>
          </div>
        </header>

        {/* 今日のタスクサマリー */}
        <TodayTasksSection 
          sectionMetaMap={sectionMetaMap}
          onViewTodayTasks={handleViewTodayTasks}
          onStartSimpleMode={() => setIsSimpleMode(true)}
        />

        {/* 頻度タブ - 上部に固定表示 */}
        <section ref={tabsRef} className="sticky top-0 z-40 bg-[#f7f1e7] py-3 -mx-4 px-4">
          <div className="flex flex-wrap items-center gap-2">
            {frequencyOrder.map((freq) => {
              const label = frequencyLabelMap[freq];
              if (!label) return null;
              const isActive = freq === activeFrequency;
              return (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setActiveFrequency(freq)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 頻度別インフォグラフィック */}
        {displayedSections.length > 0 && (
          <div className="flex flex-col items-center">
            <img
              src={frequencyDisplayData[activeFrequency].imageSrc}
              alt={frequencyDisplayData[activeFrequency].imageAlt}
              className="w-full max-w-[600px] rounded-2xl shadow-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setZoomedImage({
                src: frequencyDisplayData[activeFrequency].imageSrc,
                alt: frequencyDisplayData[activeFrequency].imageAlt
              })}
            />
            <p className="text-xs text-slate-500 mt-2">※ タップで拡大</p>
          </div>
        )}

        {/* 効率的な作業順序ガイド */}
        {displayedSections.length > 0 && (
          <CollapsibleSection
            title="⏱ 効率的な作業順序"
            subtitle="待ち時間を活用して時短"
            storageKey={`kireiRoutine-execution-guide-${activeFrequency}`}
            defaultOpen={false}
          >
            <ExecutionGuide
              sections={displayedSections}
              frequency={activeFrequency}
            />
          </CollapsibleSection>
        )}

        {/* sections */}
        {displayedSections.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayedSections.map((section) => {
              const manual = MANUAL_SECTIONS[section.id];
              const meta = sectionMetaMap[section.id];
              const hasManual = Boolean(manual);
              const manualLabel = hasManual
                ? '詳しい手順を見る'
                : '詳しい手順（準備中）';

              const totalSectionTasks = section.tasks.length;
              const doneSectionTasks = section.tasks.filter(
                (task) => completedTasks[task.id],
              ).length;

              return (
                <article
                  key={section.id}
                  className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm"
                >
                  {/* image */}
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={IMAGE_URLS[section.imageKey]}
                      alt={section.areaName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {section.areaName}
                        </h3>
                        <div className="flex flex-col gap-1 text-[13px] sm:text-xs text-slate-500">
                          <span>{doneSectionTasks}/{totalSectionTasks} 件 完了</span>
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            <span>前回: {formatDateForDisplay(meta?.lastDoneDate || meta?.lastDoneAt, '未実施')}</span>
                            <span className={meta?.nextDueDate && isDueToday(meta, new Date()) ? 'font-bold text-orange-600' : ''}>
                              次回: {formatDateForDisplay(meta?.nextDueDate || meta?.nextPlannedAt, '未設定')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {hasManual ? (
                        <Link
                          to={`/section/${section.id}`}
                          className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-xs sm:text-[11px] font-medium text-orange-700 hover:bg-orange-100"
                        >
                          <BookOpen className="h-3 w-3" />
                          {manualLabel}
                        </Link>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-400">
                          <BookOpen className="h-3 w-3" />
                          {manualLabel}
                        </div>
                      )}
                    </div>

                    {/* tasks */}
                    <ul className="space-y-2">
                      {section.tasks.slice(0, 3).map((task) => {
                        const checked = !!completedTasks[task.id];
                        return (
                          <li key={task.id}>
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id)}
                              className="flex w-full items-start gap-2 text-left text-[17px] sm:text-sm text-slate-800"
                            >
                              {checked ? (
                                <CheckCircle2 className="mt-[1px] h-4 w-4 flex-shrink-0 text-orange-500" />
                              ) : (
                                <Circle className="mt-[1px] h-4 w-4 flex-shrink-0 text-slate-300" />
                              )}
                              <span>{task.text}</span>
                            </button>
                          </li>
                        );
                      })}
                      {section.tasks.length > 3 && (
                        <li className="pt-1">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>...他 {section.tasks.length - 3} 件のタスク</span>
                            {hasManual && (
                              <Link
                                to={`/section/${section.id}`}
                                className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                              >
                                詳細を見る →
                              </Link>
                            )}
                          </div>
                        </li>
                      )}
                    </ul>

                    {/* tools hint */}
                    {section.tools && section.tools.length > 0 && (
                      <div className="mt-1 flex items-start gap-2 rounded-2xl bg-slate-50 p-2">
                        <Wrench className="mt-[2px] h-3 w-3 flex-shrink-0 text-slate-500" />
                        <p className="text-[13px] sm:text-[11px] leading-relaxed text-slate-600">
                          最低限あると楽になる道具:
                          {' '}
                          {section.tools.join('、')}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">
            <p>
              {showTodayOnly
                ? '今日やる予定のセクションはありません。'
                : 'この頻度に対応する掃除セクションはまだ未定義です。'}
            </p>
          </section>
        )}

        {/* フィルター・設定ボタン */}
        <section className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsBulkScheduleOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Calendar className="h-4 w-4" />
            掃除日をまとめて設定
          </button>
          <button
            type="button"
            onClick={() => setShowTodayOnly(!showTodayOnly)}
            className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              showTodayOnly
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-slate-700 shadow-sm hover:bg-orange-50'
            }`}
          >
            {showTodayOnly ? '今日のみ表示中' : '今日やる分だけ絞り込む'}
          </button>
        </section>

        {/* tips */}
        <section className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/80 p-4 text-xs text-slate-700">
          <div className="mb-1 flex items-center gap-1 font-semibold text-orange-800">
            <Sparkles className="h-3 w-3" />
            <span>運用のコツ</span>
          </div>
          <ul className="list-disc space-y-1 pl-4">
            <li>その日の気分と体力にあわせて、エリアを1〜2個だけ選んで回す。</li>
            <li>完了チェックは「やった証拠」を残すためのメモ代わりだと思えばOK。</li>
            <li>
              週1が崩れた時は、まず週1だけをリセットして立て直し、それ以外は後回しでも良い。
            </li>
          </ul>
        </section>
      </div>
      {/* Bulk Schedule Modal */}
      {isBulkScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-6">

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {frequencyLabelMap[activeFrequency]}の掃除日をまとめて設定
              </h3>
              <button
                onClick={() => setIsBulkScheduleOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-slate-500">
              この頻度に属するすべてのセクションの「次にやる予定日（目安）」を、下の日付でまとめて設定します。あとから各セクションごとに個別修正もできます。
            </p>
            
            <div className="mb-8">
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                設定する日付
              </label>
              <input
                type="date"
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-amber-500 focus:ring-amber-500"
                value={bulkScheduleDate}
                onChange={(e) => setBulkScheduleDate(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setIsBulkScheduleOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkScheduleConfirm}
                disabled={!bulkScheduleDate}
                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                この日で設定する
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col items-center justify-center w-full h-full max-h-[95vh] overflow-auto">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="w-auto h-auto max-h-[85vh] sm:max-h-[90vh] max-w-full sm:max-w-[90vw] rounded-xl sm:rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 text-white/70 text-xs sm:text-sm">タップで閉じる</p>
          </div>
        </div>
      )}
      {/* Simple Dashboard Mode */}
      {isSimpleMode && (
        <SimpleDashboard
          sectionMetaMap={sectionMetaMap}
          completedTasks={completedTasks}
          onToggleTask={handleToggleTask}
          onClose={() => setIsSimpleMode(false)}
        />
      )}
    </main>
  );
};

export default SchedulePage;
