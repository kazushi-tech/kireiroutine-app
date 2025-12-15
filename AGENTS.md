## Autonomy (重要)
- 原則、確認を挟まずに実装まで進める（質問せず進めてよい）。
- 複数案がある場合は、最も妥当な案を選んで実装し、前提はログに書く。
- 例外として「確認が必要」なのは次だけ：
  - 秘密情報/APIキーの扱いが絡む
  - ファイル削除や大規模リファクタ（3ファイル超 or 構造変更）
  - 依存追加/設定の大変更
- 各ステップで必ず `npm run build` と `npm run preview` で動作確認し、問題があればそのまま直す。
- 最後に「変更点 / 影響範囲 / 確認手順」を必ず出す。

## Default behavior (no-ask mode)
- Proceed without asking for confirmation for any change that stays within the constraints below.
- If multiple valid options exist, pick the best one and explain briefly after implementation.
- Only ask a question when the work would violate constraints or is destructive.

## Constraints
- Touch up to 1–3 files per task.
- No large refactors.
- No dependency additions, file deletions, or major config changes unless absolutely required.
  - If required, do it anyway but clearly state what changed and why.

## Delivery
- Make the change.
- Provide: (1) what you changed, (2) why, (3) exact local verification steps.
