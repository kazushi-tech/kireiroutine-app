# Kazushi Portfolio

Personal portfolio site for showcasing projects and skills.

## Tech Stack
- Vite + React + TypeScript
- React Router
- Tailwind CSS

## Getting Started (Local)
```bash
npm install
npm run dev
```

Open: http://localhost:5173

## Build
```bash
npm run build
npm run preview -- --host
```

<<<<<<< HEAD
## Deploy (Vercel)
This repo is connected to Vercel. Pushing to main triggers a production deployment.
=======
## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## iPhone 実機確認（Vercel デプロイなし）

Mac と iPhone を同一 Wi-Fi に接続し、ローカルでアプリを検証できます。

### 手順

1. **Mac のローカル IP を確認**

   ```bash
   ipconfig getifaddr en0
   # 例: 192.168.1.100
   ```

2. **LAN 公開で dev サーバーを起動**

   ```bash
   npm run dev -- --host 0.0.0.0 --port 5174
   ```

3. **iPhone からアクセス**
   - Safari で `http://192.168.1.100:5174/calendar` を開く
   - （Mac の IP は手順 1 で確認した値に置き換え）

### うまくいかない場合

- **同一 Wi-Fi 確認**: Mac と iPhone が同じネットワークに接続されているか確認
- **ファイアウォール**: Mac のセキュリティで Vite のポート（5174）がブロックされていないか確認
  - システム設定 > ファイアウォール > オプション > Node.js を許可
- **ポート変更**: ポートが使用中の場合は `--port 5175` などに変更
- **PWA/キャッシュ**: 表示が古い場合はプライベートブラウズやキャッシュクリアを試す

### 本番ビルド差分確認（preview）

```bash
npm run build && npm run preview -- --host 0.0.0.0 --port 4173
```

iPhone からアクセス: `http://<MacのIP>:4173/calendar`

## Vercel での確認（本番環境）

### プレビュー確認（PR/ブランチ）

- PR を作成すると自動的にプレビュー URL が生成されます
- iPhone からプレビュー URL にアクセスして確認

### 本番確認

- main ブランチにマージすると本番反映
- 本番 URL: https://kireiroutine.vercel.app/calendar （※実際の URL は環境による）

## Deployment (Netlify)

This project is configured for automatic deployment to Netlify.

### Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

When you push changes to the repository, Netlify will automatically build and deploy the new version.
>>>>>>> 4ed9a16 (fix(calendar): iOS実機対策とモバイルUX改善)
