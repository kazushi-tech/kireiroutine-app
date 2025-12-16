import React from 'react';

const FlowSection: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-14 rounded-3xl bg-[#fdf5ec] p-6 sm:p-8 shadow-sm">
      {/* 左側: テキスト */}
      <div className="w-full lg:w-2/5 space-y-3 text-center lg:text-left">
        <h2 className="text-lg font-bold text-slate-900">KireiRoutine の流れ</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          週1のエリアを選んで掃除 → 次回日を決めて → 1週間後にまたここから。<br className="hidden lg:inline" />
          このサイクルを回すだけで、お部屋がキレイに保てます。
        </p>
        <p className="text-xs text-slate-500 hidden lg:block">
          → 右のイラストで流れをチェック
        </p>
        <p className="text-xs text-slate-500 lg:hidden">
          ↓ 下のイラストで流れをチェック
        </p>
      </div>

      {/* 右側: 画像 */}
      <div className="w-full lg:w-3/5 flex justify-center lg:justify-end">
        <img
          src="/branding-kirei-flow-steps.jpeg"
          alt="KireiRoutine Flow Steps"
          className="w-full max-w-[520px] rounded-3xl shadow-md object-contain"
        />
      </div>
    </section>
  );
};

export default FlowSection;
