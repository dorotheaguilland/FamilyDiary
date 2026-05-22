import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import EventForm from '../components/EventForm';
import { updateEvent } from '../firebase/events';

export default function EditEventScreen({ route, navigation, user }) {
  const event = route.params?.event;

  if (!event) {
    return (
      <View style={styles.missingContainer}>
        <Text style={styles.missingTitle}>Event not found</Text>
        <Text style={styles.missingText}>
          Go back and choose the event you want to edit.
        </Text>
      </View>
    );
  }

  const handleUpdateEvent = async (values) => {
    try {
      await updateEvent(event.id, values, user?.email);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not update event', error.message);
    }
  };

  return (
    <EventForm
      submitLabel="Update Event"
      helperText="Change any detail and the updated event will sync for every family member."
      initialValues={event}
      onSubmit={handleUpdateEvent}
    />
  );
}

const styles = StyleSheet.create({
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F3B33',
  },
  missingText: {
    marginTop: 8,
    color: '#58746C',
    textAlign: 'center',
  },
});
