import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { registerFamilyMember, signInFamilyMember } from '../firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  const submitLabel = mode === 'signin' ? 'Sign in' : 'Create account';

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Enter both your email and password.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInFamilyMember(email.trim(), password);
      } else {
        await registerFamilyMember(email.trim(), password);
      }
    } catch (error) {
      Alert.alert('Authentication error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Welcome to</Text>
        <Text style={styles.title}>FamilyDiary</Text>
        <Text style={styles.subtitle}>
          A warm shared space for your family to add, edit, and share events in
          real time.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="familymember@email.com"
          placeholderTextColor="#7C9B92"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7C9B92"
          secureTextEntry
        />

        <Pressable onPress={handleSubmit} style={styles.primaryButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>{submitLabel}</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => setMode((currentMode) => (currentMode === 'signin' ? 'signup' : 'signin'))}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            {mode === 'signin'
              ? 'Need to add a family member? Create an account'
              : 'Already have an account? Sign in'}
          </Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Starter setup note</Text>
          <Text style={styles.infoText}>
            Add your Firebase project details in app.json before signing in on a
            real device.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF3EC',
    justifyContent: 'center',
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#CBE5DC',
  },
  eyebrow: {
    fontSize: 16,
    color: '#4F9D88',
    fontWeight: '700',
  },
  title: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: '800',
    color: '#1F3B33',
  },
  subtitle: {
    marginTop: 12,
    color: '#4B6A62',
    lineHeight: 22,
  },
  input: {
    marginTop: 16,
    backgroundColor: '#F4FBF8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7ECE5',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#1F3B33',
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: '#4F9D88',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2E7462',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 24,
    backgroundColor: '#F8FCFB',
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    color: '#31574C',
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    color: '#58746C',
    lineHeight: 20,
  },
});
