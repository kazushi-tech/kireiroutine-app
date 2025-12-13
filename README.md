<div align="center">
  <img width="1200" height="475" alt="KireiRoutine" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KireiRoutine - 掃除ルーティン管理PWA

掃除タスクを頻度別（例：週1 / 月1 / 3日ごと）に管理し、次回予定日を自動で把握できる個人用PWAです。

- **Live Demo（Vercel）**: https://kireiroutine-app.vercel.app/
- **Repository**: https://github.com/kazushi-tech/kireiroutine-app

## 主な機能

<img width="900" alt="Main screen" src="https://github.com/user-attachments/assets/fea8f32-f72b-4e9f-8fd0-02cc1852d2b" />

- **Dashboard / Check**：今日やるタスクを一覧 → ワンタップで完了
- **Visual Calendar**：予定と実績をカレンダーで可視化（調整も可能）
- **Offline First**：PWA + Service Worker でオフラインでも利用
- **Local Persistence**：![freepik__vertical-45-aspect-ratio-1080x1350-high-resolution__77498](https://github.com/user-attachments/assets/8e2f3042-6551-49a9-a064-e2e72e49bde0)
ローカルに保存して軽快に運用

## Tech Stack
- Vite / React / TypeScript / TailwindCSS
- Recoil（状態管理）
- Workbox（Service Worker）

## 画像の管理
画像は `public/images` に配置し、`constants.ts` の `IMAGE_URLS` で参照先を管理しています。  
新しい画像を追加する場合は、画像追加 → `IMAGE_URLS` に登録してください。

## Run Locally
Prerequisites: Node.js

```bash
npm install
npm run dev
