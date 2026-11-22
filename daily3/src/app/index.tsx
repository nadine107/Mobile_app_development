// Aufgaben-App für Expo Go (TypeScript)
// Benötigte Pakete:
// npx expo install @react-native-async-storage/async-storage expo-constants react-native-safe-area-context
// wichtiger Hinweis zum Starten der App: Beim Öffnen befindet man sich ziemlich sicher im Ordner "Mobile_app_development"
// Man muss von diesem Ordner in den Ordner "daily3" mithilfe des Befehls "cd daily3" wechseln.
// Dann kann man wie gewohnt "npx expo start" ausführen
// Viel Spass bei der App :)

import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TABS } from '../constants/tasks';
import { useTasks } from '../hooks/useTasks';
import { EditScreen } from '../screens/EditScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ListScreen } from '../screens/ListScreen';
import { appStyles as styles } from '../styles/appStyles';
import { ScreenKey, Task } from '../types/task';

export default function App() {
  const { tasks, loaded, saveTask, toggleTask, removeTaskById, clearAllTasks } = useTasks();
  const [screen, setScreen] = useState<ScreenKey>('home');
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingTask = useMemo(
    () => tasks.find((t) => t.id === editingId) ?? null,
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

  const handleSave = useCallback(
    (task: Task) => {
      saveTask(task);
      setEditingId(null);
      setScreen('list');
    },
    [saveTask]
  );

  const handleDelete = useCallback(
    (task: Task) => {
      Alert.alert('Aufgabe löschen?', `„${task.title}“ wird endgültig entfernt.`, [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            removeTaskById(task.id);
            setEditingId(null);
            setScreen((s) => (s === 'edit' ? 'list' : s));
          },
        },
      ]);
    },
    [removeTaskById]
  );

  const handleResetAll = useCallback(() => {
    Alert.alert('Alles löschen?', 'Alle Aufgaben werden unwiderruflich entfernt.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Alles löschen', style: 'destructive', onPress: clearAllTasks },
    ]);
  }, [clearAllTasks]);

  

  let content = null;
  if (screen === 'home') {
    content = (
      <HomeScreen
        tasks={tasks}
        onOpen={goEdit}
        onToggle={toggleTask}
        onDelete={handleDelete}
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
      <ListScreen tasks={tasks} onOpen={goEdit} onToggle={toggleTask} onDelete={handleDelete} />
    );
  } else {
    content = <HelpScreen taskCount={tasks.length} onResetAll={handleResetAll} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={styles.appBar}>
          <Image
            source={require('../bilder/Todoist.jpeg')}
            style={styles.appBarLogo}
            resizeMode="cover"
          />
          <Text style={styles.appBarTitle}>Daily3</Text>
        </View>

        <View style={{ flex: 1 }}>{loaded ? content : null}</View>

        
        {screen !== 'edit' && (
          <Pressable
            style={({ pressed }) => [styles.fabButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={goNew}
          >
            <Image
              source={require('../bilder/Plussymbol.png')}
              style={styles.fabImage}
              resizeMode="contain"
            />
          </Pressable>
        )}

        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const active = screen === tab.key;
            return (
              <Pressable key={tab.key} style={styles.tabItem} onPress={() => setScreen(tab.key)}>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}