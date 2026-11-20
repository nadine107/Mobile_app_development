import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/tasks';

interface DailyGoalCardProps {
  doneCount: number;
  totalCount: number;
  dailyTarget?: number;
}

export function DailyGoalCard({ doneCount, totalCount, dailyTarget = 3 }: DailyGoalCardProps) {
  // Tagesziel: standardmässig 3 (wie "Daily3"), bei mehr als 3 offenen/gesamten Aufgaben passend mitgezogen
  const target = totalCount > dailyTarget ? totalCount : dailyTarget;
  const clampedDone = Math.min(doneCount, target);
  const percentage = target > 0 ? Math.round((clampedDone / target) * 100) : 0;

  const progressRatio = target > 0 ? clampedDone / target : 0;
  const rightDeg = Math.min(progressRatio, 0.5) * 360;
  const leftDeg = progressRatio > 0.5 ? (progressRatio - 0.5) * 360 : 0;

  const statusText =
    percentage === 100
      ? 'Tagesziel erreicht – stark!'
      : percentage > 0
      ? 'Du bist auf einem guten Weg.'
      : 'Starte mit deiner ersten Pendenz.';

  return (
    <View style={styles.goalCard}>
      {/* Dekorative Kreise im Hintergrund wie im Beispiel */}
      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />

      <View style={styles.goalLeft}>
        <Text style={styles.goalEyebrow}>Dein Tagesziel</Text>
        <Text style={styles.goalTitle}>
          {clampedDone} von {target} erledigt
        </Text>
        <Text style={styles.goalSubtitle}>{statusText}</Text>
      </View>


      <View style={styles.ringWrapper}>
        <View style={styles.ringTrack} />

        {/* Rechte Hälfte (0% bis 50%): startet oben (12 Uhr) im Uhrzeigersinn */}
        <View style={styles.ringHalfClipRight}>
          <View
            style={[
              styles.ringArc,
              styles.ringArcRight,
              { transform: [{ rotate: `${-135 + rightDeg}deg` }] },
            ]}
          />
        </View>

        {/* Linke Hälfte (50% bis 100%): startet unten (6 Uhr) weiter im Uhrzeigersinn */}
        <View style={styles.ringHalfClipLeft}>
          <View
            style={[
              styles.ringArc,
              styles.ringArcLeft,
              { transform: [{ rotate: `${45 + leftDeg}deg` }] },
            ]}
          />
        </View>

        <View style={styles.ringInner}>
          <Text style={styles.ringPercent}>{percentage}%</Text>
        </View>
      </View>
      
    </View>
  );
}

const RING_SIZE = 74;
const RING_STROKE = 7;

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircleLarge: {
    position: 'absolute',
    right: -36,
    top: -46,
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 22,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  decorCircleSmall: {
    position: 'absolute',
    right: -12,
    top: -22,
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 18,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  goalLeft: {
    flex: 1,
    paddingRight: 12,
    zIndex: 1,
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
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ringTrack: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  ringHalfClipRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: RING_SIZE / 2,
    height: RING_SIZE,
    overflow: 'hidden',
  },
  ringHalfClipLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: RING_SIZE / 2,
    height: RING_SIZE,
    overflow: 'hidden',
  },
  ringHalfCircle: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    borderColor: '#ffffff',
  },
  ringInner: {
    width: RING_SIZE - RING_STROKE * 2,
    height: RING_SIZE - RING_STROKE * 2,
    borderRadius: (RING_SIZE - RING_STROKE * 2) / 2,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercent: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  ringArc: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    borderColor: 'transparent',
  },
  ringArcRight: {
    borderTopColor: '#ffffff',
    borderRightColor: '#ffffff',
  },
  ringArcLeft: {
    borderBottomColor: '#ffffff',
    borderLeftColor: '#ffffff',
  },
});