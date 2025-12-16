import React from 'react';

interface GuideItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const guideItems: GuideItem[] = [
  {
    id: 'overview',
    title: '① KireiRoutineってどんなアプリ？',
    description:
      '週1のエリアを決めて、15〜20分だけ掃除して、次回日をカレンダーに入れて回していく「がんばりすぎない掃除ルーティン」をまとめた全体図です。',
    imageSrc: '/kireiroutine-infographic-01-overview.jpeg',
    imageAlt: 'KireiRoutine全体の流れの図',
  },
  {
    id: 'home',
    title: '② ホーム画面の見方',
    description:
      '「今日の掃除」「今日の掃除タスク」「KireiRoutineの流れ」など、ホーム画面で何が見えるかを説明する図です。まずここを見れば今日やることがわかります。',
    imageSrc: '/kireiroutine-infographic-02-home.jpeg',
    imageAlt: 'ホーム画面の見方の図',
  },
  {
    id: 'frequency-tabs',
    title: '③ 掃除のタイプ・頻度タブ',
    description:
      'メイン掃除・ちょい重め掃除・リセット掃除・大掃除クラスと、週1／2週間に1回／月1／3ヶ月・半年・年1といった頻度タブの関係をまとめています。',
    imageSrc: '/kireiroutine-infographic-03-frequency-tabs.jpeg',
    imageAlt: '掃除のタイプと頻度タブの関係図',
  },
  {
    id: 'area-cards',
    title: '④ エリアカードの見方',
    description:
      '「寝室・ベッド周り」「キッチン」などのカードで、チェックリスト件数・前回日・次回日・おすすめ道具タグの意味を説明する図です。',
    imageSrc: '/kireiroutine-infographic-04-area-cards.jpeg',
    imageAlt: 'エリアカードの見方の図',
  },
  {
    id: 'calendar',
    title: '⑤ カレンダー画面の使い方',
    description:
      'カレンダーに表示される「次回予定」「実施済み」の色や、日付をタップしたときの詳細モーダルなど、カレンダー画面の見方をまとめています。',
    imageSrc: '/kireiroutine-infographic-05-calendar.jpeg',
    imageAlt: 'カレンダー画面の使い方の図',
  },
];

interface InfographicGuideSectionProps {
  onImageClick?: (src: string, alt: string) => void;
}

const InfographicGuideSection: React.FC<InfographicGuideSectionProps> = ({
  onImageClick,
}) => {
  return (
    <div className="space-y-10 lg:space-y-12">
        {guideItems.map((item) => (
          <article
            key={item.id}
            className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10"
          >
            {/* 左側：テキスト */}
            <div className="w-full lg:w-2/5 text-center lg:text-left space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* 右側：画像 */}
            <div className="w-full lg:w-3/5 flex flex-col items-center">
              {onImageClick ? (
                <button
                  type="button"
                  onClick={() => onImageClick(item.imageSrc, item.imageAlt)}
                  className="w-full max-w-[520px] mx-auto rounded-3xl focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all active:scale-[0.98]"
                  aria-label={`${item.imageAlt}を拡大表示`}
                >
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-3xl shadow-md object-contain hover:opacity-90 transition-opacity"
                  />
                </button>
              ) : (
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[520px] mx-auto rounded-3xl shadow-md object-contain"
                />
              )}
              {onImageClick && (
                <p className="text-xs text-slate-500 mt-2">※ タップで拡大</p>
              )}
            </div>
          </article>
        ))}
    </div>
  );
};

export default InfographicGuideSection;
