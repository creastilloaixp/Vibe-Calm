import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/UserContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface OnboardingTimeScreenProps {
  navigation: any;
}

const TIME_OPTIONS = [
  { minutes: 5, label: '5 min', description: 'Quick check-ins' },
  { minutes: 10, label: '10 min', description: 'Short sessions' },
  { minutes: 15, label: '15 min', description: 'Balanced practice' },
  { minutes: 20, label: '20 min', description: 'Deep dive' },
  { minutes: 30, label: '30+ min', description: 'Extended sessions' },
];

export const OnboardingTimeScreen: React.FC<OnboardingTimeScreenProps> = ({ navigation }) => {
  const { setPreferences } = useUser();
  const [selected, setSelected] = useState<number | null>(null);

  const handleContinue = async () => {
    if (selected !== null) {
      await setPreferences({ dailyMinutes: selected });
      navigation.navigate('OnboardingName');
    }
  };

  return (
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
            <View style={styles.progressDot} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Daily time commitment</Text>
          <Text style={styles.subtitle}>
            How much time can you dedicate each day?
          </Text>

          <View style={styles.options}>
            {TIME_OPTIONS.map((option) => {
              const isSelected = selected === option.minutes;

              return (
                <TouchableOpacity
                  key={option.minutes}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelected(option.minutes)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                  </View>
                  <Text style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}>
                    {option.description}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>💡 You can always adjust this later</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              selected === null && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selected === null}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
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
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xxl + 4,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  options: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    ...Shadows.small,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  optionCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionCircleSelected: {
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.surface,
  },
  optionDescription: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  optionDescriptionSelected: {
    color: Colors.primaryDark,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: Spacing.xl,
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
