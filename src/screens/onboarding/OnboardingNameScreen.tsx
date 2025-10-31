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
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/UserContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface OnboardingNameScreenProps {
  navigation: any;
}

export const OnboardingNameScreen: React.FC<OnboardingNameScreenProps> = ({ navigation }) => {
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
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[Colors.background, Colors.surface]}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <Text style={styles.emoji}>👋</Text>
                <Text style={styles.title}>What should we call you?</Text>
                <Text style={styles.subtitle}>
                  Help us personalize your experience
                </Text>
              </View>

              <View style={styles.inputContainer}>
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

              <View style={styles.hint}>
                <Text style={styles.hintText}>
                  ✨ We use this to create a personal connection with you
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  !name.trim() && styles.buttonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!name.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Complete Setup</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textTertiary,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  emoji: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xxl + 4,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  input: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text,
    padding: Spacing.lg,
    textAlign: 'center',
    fontWeight: '600',
  },
  hint: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.primaryLight + '15',
    borderRadius: BorderRadius.md,
  },
  hintText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
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
    color: Colors.surface,
  },
});
