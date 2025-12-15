export type CalendarMap = Record<string, string[]>;

const CALENDAR_STORAGE_KEY = "kireiroutine_calendar_v1";

export const createEmptyCalendarMap = (): CalendarMap => ({});

export const loadCalendarMap = (): CalendarMap => {
  if (typeof window === "undefined") return createEmptyCalendarMap();

  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) return createEmptyCalendarMap();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return createEmptyCalendarMap();
    return parsed as CalendarMap;
  } catch (error) {
    console.warn("[calendarStorage] Failed to load calendar map", error);
    return createEmptyCalendarMap();
  }
};

export const persistCalendarMap = (map: CalendarMap): CalendarMap => {
  if (typeof window === "undefined") return map;
  try {
    window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(map));
  } catch (error) {
    console.warn("[calendarStorage] Failed to persist calendar map", error);
  }
  return map;
};

const cloneCalendarMap = (map: CalendarMap): CalendarMap => {
  const next: CalendarMap = {};
  Object.entries(map).forEach(([dateKey, tasks]) => {
    next[dateKey] = [...tasks];
  });
  return next;
};

export const updateCalendarMap = (
  current: CalendarMap,
  mutator: (draft: CalendarMap) => void
): CalendarMap => {
  const draft = cloneCalendarMap(current);
  mutator(draft);
  return persistCalendarMap(draft);
};

export const replaceDateTasks = (
  current: CalendarMap,
  dateKey: string,
  taskIds: string[]
): CalendarMap => {
  return updateCalendarMap(current, (draft) => {
    const deduped = Array.from(new Set(taskIds));
    if (deduped.length === 0) {
      delete draft[dateKey];
    } else {
      draft[dateKey] = deduped;
    }
  });
};

export const mergeDateTasks = (
  current: CalendarMap,
  dateKey: string,
  taskIds: string[]
): CalendarMap => {
  return updateCalendarMap(current, (draft) => {
    const existing = draft[dateKey] ?? [];
    draft[dateKey] = Array.from(new Set([...existing, ...taskIds]));
  });
};

export const clearDateTasks = (
  current: CalendarMap,
  dateKey: string
): CalendarMap => {
  return updateCalendarMap(current, (draft) => {
    delete draft[dateKey];
  });
};
