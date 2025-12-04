import React from 'react';

interface HeroSectionProps {
  onStartClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-6 lg:gap-14 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100">
      {/* 左側: テキスト + ボタン */}
      <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            今日の掃除、<br className="lg:hidden" />ここからはじめよう
          </h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            週1のエリアを選んで、<br className="hidden lg:inline" />
            チェックリストにそって15〜20分だけ
          </p>
        </div>
        
        <button
          onClick={onStartClick}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          週1の掃除をはじめる
        </button>
      </div>

      {/* 右側: 画像 */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src="/branding-kirei-hero-today.jpeg"
          alt="今日の掃除、ここからはじめよう"
          className="w-full max-w-[480px] h-auto rounded-3xl shadow-md object-contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;
