import React, { useMemo } from 'react';
import { CLEANING_DATA } from '../../constants';
import { SectionMetaMap, Frequency } from '../../types';
import { isDueToday } from '../../sectionMetaStorage';
import { Calendar } from 'lucide-react';

interface TodayTasksSectionProps {
  sectionMetaMap: SectionMetaMap;
  onViewTodayTasks: () => void;
}

interface FrequencySummary {
  frequency: Frequency;
  label: string;
  sectionCount: number;
  taskCount: number;
}

const TodayTasksSection: React.FC<TodayTasksSectionProps> = ({ sectionMetaMap, onViewTodayTasks }) => {
  const today = new Date();

  // 今日やるべきタスクを頻度別に集計
  const todaySummary = useMemo(() => {
    const summaryMap = new Map<Frequency, FrequencySummary>();
    
    CLEANING_DATA.forEach((category) => {
      const dueSections = category.sections.filter((section) => {
        const meta = sectionMetaMap[section.id];
        return isDueToday(meta, today);
      });

      if (dueSections.length > 0) {
        const taskCount = dueSections.reduce((sum, section) => sum + section.tasks.length, 0);
        summaryMap.set(category.frequency, {
          frequency: category.frequency,
          label: category.label,
          sectionCount: dueSections.length,
          taskCount,
        });
      }
    });

    return Array.from(summaryMap.values());
  }, [sectionMetaMap, today]);

  const totalSections = todaySummary.reduce((sum, item) => sum + item.sectionCount, 0);
  const totalTasks = todaySummary.reduce((sum, item) => sum + item.taskCount, 0);

  return (
    <section className="rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm border border-orange-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* 左側: タイトルとサマリー */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 mb-1">📋 今日の掃除タスク</h2>
          <p className="text-sm text-slate-600 mb-3">
            今日やる掃除をここに集約しています
          </p>

          {totalSections > 0 ? (
            <div className="space-y-2">
              {todaySummary.map((item) => (
                <div
                  key={item.frequency}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="inline-block px-2 py-0.5 rounded-full bg-white text-orange-700 font-medium text-xs">
                    {item.label}
                  </span>
                  <span className="text-slate-700">
                    {item.sectionCount} セクション / {item.taskCount} タスク
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-orange-200 text-sm font-semibold text-slate-900">
                合計: {totalSections} セクション / {totalTasks} タスク
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              ✨ 今日やる予定の掃除はありません。おつかれさまです！
            </p>
          )}
        </div>

        {/* 右側: CTA ボタン */}
        {totalSections > 0 && (
          <div className="flex-shrink-0">
            <button
              onClick={onViewTodayTasks}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 w-full md:w-auto"
            >
              <Calendar className="h-4 w-4" />
              今日のチェックリストを開く
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TodayTasksSection;
