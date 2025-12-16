/**
 * 掃除の頻度を表すEnum
 */
export enum Frequency {
  Weekly = 'Weekly',
  BiWeekly = 'BiWeekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  SemiAnnual = 'SemiAnnual',
  Annual = 'Annual',
}

/**
 * 個別の掃除タスク
 */
export interface CleaningTask {
  id: string;
  text: string;
}

/**
 * 掃除のエリア（セクション）
 * 例: キッチン、寝室など
 */
export interface CleaningSection {
  id: string;
  areaName: string;
  tasks: CleaningTask[];
  tools: string[]; // 必要な道具リスト
  imageKey: string; // constants.tsのIMAGE_URLSに対応するキー
  step: number; // 推奨実行順序
  parallelTip?: string; // このセクション作業中に並行でできること
  waitTime?: number; // このセクションで発生する待ち時間（分）
  waitAction?: string; // 待ち時間中に何をするか（例：「つけ置き中に→」）
}

/**
 * 頻度ごとのスケジュールカテゴリ
 */
export interface ScheduleCategory {
  frequency: Frequency;
  label: string; // 表示ラベル (例: "週1 (毎週)")
  description: string; // 説明文
  sections: CleaningSection[];
}

/**
 * セクションごとの進捗・メモ・予定などのメタ情報
 */
export interface SectionMeta {
  lastDoneAt?: string; // ISO 形式の日付 (Legacy)
  completedSteps?: number[]; // 完了したステップの order 配列
  memo?: string; // セクション専用メモ (Legacy)
  nextPlannedAt?: string; // 次回実施予定日 (ISO 形式) (Legacy)
  
  // New fields
  lastDoneDate?: string | null; // 'YYYY-MM-DD'
  nextDueDate?: string | null;  // 'YYYY-MM-DD'
  note?: string | null;         // memo
}

/**
 * 全セクションのメタ情報を管理するマップ
 * key: sectionId
 */
export type SectionMetaMap = Record<string, SectionMeta>;