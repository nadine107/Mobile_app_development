import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/tasks';
import { Task } from '../types/task';
import { getTodayString } from '../utils/taskHelpers';

const LAST_RESET_KEY = 'daily3_last_reset_date';


function applyCompletionDate(task: Task, done: boolean, todayStr: string): Task {
  return {
    ...task,
    done,
    completedDate: done ? (task.completedDate ?? todayStr) : undefined,
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const skipNextSave = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const todayStr = getTodayString();
        const [raw, lastReset] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(LAST_RESET_KEY),
        ]);

        let parsed: Task[] = raw ? JSON.parse(raw) : [];

        // Neuer Tag erkannt -> wiederkehrende Aufgaben wieder auf "Offen" setzen
        if (lastReset !== todayStr) {
          parsed = parsed.map((t) =>
            (t.repeatDays?.length ?? 0) > 0
              ? { ...t, done: false, completedDate: undefined }
              : t
          );
          skipNextSave.current = true;
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)),
            AsyncStorage.setItem(LAST_RESET_KEY, todayStr),
          ]);
        }

        setTasks(parsed);
      } catch {
        Alert.alert('Fehler', 'Aufgaben konnten nicht geladen werden.');
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() =>
      Alert.alert('Fehler', 'Aufgaben konnten nicht gespeichert werden.')
    );
  }, [tasks, loaded]);

  const saveTask = useCallback((task: Task) => {
    const todayStr = getTodayString();
    const normalizedTask = applyCompletionDate(task, task.done, todayStr);

    setTasks((prev) => {
      const exists = prev.some((t) => t.id === normalizedTask.id);
      return exists
        ? prev.map((t) => (t.id === normalizedTask.id ? normalizedTask : t))
        : [...prev, normalizedTask];
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    const todayStr = getTodayString();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? applyCompletionDate({ ...t, completedDate: t.done ? undefined : todayStr }, !t.done, todayStr) : t))
    );
  }, []);

  const removeTaskById = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return {
    tasks,
    loaded,
    saveTask,
    toggleTask,
    removeTaskById,
    clearAllTasks,
  };
}