import React from 'react';

const FrequencyInfoSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900">掃除のタイプ</h2>
        <p className="mt-1 text-xs text-slate-600">
          メイン掃除・ちょい重め掃除・リセット掃除・大掃除クラスの4つにざっくり分けています
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <img
          src="/branding-kirei-frequency-cards.jpeg"
          alt="Cleaning Frequencies"
          className="h-auto w-full object-contain"
        />
      </div>
    </section>
  );
};

export default FrequencyInfoSection;
