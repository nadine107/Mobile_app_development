// Pendenzen-App für Expo Go (TypeScript)
// Benötigte Pakete:
//   npx expo install @react-native-async-storage/async-storage expo-constants react-native-safe-area-context

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// ---------------------------------------------------------------------------
// TypeScript Interfaces & Typen
// ---------------------------------------------------------------------------

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'hoch' | 'mittel' | 'tief';
  due: string;
  done: boolean;
  createdAt: number;
}

type PriorityKey = 'hoch' | 'mittel' | 'tief';

interface PriorityConfig {
  key: PriorityKey;
  label: string;
  weight: number;
  color: string;
}

// ---------------------------------------------------------------------------
// Konstanten & Hilfsfunktionen
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'pendenzen.v1';
const APP_VERSION = '1.0.0';
const APP_BUILD = '2026-01-2026';

const COLORS = {
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

const PRIORITIES: PriorityConfig[] = [
  { key: 'hoch', label: 'Hoch', weight: 0, color: COLORS.danger },
  { key: 'mittel', label: 'Mittel', weight: 1, color: COLORS.warning },
  { key: 'tief', label: 'Tief', weight: 2, color: COLORS.success },
];

const prioInfo = (key: PriorityKey): PriorityConfig =>
  PRIORITIES.find((p) => p.key === key) || PRIORITIES[1];

// "TT.MM.JJJJ" -> Date (oder null)
function parseDate(str: string): Date | null {
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

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

function startOfToday(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

function isOverdue(task: Task): boolean {
  if (task.done) return false;
  const due = parseDate(task.due);
  return !!due && due < startOfToday();
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Kleine UI-Bausteine (mit Props-Typisierung)
// ---------------------------------------------------------------------------

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
  const bg =
    variant === 'danger' ? COLORS.danger : variant === 'secondary' ? COLORS.card : COLORS.primary;
  const color = variant === 'secondary' ? COLORS.primary : '#fff';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
        variant === 'secondary' && { borderWidth: 1, borderColor: COLORS.primary },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </Pressable>
  );
}

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  color?: string;
}

function Chip({ label, active, onPress, color = COLORS.primary }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: color, borderColor: color },
      ]}
    >
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

interface TaskRowProps {
  task: Task;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
}

