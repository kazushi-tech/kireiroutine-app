// ExecutionGuide.tsx
// 効率的な作業順序を表示するガイドコンポーネント
import React from 'react';
import { CleaningSection, Frequency } from '../../types';
import { Clock, ArrowRight, Lightbulb, Play } from 'lucide-react';

interface ExecutionGuideProps {
  sections: CleaningSection[];
  frequency: Frequency;
  onStartGuide?: () => void;
}

const ExecutionGuide: React.FC<ExecutionGuideProps> = ({ sections, frequency, onStartGuide }) => {
  // ステップ順にソート
  const sortedSections = [...sections].sort((a, b) => a.step - b.step);
  
  // 待ち時間がある作業を持つセクション
  const sectionsWithWait = sortedSections.filter(s => s.waitTime && s.waitTime > 0);
  const totalWaitTime = sectionsWithWait.reduce((sum, s) => sum + (s.waitTime || 0), 0);
  
  if (sortedSections.length === 0) return null;

  return (
    <section className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm border border-blue-100">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">⏱ 効率的な掃除順序</h3>
            <p className="text-xs text-slate-500">並行作業で時間を有効活用</p>
          </div>
        </div>
        {onStartGuide && (
          <button
            onClick={onStartGuide}
            className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors"
          >
            <Play className="h-3 w-3" />
            ガイド開始
          </button>
        )}
      </div>

      {/* サマリー */}
      {totalWaitTime > 0 && (
        <div className="mb-4 rounded-xl bg-white/50 p-3 text-sm text-slate-700">
          <span className="font-medium text-blue-700">💡 ヒント：</span>
          {' '}全体で約{totalWaitTime}分の待ち時間を並行作業に活用できます
        </div>
      )}

      {/* タイムライン */}
      <div className="space-y-1">
        {sortedSections.map((section, index) => {
          const hasWait = section.waitTime && section.waitTime > 0;
          const nextSection = sortedSections[index + 1];
          
          return (
            <React.Fragment key={section.id}>
              {/* メインセクション */}
              <div className="flex items-stretch gap-3">
                {/* ステップ番号 */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600 shadow-sm border border-blue-200">
                    {section.step}
                  </div>
                  {index < sortedSections.length - 1 && (
                    <div className="flex-1 w-0.5 bg-blue-200 my-1" />
                  )}
                </div>

                {/* コンテンツ */}
                <div className="flex-1 pb-3">
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          {section.areaName}
                        </h4>
                        {section.parallelTip && (
                          <p className="mt-1 text-xs text-slate-600">
                            {section.parallelTip}
                          </p>
                        )}
                      </div>
                      {hasWait && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          <Clock className="h-3 w-3" />
                          {section.waitTime}分待ち
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 並行作業ヒント */}
                  {hasWait && section.waitAction && nextSection && (
                    <div className="mt-2 flex items-center gap-2 ml-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-700 whitespace-nowrap">
                        <ArrowRight className="h-3 w-3" />
                        {section.waitAction}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* フッター */}
      <div className="mt-4 pt-3 border-t border-blue-200/50">
        <p className="text-xs text-slate-500 text-center">
          📝 待ち時間を活用して効率よく進めましょう
        </p>
      </div>
    </section>
  );
};

export default ExecutionGuide;
