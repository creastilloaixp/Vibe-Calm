import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/UserContext';
import { UserGoal, GOAL_DEFINITIONS } from '../../types/preferences';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface OnboardingGoalsScreenProps {
  navigation: any;
}

export const OnboardingGoalsScreen: React.FC<OnboardingGoalsScreenProps> = ({ navigation }) => {
  const { setPreferences } = useUser();
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);

  const toggleGoal = (goal: UserGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleContinue = async () => {
    if (selectedGoals.length > 0) {
      await setPreferences({ goals: selectedGoals });
      navigation.navigate('OnboardingExperience');
    }
  };

  const goals = Object.keys(GOAL_DEFINITIONS) as UserGoal[];

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
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>What brings you here?</Text>
          <Text style={styles.subtitle}>
            Select one or more goals. We'll personalize your experience.
          </Text>

          <View style={styles.goalsGrid}>
            {goals.map((goal) => {
              const goalDef = GOAL_DEFINITIONS[goal];
              const isSelected = selectedGoals.includes(goal);

              return (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalCard,
                    isSelected && styles.goalCardSelected,
                  ]}
                  onPress={() => toggleGoal(goal)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.goalEmoji}>{goalDef.emoji}</Text>
                  <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                    {goalDef.label}
                  </Text>
                  <Text style={[styles.goalDescription, isSelected && styles.goalDescriptionSelected]}>
                    {goalDef.description}
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
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedGoals.length === 0 && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
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
  goalsGrid: {
    gap: Spacing.md,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.surface,
    ...Shadows.small,
  },
  goalCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  goalEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  goalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  goalLabelSelected: {
    color: Colors.primary,
  },
  goalDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  goalDescriptionSelected: {
    color: Colors.primaryDark,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
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
