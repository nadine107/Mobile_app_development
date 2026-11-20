import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { COLORS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
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