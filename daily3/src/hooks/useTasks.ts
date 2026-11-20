import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/tasks';
import { Task } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch {
        Alert.alert('Fehler', 'Pendenzen konnten nicht geladen werden.');
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() =>
      Alert.alert('Fehler', 'Pendenzen konnten nicht gespeichert werden.')
    );
  }, [tasks, loaded]);

  const saveTask = useCallback((task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [...prev, task];
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
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