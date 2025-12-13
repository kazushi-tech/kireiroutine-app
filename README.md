<div align="center">
  <!-- ロゴやバナー画像があればここに配置 -->
  <img width="1200" height="475" alt="KireiRoutine" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KireiRoutine - 掃除ルーティン管理PWA

掃除タスクを頻度別（例：週1 / 月1 / 3日ごと）に管理し、次回予定日を自動で把握できる個人用PWAです。

| Link | URL |
|:-|:-|
| **Live Demo (Vercel)** | [https://kireiroutine-app.vercel.app/](https://kireiroutine-app.vercel.app/) |
| **Repository** | [https://github.com/kazushi-tech/kireiroutine-app](https://github.com/kazushi-tech/kireiroutine-app) |

## 主な機能

<div align="center">
  <img src="https://github.com/user-attachments/assets/092a65fd-cd5b-42e4-afe6-95e23f013dfb" winth="45%" alt="Feature 1" />
  <img src="https://github.com/user-attachments/assets/de4ad223-a1f9-4bcf-a035-7ea61bac4773" width="45%" alt="Feature 2" />
</div>

- **Dashboard / Check**: 今日やるタスクを一覧 → ワンタップで完了
- **Visual Calendar**: 予定と実績をカレンダーで可視化（ドラッグでの調整も可能）
- **Offline First**: PWA + Service Worker (Workbox) により、オフラインでも完全動作
- **Local Persistence**: Recoil-persist を使用し、ローカルストレージでデータを永続化

## Tech Stack

- **Frontend**: Vite, React, TypeScript, TailwindCSS
- **State Management**: Recoil
- **PWA**: Workbox

## 画像の管理について

本プロジェクトでは画像を `public/images` に配置し、`src/constants.ts` 内の `IMAGE_URLS` 定数にて参照先を一元管理しています。
新しい画像を使用する場合は、ファイルを配置後、定数ファイルに追加してください。

## Run Locally

Prerequisites: Node.js

```bash
npm install
npm run dev
