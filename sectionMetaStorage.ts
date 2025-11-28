import { Frequency, SectionMeta, SectionMetaMap } from './types';

const SECTION_META_STORAGE_KEY = 'kireiroutine-section-meta-v1';

/**
 * localStorage からセクションメタ情報を読み込む
 */
export const loadSectionMetaMap = (): SectionMetaMap => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const json = localStorage.getItem(SECTION_META_STORAGE_KEY);
    if (!json) {
      return {};
    }
    return JSON.parse(json) as SectionMetaMap;
  } catch (error) {
    console.error('Failed to load section meta map:', error);
    return {};
  }
};

/**
 * セクションメタ情報を localStorage に保存する
 */
export const saveSectionMetaMap = (map: SectionMetaMap): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const json = JSON.stringify(map);
    localStorage.setItem(SECTION_META_STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save section meta map:', error);
  }
};

// --- New Utilities ---

// --- New Utilities ---

export const normalizeDateInput = (value: string | null | undefined): string | null => {
  if (!value) return null;
  // Simple regex check for YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    console.warn(`[sectionMetaStorage] Invalid date format: ${value}`);
    return null;
  }
  return value;
};

export const getAllSectionMeta = (): SectionMetaMap => {
  return loadSectionMetaMap();
};

export const getSectionMeta = (sectionId: string): SectionMeta => {
  const map = loadSectionMetaMap();
  return map[sectionId] || { lastDoneDate: null, nextDueDate: null };
};

export const setSectionMeta = (sectionId: string, meta: SectionMeta): void => {
  const map = loadSectionMetaMap();
  map[sectionId] = meta;
  saveSectionMetaMap(map);
};

export const updateSectionMeta = (sectionId: string, partial: Partial<SectionMeta>): void => {
  const map = loadSectionMetaMap();
  const current = map[sectionId] || {};
  map[sectionId] = { ...current, ...partial };
  saveSectionMetaMap(map);
};

// --- Date Utilities ---

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getNextDueDateFromToday = (freq: Frequency): string => {
  const d = new Date();
  let daysToAdd = 7;
  switch (freq) {
    case Frequency.Weekly: daysToAdd = 7; break;
    case Frequency.BiWeekly: daysToAdd = 14; break;
    case Frequency.Monthly: daysToAdd = 30; break;
    case Frequency.Quarterly: daysToAdd = 90; break;
    case Frequency.SemiAnnual: daysToAdd = 180; break;
    case Frequency.Annual: daysToAdd = 365; break;
  }
  d.setDate(d.getDate() + daysToAdd);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isOnOrBefore = (dateA: string, dateB: string): boolean => {
  return dateA <= dateB;
};

/**
 * 今日やるべきかどうかを判定する (Updated for new fields)
 */
export const isDueToday = (meta: SectionMeta | undefined, today: Date): boolean => {
  if (!meta) return false;
  
  // Check new field first
  if (meta.nextDueDate) {
    const todayStr = getTodayDateString();
    return isOnOrBefore(meta.nextDueDate, todayStr);
  }

  // Fallback to old field
  if (meta.nextPlannedAt) {
    const plannedDate = new Date(meta.nextPlannedAt);
    const p = new Date(plannedDate.getFullYear(), plannedDate.getMonth(), plannedDate.getDate());
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return p <= t;
  }
  
  return false;
};

/**
 * 表示用の日付フォーマット
 */
export const formatDateForDisplay = (isoString?: string | null, defaultText = '未設定'): string => {
  if (!isoString) return defaultText;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return defaultText;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};