function TaskRow({ task, onOpen, onToggle, onDelete }: TaskRowProps) {
  const prio = prioInfo(task.priority);
  const overdue = isOverdue(task);
  return (
    <Pressable
      onPress={() => onOpen(task.id)}
      onLongPress={() => onDelete(task)}
      style={styles.taskRow}
    >
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={10}
        style={[styles.checkbox, task.done && { backgroundColor: COLORS.success, borderColor: COLORS.success }]}
      >
        {task.done ? <Text style={styles.checkMark}>✓</Text> : null}
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text
          style={[styles.taskTitle, task.done && styles.taskTitleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View style={styles.taskMeta}>
          <View style={[styles.prioDot, { backgroundColor: prio.color }]} />
          <Text style={styles.taskMetaText}>{prio.label}</Text>
          {task.due ? (
            <Text style={[styles.taskMetaText, overdue && { color: COLORS.danger, fontWeight: '700' }]}>
              {'  ·  '}fällig {task.due}
              {overdue ? ' (überfällig)' : ''}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Maske 1: Einstieg & Übersicht
// ---------------------------------------------------------------------------

interface HomeScreenProps {
  tasks: Task[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
  onShowAll: () => void;
}

function HomeScreen({ tasks, onNew, onOpen, onToggle, onDelete, onShowAll }: HomeScreenProps) {
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

// ---------------------------------------------------------------------------
// Maske 2: Dateneingabe & Mutation
// ---------------------------------------------------------------------------

interface EditScreenProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCancel: () => void;
}

function EditScreen({ task, onSave, onDelete, onCancel }: EditScreenProps) {
  const isNew = !task;
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<PriorityKey>(task?.priority ?? 'mittel');
  const [due, setDue] = useState(task?.due ?? '');
  const [done, setDone] = useState(task?.done ?? false);
  const [errors, setErrors] = useState<{ title?: string; due?: string }>({});

  useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setPriority(task?.priority ?? 'mittel');
    setDue(task?.due ?? '');
    setDone(task?.done ?? false);
    setErrors({});
  }, [task?.id]);

  const validate = () => {
    const e: { title?: string; due?: string } = {};
    if (!title.trim()) e.title = 'Bitte einen Titel eingeben.';
    if (due.trim() && !parseDate(due)) e.due = 'Ungültiges Datum – Format: TT.MM.JJJJ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const parsed = parseDate(due);
    const normalizedDue = due.trim() && parsed ? formatDate(parsed) : '';
    onSave({
      id: task?.id ?? newId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      due: normalizedDue,
      done,
      createdAt: task?.createdAt ?? Date.now(),
    });
  };

  const setDueInDays = (days: number) => {
    const d = startOfToday();
    d.setDate(d.getDate() + days);
    setDue(formatDate(d));
    setErrors((e) => ({ ...e, due: undefined }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>{isNew ? 'Neue Pendenz' : 'Pendenz bearbeiten'}</Text>

        <Text style={styles.label}>Titel *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="Was ist zu tun?"
          maxLength={100}
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <Text style={styles.label}>Beschreibung</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Details (optional)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Priorität</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <Chip
              key={p.key}
              label={p.label}
              color={p.color}
              active={priority === p.key}
              onPress={() => setPriority(p.key)}
            />
          ))}
        </View>

        <Text style={styles.label}>Fällig am</Text>
        <TextInput
          style={[styles.input, errors.due && styles.inputError]}
          value={due}
          onChangeText={setDue}
          placeholder="TT.MM.JJJJ"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        {errors.due ? <Text style={styles.errorText}>{errors.due}</Text> : null}
        <View style={styles.chipRow}>
          <Chip label="Heute" onPress={() => setDueInDays(0)} />
          <Chip label="Morgen" onPress={() => setDueInDays(1)} />
          <Chip label="In 1 Woche" onPress={() => setDueInDays(7)} />
          <Chip label="Kein Datum" onPress={() => setDue('')} />
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={styles.chipRow}>
          <Chip label="Offen" active={!done} onPress={() => setDone(false)} />
          <Chip label="Erledigt" active={done} color={COLORS.success} onPress={() => setDone(true)} />
        </View>

        <View style={{ height: 16 }} />
        <Button title={isNew ? 'Speichern' : 'Änderungen speichern'} onPress={handleSave} />
        <Button title="Abbrechen" variant="secondary" onPress={onCancel} style={{ marginTop: 10 }} />
        {!isNew && (
          <Button
            title="Pendenz löschen"
            variant="danger"
            onPress={() => onDelete(task)}
            style={{ marginTop: 10 }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Maske 3: Alle Pendenzen mit Sortierung
// ---------------------------------------------------------------------------

type SortKey = 'due' | 'priority' | 'title' | 'created';
type FilterKey = 'all' | 'open' | 'done';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'due', label: 'Fälligkeit' },
  { key: 'priority', label: 'Priorität' },
  { key: 'title', label: 'Titel' },
  { key: 'created', label: 'Erfasst' },
];

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'open', label: 'Offen' },
  { key: 'done', label: 'Erledigt' },
];

interface ListScreenProps {
  tasks: Task[];
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
}

function ListScreen({ tasks, onOpen, onToggle, onDelete }: ListScreenProps) {
  const [sortKey, setSortKey] = useState<SortKey>('due');
  const [ascending, setAscending] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tasks.filter((t) => {
      if (filter === 'open' && t.done) return false;
      if (filter === 'done' && !t.done) return false;
      if (q && !(`${t.title} ${t.description}`.toLowerCase().includes(q))) return false;
      return true;
    });

    const dir = ascending ? 1 : -1;
    list = [...list].sort((a, b) => {
      let r = 0;
      switch (sortKey) {
        case 'due': {
          const da = parseDate(a.due);
          const db = parseDate(b.due);
          if (!da && !db) r = 0;
          else if (!da) return 1;
          else if (!db) return -1;
          else r = da.getTime() - db.getTime();
          break;
        }
        case 'priority':
          r = prioInfo(a.priority).weight - prioInfo(b.priority).weight;
          break;
        case 'title':
          r = a.title.localeCompare(b.title, 'de', { sensitivity: 'base' });
          break;
        case 'created':
          r = a.createdAt - b.createdAt;
          break;
      }
      return r * dir;
    });
    return list;
  }, [tasks, sortKey, ascending, filter, query]);

  const onSortPress = (key: SortKey) => {
    if (key === sortKey) setAscending((a) => !a);
    else {
      setSortKey(key);
      setAscending(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.listHeader}>
        <Text style={styles.h1}>Alle Pendenzen</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Suchen…"
          clearButtonMode="while-editing"
        />
        <Text style={styles.labelSmall}>Sortieren nach</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map((o) => (
            <Chip
              key={o.key}
              label={o.label + (sortKey === o.key ? (ascending ? ' ↑' : ' ↓') : '')}
              active={sortKey === o.key}
              onPress={() => onSortPress(o.key)}
            />
          ))}
        </View>
        <Text style={styles.labelSmall}>Anzeigen</Text>
        <View style={styles.chipRow}>
          {FILTER_OPTIONS.map((o) => (
            <Chip key={o.key} label={o.label} active={filter === o.key} onPress={() => setFilter(o.key)} />
          ))}
        </View>
        <Text style={styles.hint}>
          {data.length} Eintrag{data.length === 1 ? '' : 'e'} · Tippen = bearbeiten, lang drücken = löschen
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        renderItem={({ item }) => (
          <TaskRow task={item} onOpen={onOpen} onToggle={onToggle} onDelete={onDelete} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Keine Pendenzen gefunden.</Text>
          </View>
        }
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Maske 4: Hilfe & Version
// ---------------------------------------------------------------------------

interface HelpScreenProps {
  taskCount: number;
  onResetAll: () => void;
}

function HelpScreen({ taskCount, onResetAll }: HelpScreenProps) {
  const expoVersion = Constants.expoConfig?.sdkVersion ?? 'unbekannt';
  const rows: [string, string][] = [
    ['App-Version', APP_VERSION],
    ['Build-Datum', APP_BUILD],
    ['Expo SDK', String(expoVersion)],
    ['Plattform', `${Platform.OS} ${Platform.Version}`],
    ['Gespeicherte Pendenzen', String(taskCount)],
  ];

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.h1}>Hilfe</Text>

      <View style={styles.card}>
        <Text style={styles.h3}>Pendenz erfassen</Text>
        <Text style={styles.p}>
          Über „Neu“ oder den Button auf der Übersicht öffnest du die Eingabemaske. Der Titel ist
          Pflicht, das Fälligkeitsdatum wird im Format TT.MM.JJJJ eingegeben.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>Bearbeiten & Löschen</Text>
        <Text style={styles.p}>
          Tippe auf eine Pendenz, um sie zu ändern. Mit „Pendenz löschen“ in der Eingabemaske oder
          durch langes Drücken in der Liste wird sie nach Rückfrage entfernt.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>Erledigen</Text>
        <Text style={styles.p}>
          Das Kästchen links neben einer Pendenz markiert sie als erledigt bzw. wieder als offen.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>Sortieren & Filtern</Text>
        <Text style={styles.p}>
          In „Alle“ kannst du nach Fälligkeit, Priorität, Titel oder Erfassungsdatum sortieren.
          Erneutes Tippen auf dieselbe Sortierung kehrt die Reihenfolge um. Zusätzlich gibt es
          Suche und Statusfilter.
        </Text>
      </View>

      <Text style={styles.h2}>Version</Text>
      <View style={styles.card}>
        {rows.map(([k, v]) => (
          <View key={k} style={styles.versionRow}>
            <Text style={styles.versionKey}>{k}</Text>
            <Text style={styles.versionVal}>{v}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h2}>Daten</Text>
      <Text style={styles.p}>
        Alle Pendenzen werden lokal auf diesem Gerät gespeichert (AsyncStorage).
      </Text>
      <Button
        title="Alle Pendenzen löschen"
        variant="danger"
        onPress={onResetAll}
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// App (Navigation, Zustand, Persistenz)
// ---------------------------------------------------------------------------

type ScreenKey = 'home' | 'edit' | 'list' | 'help';

interface TabItemConfig {
  key: ScreenKey;
  label: string;
  icon: string;
}

const TABS: TabItemConfig[] = [
  { key: 'home', label: 'Übersicht', icon: '🏠' },
  { key: 'edit', label: 'Neu', icon: '✏️' },
  { key: 'list', label: 'Alle', icon: '📋' },
  { key: 'help', label: 'Hilfe', icon: '❓' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState<ScreenKey>('home');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch (e) {
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

  const editingTask = useMemo(
    () => tasks.find((t) => t.id === editingId) || null,
    [tasks, editingId]
  );

  const goNew = useCallback(() => {
    setEditingId(null);
    setScreen('edit');
  }, []);

  const goEdit = useCallback((id: string) => {
    setEditingId(id);
    setScreen('edit');
  }, []);

  const handleSave = useCallback((task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [...prev, task];
    });
    setEditingId(null);
    setScreen('list');
  }, []);

  const handleToggle = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const handleDelete = useCallback((task: Task) => {
    Alert.alert('Pendenz löschen?', `„${task.title}“ wird endgültig entfernt.`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          setTasks((prev) => prev.filter((t) => t.id !== task.id));
          setEditingId(null);
          setScreen((s) => (s === 'edit' ? 'list' : s));
        },
      },
    ]);
  }, []);

  const handleResetAll = useCallback(() => {
    Alert.alert('Alles löschen?', 'Alle Pendenzen werden unwiderruflich entfernt.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Alles löschen', style: 'destructive', onPress: () => setTasks([]) },
    ]);
  }, []);

  const onTabPress = (key: ScreenKey) => {
    if (key === 'edit') {
      goNew();
    } else {
      setScreen(key);
    }
  };

  let content = null;
  if (screen === 'home') {
    content = (
      <HomeScreen
        tasks={tasks}
        onNew={goNew}
        onOpen={goEdit}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onShowAll={() => setScreen('list')}
      />
    );
  } else if (screen === 'edit') {
    content = (
      <EditScreen
        task={editingTask}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => {
          setEditingId(null);
          setScreen('list');
        }}
      />
    );
  } else if (screen === 'list') {
    content = (
      <ListScreen tasks={tasks} onOpen={goEdit} onToggle={handleToggle} onDelete={handleDelete} />
    );
  } else {
    content = <HelpScreen taskCount={tasks.length} onResetAll={handleResetAll} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Pendenzen</Text>
        </View>

        <View style={{ flex: 1 }}>{loaded ? content : null}</View>

        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const active = screen === tab.key;
            return (
              <Pressable key={tab.key} style={styles.tabItem} onPress={() => onTabPress(tab.key)}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  appBar: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  appBarTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  screenContent: { padding: 16, paddingBottom: 32 },
  h1: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  h2: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 8 },
  h3: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  p: { fontSize: 14, color: COLORS.muted, lineHeight: 20 },
  subtitle: { fontSize: 14, color: COLORS.muted, marginBottom: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },

  button: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  chipText: { fontSize: 13, color: COLORS.text, fontWeight: '600' },

  label: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 16, marginBottom: 6 },
  labelSmall: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginTop: 10 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  inputMultiline: { minHeight: 90 },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  hint: { fontSize: 12, color: COLORS.muted, marginTop: 10 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  emptyBox: { padding: 24, alignItems: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 14, textAlign: 'center' },

  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#fff', fontWeight: '800', fontSize: 15 },
  taskTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  taskTitleDone: { textDecorationLine: 'line-through', color: COLORS.muted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  taskMetaText: { fontSize: 12, color: COLORS.muted },
  prioDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },

  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  versionKey: { color: COLORS.muted, fontSize: 14 },
  versionVal: { color: COLORS.text, fontSize: 14, fontWeight: '600' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  tabLabelActive: { color: COLORS.primary, fontWeight: '700' },
});