import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface OnboardingWelcomeScreenProps {
  navigation: any;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ navigation }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Text style={styles.logoEmoji}>✨</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Vibe Calm</Text>
          <Text style={styles.subtitle}>
            Your personal sanctuary for mindfulness, meditation, and emotional wellness
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem emoji="🧘" text="Guided meditation sessions" />
          <FeatureItem emoji="📊" text="Track your emotional journey" />
          <FeatureItem emoji="💡" text="AI-powered insights" />
          <FeatureItem emoji="🎯" text="Personalized recommendations" />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OnboardingGoals')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Begin Your Journey</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Takes less than 2 minutes</Text>
      </View>
    </LinearGradient>
  );
};

const FeatureItem: React.FC<{ emoji: string; text: string }> = ({ emoji, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl * 2,
    paddingBottom: Spacing.xxl,
  },
  logoContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 64,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.xl,
    color: Colors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
  appName: {
    fontSize: Typography.fontSize.xxxl + 8,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.surface,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    paddingHorizontal: Spacing.md,
  },
  features: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: Typography.fontSize.md,
    color: Colors.surface,
    fontWeight: '500',
  },
  button: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.large,
  },
  buttonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  hint: {
    textAlign: 'center',
    color: Colors.surface,
    opacity: 0.7,
    fontSize: Typography.fontSize.sm,
  },
});
