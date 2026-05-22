import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';

const eventsCollection = collection(db, 'events');

const normalizeEventPayload = (values) => {
  const title = values.title.trim();
  const date = values.date.trim();
  const time = values.time.trim();
  const location = values.location.trim();
  const notes = values.notes.trim();
  const attendees = values.attendees;

  return {
    title,
    date,
    time,
    location,
    notes,
    attendees,
    eventSortKey: `${date}T${time}`,
  };
};

export const subscribeToEvents = (onUpdate, onError) => {
  const eventsQuery = query(eventsCollection, orderBy('eventSortKey', 'asc'));

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const nextEvents = snapshot.docs.map((eventDocument) => ({
        id: eventDocument.id,
        ...eventDocument.data(),
      }));

      onUpdate(nextEvents);
    },
    onError,
  );
};

export const addEvent = async (values, userEmail) => {
  const payload = normalizeEventPayload(values);

  return addDoc(eventsCollection, {
    ...payload,
    createdBy: userEmail || 'Unknown family member',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateEvent = async (eventId, values, userEmail) => {
  const payload = normalizeEventPayload(values);

  return updateDoc(doc(db, 'events', eventId), {
    ...payload,
    updatedBy: userEmail || 'Unknown family member',
    updatedAt: serverTimestamp(),
  });
};

export const deleteEvent = (eventId) => deleteDoc(doc(db, 'events', eventId));

export const formatEventDateTime = (event) => {
  const parsedDate = new Date(`${event.date}T${event.time}:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return `${event.date} at ${event.time}`;
  }

  return parsedDate.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatEventForSharing = (event) => {
  const details = [
    `📅 ${event.title}`,
    `When: ${formatEventDateTime(event)}`,
    `Who: ${event.attendees.join(', ')}`,
  ];

  if (event.location) {
    details.push(`Where: ${event.location}`);
  }

  if (event.notes) {
    details.push(`Notes: ${event.notes}`);
  }

  return details.join('\n');
};
