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