import React from 'react';
import ProjectDetailLayout from '../components/ProjectDetailLayout';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { urbanGrindImages } from '../data/projectImages';

const UrbanGrindPage: React.FC = () => {
  useDocumentHead({
    title: "Kazushi's Urban Grind - コンセプトカフェサイト",
    description: '「もし自分がカフェを開くなら」を形にしたコンセプトサイト。Vite × React × TailwindCSS で構築。',
  });

  return (
    <ProjectDetailLayout
      name="Kazushi's Urban Grind"
      subtitle="コンセプトカフェサイト"
      status="completed"
      coverImage={{
        src: urbanGrindImages.hero,
        alt: 'Urban Grind カフェサイト',
      }}
      projectType="Concept website"
      role="Designer, Frontend Engineer"
      period="2024"
      tools={['Vite', 'React', 'TypeScript', 'TailwindCSS', 'Vercel']}
      metrics={[
        { label: 'Pages', value: '1' },
        { label: 'Sections', value: '5' },
        { label: 'Build', value: '3日' },
      ]}
      liveUrl="https://urban-grind-site.vercel.app/"
      summary={{
        problem: '架空のカフェでも「行ってみたい」と思わせるリアリティと空気感が必要だった',
        solution: '自然光と都会の洗練された雰囲気をWebデザインで表現、1ページ完結の構成',
        impact: 'デザインの引き出しとして活用、ポートフォリオの差別化に貢献',
      }}
      keyScreens={[
        {
          src: urbanGrindImages.hero,
          alt: 'メインビジュアル',
          title: 'Hero Section',
          caption: '洗練されたカフェ空間を表現するメインビジュアル。',
        },
        {
          src: urbanGrindImages.menu,
          alt: 'メニュー',
          title: 'Menu & Latte Art',
          caption: 'コーヒー・デザートを視覚的に魅力的に伝えるカードレイアウト。',
        },
        {
          src: urbanGrindImages.interior,
          alt: '店内イメージ',
          title: 'Atmosphere',
          caption: 'ハンドドリップの温かみと居心地の良い空間を表現。',
        },
      ]}
      features={[
        {
          title: '洗練された世界観',
          description: '都会の喧騒を忘れさせる、開放的なカフェ空間をWeb上で表現。',
          bullets: [
            '清潔感のあるデザイン',
            '魅力的な写真選定',
            '余白を活かしたミニマルレイアウト',
          ],
          image: {
            src: urbanGrindImages.hero,
            alt: 'インテリア',
          },
        },
        {
          title: 'メニュー＆ギャラリー',
          description: '自慢のコーヒーやデザートを魅力的に紹介。店舗の空気感を伝えるギャラリー。',
          bullets: [
            'カード形式のメニュー表示',
            'ホバーエフェクトでインタラクション',
            '食欲をそそる写真配置',
          ],
          image: {
            src: urbanGrindImages.menu,
            alt: 'ラテアート',
          },
        },
        {
          title: 'オーナーメッセージ',
          description: '「都会の喧騒を忘れて、丁寧に淹れた一杯でリセット」のコンセプトを訴求。',
          bullets: [
            'ストーリー性のあるコピー',
            'ブランドアイデンティティの確立',
            '訪問者への共感ポイント',
          ],
          image: {
            src: urbanGrindImages.features,
            alt: 'カウンター詳細',
          }
        },
      ]}
      process={[
        {
          step: 'コンセプト設計',
          description: '「都会のオアシス」をテーマに、リラックスできる世界観を設定。',
        },
        {
          step: 'Antigravity → TailwindCSS',
          description: '初期構築からカスタマイズ。洗練されたタイポグラフィと配色を適用。',
        },
        {
          step: 'コンテンツ整備',
          description: 'メニュー写真、店舗情報、オーナーメッセージを作成・選定。',
        },
        {
          step: 'デプロイ',
          description: 'Vercel にデプロイし公開。',
        },
      ]}
      outcome={{
        results: '実在しない店舗ながら、行きたくなるようなリアリティと空気感を実現。Webデザイン表現の幅を広げた。',
        learnings: [
          '写真のトーン＆マナーがサイト全体の印象を決定づける',
          'シンプルなレイアウトこそ、余白や文字組のバランスが重要',
          'コンセプトに合わせた素材選定の重要性',
        ],
      }}
      gallery={[
        {
          id: 'hero',
          src: urbanGrindImages.hero,
          alt: 'Hero',
          title: 'Site Hero',
          caption: 'メインビジュアル',
        },
        {
          id: 'menu',
          src: urbanGrindImages.menu,
          alt: 'Menu',
          title: 'Menu',
          caption: 'メニューセクション',
        },
        {
          id: 'interior',
          src: urbanGrindImages.interior,
          alt: 'Interior',
          title: 'Interior',
          caption: 'インテリア',
        },
        {
          id: 'features',
          src: urbanGrindImages.features,
          alt: 'Features',
          title: 'Details',
          caption: '店舗詳細',
        },
      ]}
      prevProject={{ name: 'KireiRoutine', url: '/projects/kireiroutine' }}
      nextProject={{ name: 'AI News Bot', url: '/projects/ai-news-bot' }}
    />
  );
};

export default UrbanGrindPage;
