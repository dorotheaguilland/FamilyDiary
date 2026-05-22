import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EventCard from '../components/EventCard';
import { deleteEvent, subscribeToEvents } from '../firebase/events';
import { signOutFamilyMember } from '../firebase/auth';

const getNowSortKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

export default function HomeScreen({ navigation, user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (nextEvents) => {
        setEvents(nextEvents);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Sync problem', error.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const upcomingEvents = useMemo(
    () => events.filter((event) => event.eventSortKey >= getNowSortKey()),
    [events],
  );

  const handleDelete = (event) => {
    Alert.alert('Delete this event?', 'This action removes it for the whole family.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(event.id);
          } catch (error) {
            Alert.alert('Delete failed', error.message);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOutFamilyMember();
    } catch (error) {
      Alert.alert('Sign out failed', error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={upcomingEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.greeting}>Hello, {user.email}</Text>
            <Text style={styles.heading}>Keep everyone in step</Text>
            <Text style={styles.subheading}>
              Upcoming family plans update live for everyone the moment they are
              added or edited.
            </Text>
            <View style={styles.headerButtons}>
              <Pressable
                onPress={() => navigation.navigate('AddEvent')}
                style={[styles.headerButton, styles.primaryHeaderButton]}
              >
                <Text style={styles.primaryHeaderButtonText}>Add Event</Text>
              </Pressable>
              <Pressable
                onPress={handleLogout}
                style={[styles.headerButton, styles.secondaryHeaderButton]}
              >
                <Text style={styles.secondaryHeaderButtonText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onEdit={() => navigation.navigate('EditEvent', { event: item })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#4F9D88" />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No upcoming events yet</Text>
              <Text style={styles.emptyText}>
                Add your first family plan so everyone can see it instantly.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 28,
  },
  headerCard: {
    backgroundColor: '#DFF3EC',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  greeting: {
    color: '#2E7462',
    fontWeight: '700',
  },
  heading: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: '#1F3B33',
  },
  subheading: {
    marginTop: 10,
    color: '#44665D',
    lineHeight: 21,
  },
  headerButtons: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryHeaderButton: {
    backgroundColor: '#4F9D88',
  },
  primaryHeaderButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryHeaderButton: {
    backgroundColor: '#FFFFFF',
  },
  secondaryHeaderButtonText: {
    color: '#2E7462',
    fontWeight: '700',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F3B33',
  },
  emptyText: {
    marginTop: 8,
    color: '#58746C',
    textAlign: 'center',
    lineHeight: 20,
  },
});
