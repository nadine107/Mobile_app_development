import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { COLORS, WEEKDAYS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';
import { Task } from '../types/task';
import { isOverdue, prioInfo } from '../utils/taskHelpers';

interface TaskRowProps {
  task: Task;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
}

export function TaskRow({ task, onOpen, onToggle, onDelete }: TaskRowProps) {
  const prio = prioInfo(task.priority);
  const overdue = isOverdue(task);
  const orderedRepeatDays = (task.repeatDays?.length ?? 0) > 0
    ? WEEKDAYS.filter((day) => task.repeatDays!.includes(day))
    : [];

  return (
    <Pressable
      onPress={() => onOpen(task.id)}
      onLongPress={() => onDelete(task)}
      style={styles.taskRow}
    >
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={10}
        style={[
          styles.checkbox,
          task.done && { backgroundColor: COLORS.success, borderColor: COLORS.success },
        ]}
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
          {orderedRepeatDays.length > 0 ? (
            <Text style={styles.taskMetaText} numberOfLines={1}>
              {'  ·  '}
              {orderedRepeatDays.join(', ')}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}