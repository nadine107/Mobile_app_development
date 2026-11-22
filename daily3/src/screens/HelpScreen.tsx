import React, { useMemo } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Button } from '../components/Button';
import { APP_VERSION } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';

interface HelpScreenProps {
  taskCount: number;
  onResetAll: () => void;
}

export function HelpScreen({ taskCount, onResetAll }: HelpScreenProps) {
  const expoVersion = Constants.expoConfig?.sdkVersion ?? 'unbekannt';
  const rows: [string, string][] = useMemo(
    () => [
      ['App-Version', APP_VERSION],
      ['Expo SDK', String(expoVersion)],
      ['Plattform', `${Platform.OS} ${Platform.Version}`],
      ['Gespeicherte Aufgaben', String(taskCount)],
    ],
    [expoVersion, taskCount]
  );

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.h1}>Hilfe</Text>

      <View style={styles.card}>
        <Text style={styles.h3}>Aufgabe erfassen</Text>
        <Text style={styles.p}>
          Über den „+“-Button öffnest du die Eingabemaske. Der Titel ist Pflicht (mit Buchstaben),
          das Fälligkeitsdatum wird im Format TT.MM.JJJJ eingegeben und optional kannst du
          Wochentage für wiederkehrende Aufgaben wählen.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>Bearbeiten & Löschen</Text>
        <Text style={styles.p}>
          Tippe auf eine Aufgabe, um sie zu ändern. Mit „Aufgabe löschen“ in der Eingabemaske oder
          durch langes Drücken in der Liste wird sie nach Rückfrage entfernt.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>Erledigen & Tagesziel</Text>
        <Text style={styles.p}>
          Das Kästchen links neben einer Aufgabe markiert sie als erledigt bzw. wieder als offen.
          Wiederkehrende Aufgaben werden an einem neuen Tag automatisch wieder auf offen gesetzt.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>Sortieren & Suchen</Text>
        <Text style={styles.p}>
          In „Alle“ kannst du nach Fälligkeit, Priorität, Titel oder Erfassungsdatum sortieren.
          Erneutes Tippen auf dieselbe Sortierung kehrt die Reihenfolge um. Zusätzlich steht oben
          eine Suchfunktion zur Verfügung.
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
        Alle Aufgaben werden lokal auf diesem Gerät gespeichert (AsyncStorage).
      </Text>
      <Button
        title="Alle Aufgaben löschen"
        variant="danger"
        onPress={onResetAll}
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
}