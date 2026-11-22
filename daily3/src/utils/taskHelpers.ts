import { PRIORITIES } from '../constants/tasks';
import { PriorityConfig, PriorityKey } from '../types/task';
import { Task, WeekdayKey } from '../types/task';

export const prioInfo = (key: PriorityKey): PriorityConfig =>
  PRIORITIES.find((p) => p.key === key) || PRIORITIES[1];

// "TT.MM.JJJJ" -> Date (oder null)
export function parseDate(str: string): Date | null {
  if (!str) return null;
  const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(str.trim());
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

export function startOfToday(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

export function isOverdue(task: Task): boolean {
  if (task.done) return false;
  const due = parseDate(task.due);
  return !!due && due < startOfToday();
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// JavaScript getDay(): 0 = So, 1 = Mo, ..., 6 = Sa
const JS_DAY_TO_WEEKDAY: WeekdayKey[] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function getTodayWeekday(date: Date = new Date()): WeekdayKey {
  return JS_DAY_TO_WEEKDAY[date.getDay()];
}

export function getTodayString(): string {
  return formatDate(startOfToday());
}

/** Prüft, ob eine Aufgabe für heute (Übersicht & Tages-Score) zählt */
export function isTaskForToday(task: Task, todayStr = getTodayString(), todayWeekday = getTodayWeekday()): boolean {
  const days = task.repeatDays ?? [];

  // Fall A: Wiederkehrende Aufgabe -> nur an den gewählten Wochentagen anzeigen
  if (days.length > 0) {
    return days.includes(todayWeekday);
  }

  // Fall B: Einmalige Aufgabe -> zeigen, wenn sie noch offen ist ODER erst heute erledigt wurde
  if (!task.done) return true;
  return task.completedDate === todayStr;
}