import React from 'react';
import { Pressable, Text } from 'react-native';
import { COLORS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  color?: string;
}

export function Chip({ label, active, onPress, color = COLORS.primary }: ChipProps) {
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