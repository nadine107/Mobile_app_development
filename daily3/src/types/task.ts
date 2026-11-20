// ---------------------------------------------------------------------------
// TypeScript Interfaces & Typen
// ---------------------------------------------------------------------------

export type PriorityKey = 'hoch' | 'mittel' | 'tief';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityKey;
  due: string;
  done: boolean;
  createdAt: number;
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