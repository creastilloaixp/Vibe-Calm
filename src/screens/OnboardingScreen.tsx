import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const { setUserName } = useUser();

  const handleContinue = async () => {
    if (name.trim()) {
      await setUserName(name.trim());
      navigation.navigate('Welcome');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.emoji}>✨</Text>
              <Text style={styles.title}>Welcome to</Text>
              <Text style={styles.appName}>Vibe Calm</Text>
              <Text style={styles.subtitle}>
                Your journey to mindfulness begins here
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>What's your name?</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.textTertiary}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !name.trim() && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!name.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl * 2,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    color: Colors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
  appName: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.surface,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.surface,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
  },
  input: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text,
    padding: Spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.large,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
});
