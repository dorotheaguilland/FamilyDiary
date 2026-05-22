import React from 'react';
import { Alert } from 'react-native';
import EventForm from '../components/EventForm';
import { addEvent } from '../firebase/events';

export default function AddEventScreen({ navigation, user }) {
  const handleAddEvent = async (values) => {
    try {
      await addEvent(values, user?.email);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save event', error.message);
    }
  };

  return (
    <EventForm
      submitLabel="Save Event"
      helperText="Add a new plan for the family. Everyone signed in will see it update in real time."
      onSubmit={handleAddEvent}
    />
  );
}
