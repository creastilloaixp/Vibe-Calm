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
import { ExperienceLevel } from '../../types/preferences';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface OnboardingExperienceScreenProps {
  navigation: any;
}

const EXPERIENCE_OPTIONS: Array<{ level: ExperienceLevel; emoji: string; title: string; description: string }> = [
  {
    level: 'beginner',
    emoji: '🌱',
    title: 'Beginner',
    description: 'New to meditation and mindfulness',
  },
  {
    level: 'intermediate',
    emoji: '🌿',
    title: 'Intermediate',
    description: 'Some experience with mindfulness practices',
  },
  {
    level: 'advanced',
    emoji: '🌳',
    title: 'Advanced',
    description: 'Regular practitioner seeking deeper growth',
  },
];

export const OnboardingExperienceScreen: React.FC<OnboardingExperienceScreenProps> = ({ navigation }) => {
  const { setPreferences } = useUser();
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  const handleContinue = async () => {
    if (selected) {
      await setPreferences({ experienceLevel: selected });
      navigation.navigate('OnboardingTime');
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
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Your experience level</Text>
          <Text style={styles.subtitle}>
            This helps us recommend the right sessions for you
          </Text>

          <View style={styles.options}>
            {EXPERIENCE_OPTIONS.map((option) => {
              const isSelected = selected === option.level;

              return (
                <TouchableOpacity
                  key={option.level}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelected(option.level)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}>
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              !selected && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selected}
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
  optionEmoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  optionTitleSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
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
