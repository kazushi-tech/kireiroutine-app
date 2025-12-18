import React from 'react';

interface InfographicCardProps {
  src: string;
  alt: string;
  label?: string;
}

/**
 * InfographicCard
 * - プレビュー表示 + タップで拡大（モーダル）
 * - 新規依存なし（React stateのみ）
 */
const InfographicCard: React.FC<InfographicCardProps> = ({ src, alt, label }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // モーダルを開く
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ESCキーでモーダルを閉じる
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // フォーカスを閉じるボタンに移動
      closeButtonRef.current?.focus();
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      {/* プレビューカード */}
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h2 className="text-base font-bold text-slate-900">
            {label || '最短攻略図'}
          </h2>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          一目で流れを把握 → 下のチェックで実行
        </p>

        {/* プレビュー画像 */}
        <button
          type="button"
          onClick={openModal}
          className="group relative w-full overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all"
          aria-label={`${alt}を拡大表示`}
        >
          <div className="relative max-h-[400px] overflow-hidden">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="w-full object-cover object-top transition-transform group-hover:scale-[1.02]"
            />
            {/* フェードオーバーレイ（下部） */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 to-transparent" />
          </div>
          
          {/* 拡大ボタン */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-colors group-hover:bg-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M13.28 7.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 001.06 1.06zM2 17.25v-4.5a.75.75 0 011.5 0v2.69l3.22-3.22a.75.75 0 011.06 1.06L4.56 16.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zM12.22 13.28l3.22 3.22h-2.69a.75.75 0 000 1.5h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-1.5 0v2.69l-3.22-3.22a.75.75 0 10-1.06 1.06z" />
              </svg>
              拡大して見る
            </span>
          </div>
        </button>
      </section>

      {/* モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          {/* 閉じるボタン */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>

          {/* 画像 */}
          <div
            className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="block max-h-[85vh] w-auto object-contain"
              loading="eager"
            />
          </div>

          {/* 閉じるヒント */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg">
            タップまたは ESC で閉じる
          </p>
        </div>
      )}
    </>
  );
};

export default InfographicCard;
