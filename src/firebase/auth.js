import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './config';

export const signInFamilyMember = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerFamilyMember = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signOutFamilyMember = () => signOut(auth);
