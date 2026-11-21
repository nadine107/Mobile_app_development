import { FilterKey, PriorityConfig, SortKey, TabItemConfig } from '../types/task';

export const STORAGE_KEY = 'pendenzen.v1';
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '2026-01-2026';

export const COLORS = {
  primary: '#9d6b94',
  primaryDark: '#6b4665',
  bg: '#f6f4f6',
  card: '#ffffff',
  text: '#1f1b24',
  muted: '#6e6573',
  border: '#ded8df',
  danger: '#dc2615',
  success: '#16a34a',
  warning: '#d97706',
};

export const PRIORITIES: PriorityConfig[] = [
  { key: 'hoch', label: 'Hoch', weight: 0, color: COLORS.danger },
  { key: 'mittel', label: 'Mittel', weight: 1, color: COLORS.warning },
  { key: 'tief', label: 'Tief', weight: 2, color: COLORS.success },
];

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'due', label: 'Fälligkeit' },
  { key: 'priority', label: 'Priorität' },
  { key: 'title', label: 'Titel' },
  { key: 'created', label: 'Erfasst' },
];

export const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'open', label: 'Offen' },
  { key: 'done', label: 'Erledigt' },
];

export const TABS: TabItemConfig[] = [
  { key: 'home', label: 'Übersicht', icon: '' },
  { key: 'list', label: 'Alle', icon: '' },
  { key: 'help', label: 'Einstellungen', icon: '' },
];