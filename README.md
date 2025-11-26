<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KireiRoutine - 掃除ルーティン管理アプリ

掃除のルーティンを頻度別（週1、月1など）に管理できるアプリケーションです。

View your app in AI Studio: https://ai.studio/apps/drive/18lQn0w7miTqFAq6JP2j1UsPt1occY_eO

## 画像の管理について

画像ファイルは `public/images` ディレクトリ以下に配置し、`constants.ts` の `IMAGE_URLS` でパスを管理しています。
新しいエリアを追加する場合は、対応する画像を `public/images` に追加し、`constants.ts` に登録してください。

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
