// GuidePage.tsx - 使い方タブ
import React, { useState } from 'react';
import HeroSection from './HeroSection';
import FlowSection from './FlowSection';
import FrequencyInfoSection from './FrequencyInfoSection';
import CollapsibleSection from './CollapsibleSection';
import InfographicGuideSection from './InfographicGuideSection';

const GuidePage: React.FC = () => {
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

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
            <img
              src="/branding-kirei-flow-steps.jpeg"
              alt="KireiRoutine Flow Steps"
              className="w-full max-w-[700px] rounded-3xl shadow-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setZoomedImage({ src: '/branding-kirei-flow-steps.jpeg', alt: 'KireiRoutine Flow Steps' })}
            />
          </div>
        </CollapsibleSection>

        {/* 頻度の説明 */}
        <FrequencyInfoSection />

        {/* インフォグラフィック */}
        <InfographicGuideSection 
          onImageClick={(src, alt) => setZoomedImage({ src, alt })}
        />
      </div>

      {/* 画像ズームオーバーレイ */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-2 sm:p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="flex flex-col items-center">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="w-auto h-auto max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 text-white/70 text-xs">タップで閉じる</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default GuidePage;
