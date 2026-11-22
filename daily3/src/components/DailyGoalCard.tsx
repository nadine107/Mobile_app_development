import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/tasks';

interface DailyGoalCardProps {
  doneCount: number;
  totalCount: number;
  dailyTarget?: number;
}

export function DailyGoalCard({ doneCount, totalCount, dailyTarget = 3 }: DailyGoalCardProps) {
  const target = totalCount > dailyTarget ? totalCount : dailyTarget;
  const clampedDone = Math.min(doneCount, target);

  const statusText =
    doneCount > dailyTarget
      ? 'YAY, sogar mehr als das Tagesziel!'
      : doneCount === dailyTarget
      ? 'Tagesziel erreicht - super'
      : doneCount > 0
      ? 'Du bist auf einem guten Weg.'
      : 'Starte mit deiner ersten Aufgabe.';

  return (
    <View style={styles.goalCard}>
      <Text style={styles.goalEyebrow}>Dein Tagesziel: 3 Aufgaben</Text>
      <Text style={styles.goalTitle}>
        {clampedDone} von {target} erledigt
      </Text>
      <Text style={styles.goalSubtitle}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  goalEyebrow: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  goalSubtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 13,
    lineHeight: 18,
  },
});