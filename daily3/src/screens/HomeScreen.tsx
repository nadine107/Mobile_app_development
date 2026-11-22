import { useMemo } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { DailyGoalCard } from '../components/DailyGoalCard';
import { TaskRow } from '../components/TaskRow';
import { COLORS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';
import { Task } from '../types/task';
import { isOverdue, isTaskForToday, parseDate, prioInfo } from '../utils/taskHelpers';


interface HomeScreenProps {
  tasks: Task[];
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
}


function compareByDueDate(a: Task, b: Task): number {
  const da = parseDate(a.due);
  const db = parseDate(b.due);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return da.getTime() - db.getTime();
}

export function HomeScreen({ tasks, onOpen, onToggle, onDelete }: HomeScreenProps) {
  const todayTasks = useMemo(() => tasks.filter((t) => isTaskForToday(t)), [tasks]);


  const stats = useMemo(() => {
    let done = 0;
    let overdue = 0;
    for (const t of todayTasks) {
      if (t.done) done += 1;
      if (isOverdue(t)) overdue += 1;
    }
    const total = todayTasks.length;
    return { total, done, open: total - done, overdue };
  }, [todayTasks]);

  const upcoming = useMemo(() => {
    return todayTasks
      .filter((t) => !t.done)
      .sort((a, b) => {
        const dueDiff = compareByDueDate(a, b);
        if (dueDiff !== 0) return dueDiff;
        return prioInfo(a.priority).weight - prioInfo(b.priority).weight;
      })
      .slice(0, 5);
  }, [todayTasks]);

  const todayLabel = useMemo(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString('de-CH', { weekday: 'long' });
    const dateStr = now.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `Heute ist ${weekday}, der ${dateStr}`;
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.h1}>Hallo Nadine 👋</Text>
      <Text style={styles.todayText}>{todayLabel}</Text>
      <Text style={styles.subtitle}>
        Setze dir jeden Tag drei Habits oder Aufgaben, die du erledigen möchtest.
      </Text>

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

      <DailyGoalCard doneCount={stats.done} totalCount={stats.total} dailyTarget={3} />

      <Text style={styles.h2}>Als Nächstes</Text>
      {upcoming.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {stats.total === 0
              ? 'Noch keine Aufgabe erfasst. Erstelle eine neue'
              : 'Alles geschafft :) Heute stehen keine Todos mehr an'}
          </Text>
          {stats.total > 0 && (
            <Image
              source={require('../bilder/Minions.gif')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
          )}
        </View>
      ) : (
        upcoming.map((t) => (
          <TaskRow key={t.id} task={t} onOpen={onOpen} onToggle={onToggle} onDelete={onDelete} />
        ))
      )}
    </ScrollView>
  );
}