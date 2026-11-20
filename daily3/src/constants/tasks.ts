import { FilterKey, PriorityConfig, SortKey, TabItemConfig } from '../types/task';

export const STORAGE_KEY = 'pendenzen.v1';
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '2026-01-2026';

export const COLORS = {
  primary: '#1dbc62',
  primaryDark: '#0e6f3a',
  bg: '#f3f4f6',
  card: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  border: '#d1d5db',
  danger: '#dc2626',
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
  { key: 'home', label: 'Übersicht', icon: '🏠' },
  { key: 'edit', label: 'Neu', icon: '✏️' },
  { key: 'list', label: 'Alle', icon: '📋' },
  { key: 'help', label: 'Hilfe', icon: '❓' },
];