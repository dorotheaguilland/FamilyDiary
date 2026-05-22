import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FAMILY_MEMBERS } from '../constants/familyMembers';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

export default function EventForm({
  initialValues,
  onSubmit,
  submitLabel,
  helperText,
}) {
  const defaults = useMemo(
    () => ({
      title: initialValues?.title || '',
      date: initialValues?.date || '',
      time: initialValues?.time || '',
      location: initialValues?.location || '',
      notes: initialValues?.notes || '',
      attendees: initialValues?.attendees?.length
        ? initialValues.attendees
        : [FAMILY_MEMBERS[0]],
    }),
    [initialValues],
  );

  const [values, setValues] = useState(defaults);
  const [saving, setSaving] = useState(false);

  const toggleAttendee = (member) => {
    setValues((currentValues) => {
      const attendees = currentValues.attendees.includes(member)
        ? currentValues.attendees.filter((person) => person !== member)
        : [...currentValues.attendees, member];

      return {
        ...currentValues,
        attendees,
      };
    });
  };

  const updateField = (field, value) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!values.title.trim()) {
      Alert.alert('Missing title', 'Please give the event a title.');
      return;
    }

    if (!datePattern.test(values.date.trim())) {
      Alert.alert('Invalid date', 'Use the date format YYYY-MM-DD.');
      return;
    }

    if (!timePattern.test(values.time.trim())) {
      Alert.alert('Invalid time', 'Use the time format HH:MM in 24-hour time.');
      return;
    }

    if (!values.attendees.length) {
      Alert.alert('Choose attendees', 'Select at least one family member.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        date: values.date.trim(),
        time: values.time.trim(),
        location: values.location.trim(),
        notes: values.notes.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.panel}>
          <Text style={styles.title}>{submitLabel}</Text>
          <Text style={styles.helperText}>{helperText}</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Event title</Text>
            <TextInput
              value={values.title}
              onChangeText={(value) => updateField('title', value)}
              style={styles.input}
              placeholder="School play"
              placeholderTextColor="#7C9B92"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                value={values.date}
                onChangeText={(value) => updateField('date', value)}
                style={styles.input}
                placeholder="2026-06-30"
                placeholderTextColor="#7C9B92"
                autoCapitalize="none"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                value={values.time}
                onChangeText={(value) => updateField('time', value)}
                style={styles.input}
                placeholder="18:30"
                placeholderTextColor="#7C9B92"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Location (optional)</Text>
            <TextInput
              value={values.location}
              onChangeText={(value) => updateField('location', value)}
              style={styles.input}
              placeholder="Village hall"
              placeholderTextColor="#7C9B92"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              value={values.notes}
              onChangeText={(value) => updateField('notes', value)}
              style={[styles.input, styles.multilineInput]}
              placeholder="Bring snacks and costumes"
              placeholderTextColor="#7C9B92"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Who is this for?</Text>
            <View style={styles.checkboxList}>
              {FAMILY_MEMBERS.map((member) => {
                const selected = values.attendees.includes(member);

                return (
                  <Pressable
                    key={member}
                    onPress={() => toggleAttendee(member)}
                    style={[
                      styles.checkboxRow,
                      selected && styles.checkboxRowSelected,
                    ]}
                  >
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      <Text style={styles.checkboxTick}>{selected ? '✓' : ''}</Text>
                    </View>
                    <Text style={styles.checkboxLabel}>{member}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>{submitLabel}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D7ECE5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F3B33',
  },
  helperText: {
    marginTop: 6,
    color: '#58746C',
    lineHeight: 20,
  },
  fieldGroup: {
    marginTop: 18,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#31574C',
  },
  input: {
    backgroundColor: '#F4FBF8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7ECE5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F3B33',
  },
  multilineInput: {
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  checkboxList: {
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#D7ECE5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxRowSelected: {
    backgroundColor: '#F0F8F5',
    borderColor: '#4F9D88',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#8BB8AB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#4F9D88',
    borderColor: '#4F9D88',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1F3B33',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#4F9D88',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
