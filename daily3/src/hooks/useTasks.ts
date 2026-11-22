import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/tasks';
import { Task } from '../types/task';
import { getTodayString } from '../utils/taskHelpers';

const LAST_RESET_KEY = 'daily3_last_reset_date';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

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
          parsed = parsed.map((t) => {
            if ((t.repeatDays?.length ?? 0) > 0) {
              return { ...t, done: false, completedDate: undefined };
            }
            return t;
          });
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          await AsyncStorage.setItem(LAST_RESET_KEY, todayStr);
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() =>
      Alert.alert('Fehler', 'Aufgaben konnten nicht gespeichert werden.')
    );
  }, [tasks, loaded]);

  const saveTask = useCallback((task: Task) => {
    const todayStr = getTodayString();
    const normalizedTask: Task = {
      ...task,
      completedDate: task.done ? (task.completedDate ?? todayStr) : undefined,
    };

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
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextDone = !t.done;
        return {
          ...t,
          done: nextDone,
          completedDate: nextDone ? todayStr : undefined,
        };
      })
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