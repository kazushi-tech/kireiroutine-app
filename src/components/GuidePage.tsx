// GuidePage.tsx - 使い方タブ
import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from './HeroSection';
import FlowSection from './FlowSection';
import FrequencyInfoSection from './FrequencyInfoSection';
import CollapsibleSection from './CollapsibleSection';
import InfographicGuideSection from './InfographicGuideSection';
import { X } from 'lucide-react';

const GuidePage: React.FC = () => {
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  // ESCキーでモーダルを閉じる
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && zoomedImage) {
      setZoomedImage(null);
    }
  }, [zoomedImage]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // モーダル表示時にスクロールを無効化
  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [zoomedImage]);

  return (
    <main className="min-h-screen bg-[#f7f1e7] page-content">
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* ヘッダー */}
        <header className="text-center py-4">
          <h1 className="text-2xl font-bold text-slate-900">📖 使い方ガイド</h1>
          <p className="text-sm text-slate-600 mt-1">
            KireiRoutineの使い方と掃除ルーティンの流れ
          </p>
        </header>

        {/* Hero */}
        <HeroSection />

        {/* ルーティンの流れ */}
        <CollapsibleSection
          title="KireiRoutine の流れ"
          subtitle=""
          storageKey="kireiRoutine-flow-section-open"
          defaultOpen={true}
        >
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setZoomedImage({ src: '/branding-kirei-flow-steps.jpeg', alt: 'KireiRoutine Flow Steps' })}
              className="w-full max-w-[700px] rounded-3xl focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all active:scale-[0.98]"
              aria-label="KireiRoutine Flow Stepsを拡大表示"
            >
              <img
                src="/branding-kirei-flow-steps.jpeg"
                alt="KireiRoutine Flow Steps"
                loading="lazy"
                decoding="async"
                className="w-full rounded-3xl shadow-md object-contain hover:opacity-90 transition-opacity"
              />
            </button>
            <p className="text-xs text-slate-500 mt-2">※ タップで拡大</p>
          </div>
        </CollapsibleSection>

        {/* 頻度の説明 */}
        <FrequencyInfoSection />

        {/* インフォグラフィック */}
        <InfographicGuideSection 
          onImageClick={(src, alt) => setZoomedImage({ src, alt })}
        />
      </div>

      {/* 画像ズームモーダル（改善版） */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-2 sm:p-4"
          onClick={() => setZoomedImage(null)}
        >
          {/* 閉じるボタン */}
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="閉じる"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col items-center max-h-full overflow-auto">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="w-auto h-auto max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 text-white/70 text-xs">タップまたはESCで閉じる</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default GuidePage;

