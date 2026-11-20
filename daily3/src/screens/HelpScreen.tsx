import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Button } from '../components/Button';
import { APP_BUILD, APP_VERSION } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';

interface HelpScreenProps {
  taskCount: number;
  onResetAll: () => void;
}

export function HelpScreen({ taskCount, onResetAll }: HelpScreenProps) {
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