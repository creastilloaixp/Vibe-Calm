import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { useUser } from '../context/UserContext';
import { Colors, Typography, Spacing } from '../constants/theme';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { userName, completeOnboarding } = useUser();

  // Animation values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const breatheAnim = useSharedValue(1);

  useEffect(() => {
    // Fade in and scale animation
    fadeAnim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });

    scaleAnim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.2)),
    });

    // Breathing animation (continuous)
    breatheAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Navigate to dashboard after 3 seconds
    const timer = setTimeout(async () => {
      await completeOnboarding();
      navigation.replace('Dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheAnim.value }],
  }));

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View style={[styles.content, containerStyle]}>
        <Animated.View style={[styles.circleContainer, breatheStyle]}>
          <View style={styles.circle}>
            <View style={styles.circleInner}>
              <Text style={styles.emoji}>🧘</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Welcome, {userName}</Text>
          <Text style={styles.message}>Let's find your calm</Text>
        </View>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  circleContainer: {
    marginBottom: Spacing.xxxl,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 72,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  greeting: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.fontSize.lg,
    color: Colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: Colors.surface,
    width: 24,
  },
});
