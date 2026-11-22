import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Chip } from '../components/Chip';
import { TaskRow } from '../components/TaskRow';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';
import { FilterKey, SortKey, Task } from '../types/task';
import { parseDate, prioInfo } from '../utils/taskHelpers';

interface ListScreenProps {
  tasks: Task[];
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
}

export function ListScreen({ tasks, onOpen, onToggle, onDelete }: ListScreenProps) {
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
        <Text style={styles.h1}>Alle Aufgaben</Text>
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
            <Text style={styles.emptyText}>Keine Aufgaben gefunden.</Text>
          </View>
        }
      />
    </View>
  );
}