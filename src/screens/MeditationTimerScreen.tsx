import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useMeditation } from '../context/MeditationContext';
import { MeditationSession, AmbientSound, AMBIENT_SOUNDS } from '../types/meditation';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface MeditationTimerScreenProps {
  route: {
    params: {
      session: MeditationSession;
    };
  };
  navigation: any;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIMER_SIZE = Math.min(SCREEN_WIDTH - 100, 300);
const STROKE_WIDTH = 12;

export const MeditationTimerScreen: React.FC<MeditationTimerScreenProps> = ({
  route,
  navigation,
}) => {
  const { session } = route.params;
  const { completeSession } = useMeditation();

  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(session.duration * 60); // seconds
  const [selectedSound, setSelectedSound] = useState<AmbientSound>('none');
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(session.duration * 60);

  const breatheAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    // Breathing animation
    breatheAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Glow animation when playing
    if (isPlaying) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = async () => {
    setIsPlaying(false);
    const actualDuration = startTimeRef.current - timeRemaining;

    try {
      await completeSession(session.id, actualDuration, selectedSound);
      Alert.alert(
        'Session Complete! 🎉',
        `Great work! You completed ${Math.floor(actualDuration / 60)} minutes of meditation.`,
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save session. Please try again.');
    }
  };

  const handleExit = () => {
    if (isPlaying || timeRemaining < startTimeRef.current) {
      Alert.alert(
        'Exit Session?',
        'Your progress will be saved. Do you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: async () => {
              const actualDuration = startTimeRef.current - timeRemaining;
              if (actualDuration > 30) {
                await completeSession(session.id, actualDuration, selectedSound);
              }
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeRemaining / (session.duration * 60);
  const circumference = 2 * Math.PI * ((TIMER_SIZE - STROKE_WIDTH) / 2);
  const strokeDashoffset = circumference * (1 - progress);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value * 0.3,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[session.color + '40', Colors.background]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Text style={styles.exitText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{session.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.glowOuter, glowStyle, { backgroundColor: session.color }]} />

          <Animated.View style={breatheStyle}>
            <View style={styles.timerCircle}>
              <Svg width={TIMER_SIZE} height={TIMER_SIZE}>
                {/* Background Circle */}
                <Circle
                  cx={TIMER_SIZE / 2}
                  cy={TIMER_SIZE / 2}
                  r={(TIMER_SIZE - STROKE_WIDTH) / 2}
                  stroke={Colors.textTertiary + '20'}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                {/* Progress Circle */}
                <Circle
                  cx={TIMER_SIZE / 2}
                  cy={TIMER_SIZE / 2}
                  r={(TIMER_SIZE - STROKE_WIDTH) / 2}
                  stroke={session.color}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
                />
              </Svg>

              <View style={styles.timerContent}>
                <Text style={styles.emoji}>{session.emoji}</Text>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.timerLabel}>
                  {isPlaying ? 'Breathing...' : 'Paused'}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{session.description}</Text>
        </View>

        {/* Ambient Sound Selector */}
        <View style={styles.soundContainer}>
          <Text style={styles.soundLabel}>Ambient Sound</Text>
          <View style={styles.soundButtons}>
            {Object.entries(AMBIENT_SOUNDS).slice(0, 4).map(([key, sound]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.soundButton,
                  selectedSound === key && styles.soundButtonActive,
                ]}
                onPress={() => setSelectedSound(key as AmbientSound)}
              >
                <Text style={styles.soundEmoji}>{sound.emoji}</Text>
                <Text style={styles.soundButtonLabel}>{sound.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: session.color }]}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
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
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  exitText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    width: TIMER_SIZE + 60,
    height: TIMER_SIZE + 60,
    borderRadius: (TIMER_SIZE + 60) / 2,
    opacity: 0.2,
  },
  timerCircle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  timerText: {
    fontSize: Typography.fontSize.xxxl + 8,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  timerLabel: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
  },
  descriptionContainer: {
    padding: Spacing.xl,
    paddingTop: 0,
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  soundContainer: {
    padding: Spacing.lg,
  },
  soundLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  soundButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  soundButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.small,
  },
  soundButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  soundEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  soundButtonLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  controls: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.large,
  },
  playButtonText: {
    fontSize: 32,
    color: Colors.surface,
  },
});
