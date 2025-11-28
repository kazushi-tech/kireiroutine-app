// SectionDetailPage.tsx
import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CLEANING_DATA, IMAGE_URLS } from './constants';
import { MANUAL_SECTIONS, ManualSection } from './manualData';
import { Frequency, SectionMeta } from './types';
import { 
  loadSectionMetaMap, 
  saveSectionMetaMap, 
  formatDateForDisplay,
  updateSectionMeta,
  getTodayDateString,
  getNextDueDateFromToday
} from './sectionMetaStorage';

const SectionDetailPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const [meta, setMeta] = React.useState<SectionMeta>({});
  const [metaMapLoaded, setMetaMapLoaded] = React.useState(false);

  // 初回ロード
  React.useEffect(() => {
    const map = loadSectionMetaMap();
    if (sectionId && map[sectionId]) {
      setMeta(map[sectionId]);
    }
    setMetaMapLoaded(true);
  }, [sectionId]);

  // メタ情報更新ヘルパー
  const updateMeta = (updater: (prev: SectionMeta) => SectionMeta) => {
    if (!sectionId) return;
    setMeta((prev) => {
      const newMeta = updater(prev);
      const map = loadSectionMetaMap();
      map[sectionId] = newMeta;
      saveSectionMetaMap(map);
      return newMeta;
    });
  };

  // ステップ進捗計算
  const completedSteps = meta.completedSteps ?? [];
  const toggleStep = (order: number) => {
    updateMeta((prev) => {
      const current = prev.completedSteps ?? [];
      const isCompleted = current.includes(order);
      const next = isCompleted
        ? current.filter((o) => o !== order)
        : [...current, order];
      return { ...prev, completedSteps: next };
    });
  };

  // 完了ボタン
  const handleCompleteSection = () => {
    if (!manual || !sectionId) return;
    
    const today = getTodayDateString();
    const nextDue = getNextDueDateFromToday(manual.frequency);
    
    // Update local state
    updateMeta((prev) => {
      const allStepOrders = manual.steps.map((s) => s.order);
      return {
        ...prev,
        lastDoneAt: new Date().toISOString(), // Keep legacy field for now
        lastDoneDate: today,
        nextDueDate: nextDue,
        completedSteps: allStepOrders,
      };
    });
    
    // Also use the new utility to ensure persistence (though updateMeta does it too via effect, 
    // but let's be safe and explicit or rely on updateMeta wrapper if I changed it to use the utility?
    // Actually updateMeta in this component uses setMeta -> useEffect -> saveSectionMetaMap.
    // So updating state is enough.
    // But I should also update the legacy fields if I want to keep them in sync?
    // The user requirement says "lastDoneDate and nextDueDate are automatically updated".
  };



  const manual: ManualSection | undefined =
    sectionId != null ? MANUAL_SECTIONS[sectionId] : undefined;

  // CLEANING_DATA から該当セクションを探して画像キーを取得
  const relatedSection = React.useMemo(() => {
    if (!sectionId) return undefined;
    for (const category of CLEANING_DATA) {
      const found = category.sections.find((s) => s.id === sectionId);
      if (found) return found;
    }
    return undefined;
  }, [sectionId]);

  const heroImageSrc =
    relatedSection && IMAGE_URLS[relatedSection.imageKey]
      ? IMAGE_URLS[relatedSection.imageKey]
      : undefined;

  // データが見つからない場合
  if (!manual) {
    return (
      <main className="min-h-screen bg-[#f7f1e7] px-4 py-6">
        <div className="mx-auto max-w-xl space-y-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-medium text-amber-700 underline underline-offset-2"
          >
            ← 一覧に戻る
          </button>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h1 className="mb-2 text-lg font-semibold text-slate-900">
              掃除マニュアルが見つかりませんでした
            </h1>
            <p className="mb-3 text-sm text-slate-700">
              一度ホーム画面に戻って、もう一度セクションを選んでください。
            </p>
            <Link
              to="/"
              className="inline-flex text-sm font-medium text-amber-700 underline underline-offset-2"
            >
              ホーム（掃除ルーティン一覧）へ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e7] px-4 pb-32 pt-4 text-slate-900 sm:px-6 sm:pb-16 sm:pt-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* 戻る */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="self-start text-xs font-medium text-amber-700 underline underline-offset-2"
        >
          ← 一覧に戻る
        </button>

        {/* ヒーロー＋基本情報 */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-md">
          {heroImageSrc && (
            <div className="aspect-[16/9] w-full overflow-hidden sm:aspect-video">
              <img
                src={heroImageSrc}
                alt={manual.areaName}
                className="h-40 w-full object-cover sm:h-56 md:h-64"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-4 p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    {manual.frequencyLabel}
                  </span>
                  <span className="text-xs font-medium text-amber-700">
                    目安: {manual.durationText}
                  </span>
                </div>
                <h1 className="text-2xl font-bold leading-tight md:text-3xl">
                  {manual.areaName}
                </h1>
              </div>

              {/* メタ情報ヘッダー */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 sm:flex-col sm:items-end sm:gap-0">
                <span>前回: {formatDateForDisplay(meta.lastDoneDate || meta.lastDoneAt, '未実施')}</span>
                <span>
                  次回目安: {formatDateForDisplay(meta.nextDueDate || meta.nextPlannedAt, '未定')}
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-700">
              {manual.frequency === Frequency.Weekly
                ? '週1ルーティンの中でも、このエリアだけを単独で回せるようにした詳細マニュアル。'
                : `${manual.frequencyLabel}のルーティンとして、このエリアを重点的にケアするための詳細マニュアル。`}
              所要時間の目安内で終わることを前提に、「やることの順番」がわかりやすいように並べています。
            </p>
          </div>
        </section>

        {/* 準備するもの＋メモ */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-slate-900">
              準備するもの
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
              {manual.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="mb-2 text-base font-bold text-orange-800">
                ざっくりイメージ
              </p>
              <p className="text-sm leading-relaxed text-slate-800">
                {manual.frequency === Frequency.Weekly
                  ? '「片付け → 表面を整える → 床・足元を仕上げる」の順に動く前提でステップを並べています。'
                  : '作業の手戻りがないよう、効率的な順序でステップを構成しています。'}
                タイマーを{manual.durationText}にセットして、1ステップずつ淡々と進める想定です。
              </p>
            </div>

            {manual.notes && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
                <p className="mb-1 font-bold text-slate-700">
                  メモ
                </p>
                <p className="whitespace-pre-line">{manual.notes}</p>
              </div>
            )}
          </div>
        </section>

        {/* 手順リスト */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                手順（チェックしながら進める想定）
              </h2>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
                {manual.steps.length} ステップ
              </span>
            </div>
            {manual.steps.length > 0 && (
              <span className="text-xs font-medium text-slate-600">
                {completedSteps.length} / {manual.steps.length} (
                {Math.round((completedSteps.length / manual.steps.length) * 100)}%)
              </span>
            )}
          </div>

          {/* 進捗バー */}
          {manual.steps.length > 0 && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-amber-500 transition-all duration-300 ease-out"
                style={{
                  width: `${Math.round(
                    (completedSteps.length / manual.steps.length) * 100
                  )}%`,
                }}
              />
            </div>
          )}

          <ol className="space-y-3">
            {manual.steps.map((step) => {
              const isChecked = completedSteps.includes(step.order);
              return (
                <li
                  key={step.order}
                  className={`rounded-2xl border transition-all duration-200 p-4 shadow-sm md:p-5 ${
                    isChecked
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-white border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox Button */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleStep(step.order)}
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-white border-slate-300 text-slate-400 hover:border-amber-400 hover:text-amber-400'
                      }`}
                    >
                      {isChecked ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{step.order}</span>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 space-y-1 pt-0.5">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          STEP {step.order}
                        </span>
                        {step.title && (
                          <h3
                            className={`text-sm font-bold ${
                              isChecked ? 'text-amber-900/80' : 'text-slate-900'
                            }`}
                          >
                            {step.title}
                          </h3>
                        )}
                      </div>
                      <p
                        className={`text-sm leading-relaxed whitespace-pre-line ${
                          isChecked ? 'text-amber-800/70' : 'text-slate-700'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 完了アクション & メモ */}
        <section className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:static sm:z-auto sm:space-y-6 sm:rounded-3xl sm:border-none sm:p-6 sm:shadow-sm">
          <div className="flex flex-col items-center gap-3 sm:border-b sm:border-slate-100 sm:pb-6">
            <button
              type="button"
              onClick={handleCompleteSection}
              className="w-full max-w-sm rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-95"
            >
              ✅ このセクションの掃除を完了
            </button>
            <p className="hidden text-xs text-slate-500 sm:block">
              前回実施日: {formatDateForDisplay(meta.lastDoneDate || meta.lastDoneAt, '未実施')}
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:mt-0 sm:gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                メモ
              </label>
              <textarea
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-amber-500 focus:ring-amber-500"
                rows={3}
                placeholder="気になったことや次回の注意点など"
                value={meta.note ?? meta.memo ?? ''}
                onChange={(e) =>
                  updateMeta((prev) => ({ ...prev, note: e.target.value, memo: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                次にやる予定日 (目安)
              </label>
              <input
                type="date"
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-amber-500 focus:ring-amber-500"
                value={meta.nextDueDate ?? (meta.nextPlannedAt ? meta.nextPlannedAt.split('T')[0] : '')}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  console.log('[SectionDetail] nextPlannedDate change', { sectionId, rawValue });
                  
                  try {
                    updateMeta((prev) => {
                      // Normalize input
                      if (!rawValue) {
                        return {
                          ...prev,
                          nextDueDate: null,
                          nextPlannedAt: undefined // Clear legacy field
                        };
                      }
                      
                      // Validate format YYYY-MM-DD
                      if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
                        console.warn('[SectionDetail] Invalid date format input', rawValue);
                        return prev; // Do nothing if invalid
                      }

                      // Safe ISO string conversion
                      let isoString: string | undefined;
                      try {
                        const d = new Date(rawValue);
                        if (!isNaN(d.getTime())) {
                          isoString = d.toISOString();
                        }
                      } catch (err) {
                        console.error('[SectionDetail] Date conversion error', err);
                      }

                      return {
                        ...prev,
                        nextDueDate: rawValue,
                        nextPlannedAt: isoString
                      };
                    });
                  } catch (error) {
                    console.error('[SectionDetail] Failed to update nextPlannedDate', error);
                  }
                }}
              />
              <p className="text-xs text-slate-500">
                設定しておくと、一覧画面などでリマインドに使えます
              </p>
            </div>
            
            {/* モバイル用前回実施日表示 */}
            <div className="sm:hidden text-center text-xs text-slate-500 mt-2">
               前回実施日: {formatDateForDisplay(meta.lastDoneDate || meta.lastDoneAt, '未実施')}
            </div>
          </div>
        </section>

        {/* 戻るリンク */}
        <div className="pt-2">
          <Link
            to="/"
            className="text-xs font-medium text-amber-700 underline underline-offset-2"
          >
            ホーム（掃除ルーティン一覧）へ戻る
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SectionDetailPage;
