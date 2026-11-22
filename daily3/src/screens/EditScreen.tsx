import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { COLORS, PRIORITIES, WEEKDAYS } from '../constants/tasks';
import { appStyles as styles } from '../styles/appStyles';
import { PriorityKey, Task, WeekdayKey } from '../types/task';
import { formatDate, newId, parseDate, startOfToday } from '../utils/taskHelpers';

interface EditScreenProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCancel: () => void;
}

export function EditScreen({ task, onSave, onDelete, onCancel }: EditScreenProps) {
  const isNew = !task;
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<PriorityKey>(task?.priority ?? 'mittel');
  const [due, setDue] = useState(task?.due ?? '');
  const [done, setDone] = useState(task?.done ?? false);
  const [repeatPerWeek, setRepeatPerWeek] = useState<number>(task?.repeatPerWeek ?? 0);
  const [repeatDays, setRepeatDays] = useState<WeekdayKey[]>(task?.repeatDays ?? []);
  const [errors, setErrors] = useState<{ title?: string; due?: string }>({});

  useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setPriority(task?.priority ?? 'mittel');
    setDue(task?.due ?? '');
    setDone(task?.done ?? false);
    setRepeatPerWeek(task?.repeatPerWeek ?? 0);
    setRepeatDays(task?.repeatDays ?? []);
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
      repeatPerWeek,
      repeatDays,
    });
  };

  const setDueInDays = (days: number) => {
    const d = startOfToday();
    d.setDate(d.getDate() + days);
    setDue(formatDate(d));
    setErrors((e) => ({ ...e, due: undefined }));
  };

  const toggleWeekday = (day: WeekdayKey) => {
    setRepeatDays((prev) => {
      const next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      if (next.length > repeatPerWeek) {
        setRepeatPerWeek(next.length);
      }
      return next;
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>{isNew ? 'Neue Aufgabe' : 'Aufgabe bearbeiten'}</Text>

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

        {/* Wie oft pro Woche? */}
        <View style={styles.repeatHeaderRow}>
          <Text style={styles.label}>Wie oft pro Woche?</Text>
          <View style={styles.stepperRow}>
            <Pressable
              style={styles.stepperButton}
              onPress={() => setRepeatPerWeek((prev) => Math.max(0, prev - 1))}
            >
              <Text style={styles.stepperButtonText}>−</Text>
            </Pressable>

            <Text style={styles.stepperValue}>
              {repeatPerWeek === 0 ? '1' : `${repeatPerWeek}×`}
            </Text>

            <Pressable
              style={styles.stepperButton}
              onPress={() => setRepeatPerWeek((prev) => Math.min(7, prev + 1))}
            >
              <Text style={styles.stepperButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Wochentage */}
        <Text style={styles.label}>Wochentage</Text>
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((day) => {
            const selected = repeatDays.includes(day);
            return (
              <Pressable
                key={day}
                style={[styles.weekdayCircle, selected && styles.weekdayCircleActive]}
                onPress={() => toggleWeekday(day)}
              >
                <Text style={[styles.weekdayText, selected && styles.weekdayTextActive]}>{day}</Text>
              </Pressable>
            );
          })}
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