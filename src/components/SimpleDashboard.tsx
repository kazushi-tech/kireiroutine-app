// SimpleDashboard.tsx
// Dラボ風のシンプルな「今日やること」ダッシュボード
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CLEANING_DATA } from '../../constants';
import { SectionMetaMap, CleaningSection, Frequency } from '../../types';
import { isDueToday } from '../../sectionMetaStorage';
import { Check, ChevronRight, Sparkles, Clock } from 'lucide-react';

interface SimpleDashboardProps {
  sectionMetaMap: SectionMetaMap;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  onClose?: () => void;
}

interface TodaySection {
  section: CleaningSection;
  frequency: Frequency;
  frequencyLabel: string;
}

const SimpleDashboard: React.FC<SimpleDashboardProps> = ({
  sectionMetaMap,
  completedTasks,
  onToggleTask,
  onClose,
}) => {
  const today = new Date();

  // 今日やるべきセクションを抽出
  const todaySections = useMemo(() => {
    const sections: TodaySection[] = [];
    
    CLEANING_DATA.forEach((category) => {
      category.sections.forEach((section) => {
        const meta = sectionMetaMap[section.id];
        if (isDueToday(meta, today)) {
          sections.push({
            section,
            frequency: category.frequency,
            frequencyLabel: category.label,
          });
        }
      });
    });

    // ステップ順にソート
    return sections.sort((a, b) => a.section.step - b.section.step);
  }, [sectionMetaMap, today]);

  // 全タスク数と完了数
  const allTasks = todaySections.flatMap((ts) => ts.section.tasks);
  const completedCount = allTasks.filter((task) => completedTasks[task.id]).length;
  const totalCount = allTasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // 全タスク完了？
  const isAllDone = completedCount === totalCount && totalCount > 0;

  if (todaySections.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f1e7] p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-6xl">✨</div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            今日の掃除はありません
          </h2>
          <p className="mb-8 text-slate-600">
            ゆっくり休んでくださいね
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full bg-orange-500 px-8 py-3 text-lg font-bold text-white shadow-lg"
            >
              戻る
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#f7f1e7]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">今日の掃除</h1>
            <p className="text-xs text-slate-500">
              {completedCount}/{totalCount}タスク完了
            </p>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600"
            >
              通常表示
            </button>
          )}
        </div>

        {/* プログレスバー */}
        <div className="mx-auto mt-2 max-w-lg">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 全完了メッセージ */}
      {isAllDone && (
        <div className="mx-auto mt-8 max-w-lg px-4">
          <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center border border-green-100">
            <div className="mb-3 text-5xl">🎉</div>
            <h2 className="mb-2 text-xl font-bold text-green-800">
              お疲れさまでした！
            </h2>
            <p className="text-sm text-green-700">
              今日の掃除は全て完了です
            </p>
          </div>
        </div>
      )}

      {/* タスクリスト */}
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="space-y-4">
          {todaySections.map(({ section, frequencyLabel }) => {
            const sectionTasks = section.tasks;
            const sectionCompleted = sectionTasks.filter((task) => completedTasks[task.id]).length;
            const isSectionDone = sectionCompleted === sectionTasks.length;

            return (
              <div
                key={section.id}
                className={`rounded-3xl overflow-hidden transition-all duration-300 ${
                  isSectionDone 
                    ? 'bg-green-50/50 border border-green-100' 
                    : 'bg-white shadow-sm'
                }`}
              >
                {/* セクションヘッダー */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {isSectionDone ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                        <Check className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                        {section.step}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">{section.areaName}</h3>
                      <p className="text-xs text-slate-500">{frequencyLabel}</p>
                    </div>
                  </div>
                  
                  <Link
                    to={`/section/${section.id}`}
                    className="flex items-center gap-1 text-xs text-orange-600 font-medium"
                  >
                    詳細
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* 並行作業ヒント */}
                {section.parallelTip && !isSectionDone && (
                  <div className="px-4 py-2 bg-blue-50/50 text-xs text-blue-700 flex items-center gap-2">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{section.waitAction || section.parallelTip}</span>
                  </div>
                )}

                {/* タスクリスト */}
                <ul className="divide-y divide-slate-50">
                  {sectionTasks.map((task) => {
                    const isChecked = completedTasks[task.id];
                    return (
                      <li key={task.id}>
                        <button
                          type="button"
                          onClick={() => onToggleTask(task.id)}
                          className="flex w-full items-center gap-4 p-4 text-left transition-colors active:bg-slate-50"
                        >
                          {/* 大きなチェックボタン */}
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              isChecked
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-white border-slate-300 text-slate-300 hover:border-orange-400 hover:text-orange-400'
                            }`}
                          >
                            {isChecked && <Check className="h-5 w-5" />}
                          </div>
                          
                          <span
                            className={`flex-1 text-[15px] leading-relaxed ${
                              isChecked 
                                ? 'text-slate-400 line-through' 
                                : 'text-slate-800'
                            }`}
                          >
                            {task.text}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </main>

      {/* フッター */}
      <footer className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-100 px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-lg">
          <p className="text-center text-xs text-slate-500">
            <Sparkles className="inline h-3 w-3 mr-1" />
            一つずつ、淡々と進めましょう
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleDashboard;
