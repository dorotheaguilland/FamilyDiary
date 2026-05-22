import React from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { formatEventDateTime, formatEventForSharing } from '../firebase/events';

export default function EventCard({ event, onEdit, onDelete }) {
  const handleShare = async () => {
    await Share.share({
      message: formatEventForSharing(event),
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>{formatEventDateTime(event)}</Text>
        </View>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Attending</Text>
        <View style={styles.attendeeWrap}>
          {event.attendees.map((person) => (
            <View key={person} style={styles.attendeeChip}>
              <Text style={styles.attendeeText}>{person}</Text>
            </View>
          ))}
        </View>
      </View>

      {event.location ? (
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.bodyText}>{event.location}</Text>
        </View>
      ) : null}

      {event.notes ? (
        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.bodyText}>{event.notes}</Text>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable onPress={onEdit} style={[styles.actionButton, styles.editButton]}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D7ECE5',
    shadowColor: '#B5D7CE',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F3B33',
  },
  date: {
    marginTop: 4,
    fontSize: 14,
    color: '#4B6A62',
  },
  shareButton: {
    backgroundColor: '#E6F5F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#2E7462',
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F9D88',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  attendeeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attendeeChip: {
    backgroundColor: '#F0F8F5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  attendeeText: {
    color: '#2E5C50',
    fontWeight: '600',
  },
  bodyText: {
    color: '#35574E',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  editButton: {
    backgroundColor: '#E6F5F0',
  },
  editButtonText: {
    color: '#2E7462',
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#FFF0EC',
  },
  deleteButtonText: {
    color: '#D05B39',
    fontWeight: '700',
  },
});
