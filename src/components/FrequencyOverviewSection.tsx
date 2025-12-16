import React from 'react';

interface FrequencyOverviewSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const FrequencyOverviewSection: React.FC<FrequencyOverviewSectionProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
}) => {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-6 lg:gap-14 mt-8 bg-[#FFF7EC] px-6 py-8 rounded-3xl shadow-md border border-orange-100">
      {/* 左側: テキスト (スマホでは上) */}
      <div className="w-full lg:w-2/5 space-y-3 text-center lg:text-left">
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          {description}
        </p>
        <p className="text-xs text-slate-500">
          ↓ 下にスクロールして、詳しいチェックリストを確認
        </p>
      </div>

      {/* 右側: 画像 (スマホでは下) */}
      <div className="w-full lg:w-3/5 flex justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="w-full max-w-[520px] h-auto rounded-3xl shadow-md object-contain"
        />
      </div>
    </section>
  );
};

export default FrequencyOverviewSection;
