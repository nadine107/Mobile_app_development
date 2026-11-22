// ---------------------------------------------------------------------------
// TypeScript Interfaces & Typen
// ---------------------------------------------------------------------------

export type PriorityKey = 'hoch' | 'mittel' | 'tief';

export type WeekdayKey = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  done: boolean;
  createdAt: string;
  repeatPerWeek?: number;      // z. B. 0 (einmalig) oder 1..7
  repeatDays?: WeekdayKey[];   // z. B. ['Mo', 'Mi', 'Fr']
}

export interface PriorityConfig {
  key: PriorityKey;
  label: string;
  weight: number;
  color: string;
}

export type SortKey = 'due' | 'priority' | 'title' | 'created';
export type FilterKey = 'all' | 'open' | 'done';
export type ScreenKey = 'home' | 'edit' | 'list' | 'help';

export interface TabItemConfig {
  key: ScreenKey;
  label: string;
  icon: string;
}