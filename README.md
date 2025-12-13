<div align="center">
  <h1>KireiRoutine</h1>
  <p><strong>掃除ルーティン管理PWA</strong><br>
  掃除タスクを頻度別（例：週1 / 月1 / 3日ごと）に管理し、<br>次回予定日を自動で把握できる個人用アプリです。</p>

  <!-- Badges -->
  <a href="https://kireiroutine-app.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/kazushi-tech/kireiroutine-app">
    <img src="https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github" alt="Repository" />
  </a>
</div>

<br />

## 🌟 主な機能

<div align="center">
  <img src="https://github.com/user-attachments/assets/092a65fd-cd5b-42e4-afe6-95e23f013dfb" width="45%" alt="Calendar View" />
  <img src="https://github.com/user-attachments/assets/de4ad223-a1f9-4bcf-a035-7ea61bac4773" width="45%" alt="Feature Guide" />
</div>

- **Dashboard / Check**: 「今日やるべき掃除」だけを一覧表示 → ワンタップで完了。
- **Visual Calendar**: 予定と実績をカレンダーで可視化。ドラッグ&ドロップで予定調整も可能。
- **Offline First**: PWA + Service Worker により、電波のない場所でもサクサク動作。
- **Local Persistence**: データはローカルストレージに即時保存され、ログイン不要で使い続けられます。

## 🛠️ Tech Stack

- **Framework**: Vite, React, TypeScript
- **Styling**: TailwindCSS
- **State**: Recoil (with Persistence)
- **PWA**: Workbox

## 📁 画像の管理

画像は `public/images` に配置し、`src/constants.ts` 内の `IMAGE_URLS` で参照を管理しています。
追加時は画像を配置後、定数ファイルに登録してください。

## 🚀 Run Locally

```bash
npm install
npm run dev
