import React from 'react';
import ProjectDetailLayout from '../components/ProjectDetailLayout';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { kireiRoutineImages } from '../data/projectImages';

// Import local assets for ones not yet moved to public (keeping existing logic for fallbacks)
import lifeRoutineHubBright from '../assets/projects/concept-visuals/life-routine-hub-bright.png';
import responsiveDashboard from '../assets/projects/concept-visuals/responsive-dashboard-multi-device.jpeg';
import kireiroutineThumb from '../assets/projects/kireiroutine-thumb.png';

const KireiRoutinePage: React.FC = () => {
  useDocumentHead({
    title: 'KireiRoutine - 掃除ルーティン管理PWA',
    description: '個人の掃除ルーティンを「見える化」して続けやすくするPWA。React × TypeScript × TailwindCSS で構築。',
  });

  return (
    <ProjectDetailLayout
      name="KireiRoutine"
      subtitle="掃除ルーティン管理PWA"
      status="completed"
      coverImage={{
        src: kireiRoutineImages.dashboard,
        alt: 'KireiRoutine ダッシュボード画面',
      }}
      projectType="Personal tool / PWA"
      role="Product Designer, Frontend Engineer"
      period="2024–2025"
      tools={['Vite', 'React', 'TypeScript', 'TailwindCSS', 'PWA']}
      metrics={[
        { label: '運用期間', value: '1年' },
        { label: 'Lighthouse', value: '95+' },
        { label: 'Tasks', value: '40+' },
      ]}
      liveUrl="https://kireiroutine-app.vercel.app/"
      summary={{
        problem: '掃除タスクの「いつやったか」「次はいつか」を忘れて抜け漏れが発生していた',
        solution: 'カレンダーベースのタスク管理UIをPWAで構築、頻度設定で自動スケジュール',
        impact: '1年運用で週次タスクの抜け漏れゼロ、ルーティン定着率が大幅向上',
      }}
      keyScreens={[
        {
          src: kireiRoutineImages.dashboard,
          alt: 'ダッシュボード画面',
          title: 'ダッシュボード',
          caption: '今日・今週のタスクを一覧表示。完了チェックでルーティン管理。',
        },
        {
          src: lifeRoutineHubBright,
          alt: 'カレンダービュー',
          title: 'カレンダービュー',
          caption: '月次ビューでタスク予定を俯瞰。ドラッグで日付変更可能。',
        },
        {
          src: responsiveDashboard,
          alt: 'マルチデバイス対応',
          title: 'レスポンシブ対応',
          caption: 'PC・タブレット・スマホで同じ体験。PWAでホーム画面追加可能。',
        },
      ]}
      features={[
        {
          title: 'カレンダーベースのタスク管理',
          description: '日/週/月単位でタスクを可視化。いつ何をやるかが一目で分かる。',
          bullets: [
            'ドラッグ&ドロップで日付変更',
            '完了チェックでルーティン記録',
            '過去の履歴も確認可能',
          ],
          image: {
            src: lifeRoutineHubBright,
            alt: 'カレンダーUI',
          },
        },
        {
          title: '頻度ベース自動スケジュール',
          description: '毎日/週次/月次など頻度を設定すると、次回予定日を自動計算。',
          bullets: [
            '頻度設定で自動リマインド',
            'やり忘れ防止',
            '柔軟なスケジュール調整',
          ],
          image: {
            src: kireiRoutineImages.dashboard,
            alt: '設定画面',
          },
        },
        {
          title: 'PWA対応',
          description: 'オフライン動作、ホーム画面追加でネイティブアプリ感覚。',
          bullets: [
            'スマホからサッとアクセス',
            'オフラインでも操作可能',
            'プッシュ通知対応予定',
          ],
          image: {
            src: kireiroutineThumb,
            alt: 'PWA',
          },
        },
      ]}
      process={[
        {
          step: '要件整理',
          description: '自分の掃除ルーティン（毎日/週次/月次）を洗い出し、必要機能を決定。',
        },
        {
          step: 'UI生成 → 手動リファイン',
          description: 'Antigravity で初期UIを高速生成し、手動で調整。',
        },
        {
          step: 'カレンダー/タスク機能実装',
          description: 'カレンダーUI、タスク登録・完了、頻度設定を実装。',
        },
        {
          step: '1年運用・改善',
          description: '毎週使いながらUI改善・バグ修正を継続。',
        },
      ]}
      outcome={{
        results: '週次タスクの抜け漏れがゼロに。ルーティンが完全に定着し、ポートフォリオ兼実用ツールとして公開中。',
        learnings: [
          '自分が使うツールは継続的なフィードバックが得られる',
          'PWA対応でスマホからサッとアクセスできる体験が重要',
          'Antigravity × 手動リファインの組み合わせが効率的',
        ],
      }}
      gallery={[
        {
          id: 'dashboard',
          src: kireiRoutineImages.dashboard,
          alt: 'ダッシュボード',
          title: 'Dashboard',
          caption: 'メインダッシュボード画面',
        },
        {
          id: 'calendar',
          src: lifeRoutineHubBright,
          alt: 'カレンダー',
          title: 'Calendar View',
          caption: 'カレンダービュー',
        },
        {
          id: 'multi',
          src: responsiveDashboard,
          alt: 'マルチデバイス',
          title: 'Multi-device',
          caption: 'レスポンシブデザイン',
        },
        {
          id: 'pwa',
          src: kireiroutineThumb,
          alt: 'PWA',
          title: 'PWA / Mobile',
          caption: 'モバイル体験',
        },
      ]}
      prevProject={{ name: 'Concept Visuals', url: '/projects/concept-visuals' }}
      nextProject={{ name: "Urban Grind", url: '/projects/urban-grind' }}
    />
  );
};

export default KireiRoutinePage;
