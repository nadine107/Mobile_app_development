import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { TaskRow } from '../components/TaskRow';
import { COLORS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';
import { Task } from '../types/task';
import { isOverdue, parseDate, prioInfo } from '../utils/taskHelpers';

interface HomeScreenProps {
  tasks: Task[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
  onShowAll: () => void;
}

export function HomeScreen({ tasks, onNew, onOpen, onToggle, onDelete, onShowAll }: HomeScreenProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const overdue = tasks.filter(isOverdue).length;
    return { total, done, open: total - done, overdue };
  }, [tasks]);

  const upcoming = useMemo(() => {
    return tasks
      .filter((t) => !t.done)
      .sort((a, b) => {
        const da = parseDate(a.due);
        const db = parseDate(b.due);
        if (da && db) return da.getTime() - db.getTime();
        if (da) return -1;
        if (db) return 1;
        return prioInfo(a.priority).weight - prioInfo(b.priority).weight;
      })
      .slice(0, 5);
  }, [tasks]);

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.h1}>Willkommen 👋</Text>
      <Text style={styles.subtitle}>Dein Überblick über alle Pendenzen</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.open}</Text>
          <Text style={styles.statLabel}>Offen</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.danger }]}>{stats.overdue}</Text>
          <Text style={styles.statLabel}>Überfällig</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.success }]}>{stats.done}</Text>
          <Text style={styles.statLabel}>Erledigt</Text>
        </View>
      </View>

      <Button title="＋ Neue Pendenz erfassen" onPress={onNew} />

      <Text style={styles.h2}>Als Nächstes</Text>
      {upcoming.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {stats.total === 0
              ? 'Noch keine Pendenzen erfasst. Leg gleich los!'
              : 'Alles erledigt – gut gemacht! 🎉'}
          </Text>
        </View>
      ) : (
        upcoming.map((t) => (
          <TaskRow key={t.id} task={t} onOpen={onOpen} onToggle={onToggle} onDelete={onDelete} />
        ))
      )}

      {stats.total > 0 && (
        <Button title="Alle Pendenzen anzeigen" variant="secondary" onPress={onShowAll} style={{ marginTop: 12 }} />
      )}
    </ScrollView>
  );
}