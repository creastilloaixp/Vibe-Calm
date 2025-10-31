import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { useMood } from '../context/MoodContext';
import { useMeditation } from '../context/MeditationContext';
import { MoodType, MOOD_DEFINITIONS } from '../types/mood';
import { MoodNoteModal } from '../components/MoodNoteModal';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

type TabType = 'moods' | 'vibes';

interface DashboardScreenProps {
  navigation?: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { userName } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('moods');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>
              {userName?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'moods' && styles.tabActive]}
            onPress={() => setActiveTab('moods')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'moods' && styles.tabTextActive,
              ]}
            >
              Moods
            </Text>
            {activeTab === 'moods' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'vibes' && styles.tabActive]}
            onPress={() => setActiveTab('vibes')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'vibes' && styles.tabTextActive,
              ]}
            >
              Vibes
            </Text>
            {activeTab === 'vibes' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'moods' ? (
            <MoodsContent navigation={navigation} />
          ) : (
            <VibesContent navigation={navigation} />
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const MoodsContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { saveMood, todaysMoods, stats, isLoading } = useMood();
  const [savingMood, setSavingMood] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const moods: Array<{ type: MoodType; emoji: string; label: string; color: string }> = [
    { type: 'happy', emoji: '😊', label: 'Happy', color: Colors.success },
    { type: 'calm', emoji: '😌', label: 'Calm', color: Colors.primary },
    { type: 'sad', emoji: '😔', label: 'Sad', color: Colors.accent },
    { type: 'anxious', emoji: '😰', label: 'Anxious', color: Colors.warning },
    { type: 'tired', emoji: '😴', label: 'Tired', color: Colors.secondary },
    { type: 'stressed', emoji: '😤', label: 'Stressed', color: Colors.error },
  ];

  const handleMoodSelect = (moodType: MoodType) => {
    setSelectedMood(moodType);
    setShowNoteModal(true);
  };

  const handleSaveMoodWithNote = async (note: string) => {
    if (!selectedMood) return;

    try {
      setSavingMood(true);
      await saveMood(selectedMood, note || undefined);
      setShowNoteModal(false);
      Alert.alert(
        'Mood Saved! ✨',
        `We've recorded your ${MOOD_DEFINITIONS[selectedMood].label} mood.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setSavingMood(false);
      setSelectedMood(null);
    }
  };

  const handleSkipNote = async () => {
    if (!selectedMood) return;

    try {
      setSavingMood(true);
      await saveMood(selectedMood);
      setShowNoteModal(false);
      Alert.alert(
        'Mood Saved! ✨',
        `We've recorded your ${MOOD_DEFINITIONS[selectedMood].label} mood.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setSavingMood(false);
      setSelectedMood(null);
    }
  };

  const handleCloseModal = () => {
    setShowNoteModal(false);
    setSelectedMood(null);
  };

  return (
    <View style={styles.tabContent}>
      {/* Stats Card */}
      {stats.totalEntries > 0 && (
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak 🔥</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalEntries}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>
                {stats.mostFrequent ? MOOD_DEFINITIONS[stats.mostFrequent].emoji : '😌'}
              </Text>
              <Text style={styles.statLabel}>Most Common</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <Text style={styles.sectionSubtitle}>
          Select your current mood to track your emotional journey
        </Text>
      </View>

      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[styles.moodCard, { borderColor: mood.color }]}
            activeOpacity={0.7}
            onPress={() => handleMoodSelect(mood.type)}
            disabled={savingMood}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Moods</Text>
          {todaysMoods.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('MoodHistory')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : todaysMoods.length > 0 ? (
          <View style={styles.todayMoodsContainer}>
            {todaysMoods.slice(0, 5).map((mood) => {
              const moodDef = MOOD_DEFINITIONS[mood.type];
              const time = new Date(mood.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <View key={mood.id} style={styles.moodEntryCard}>
                  <Text style={styles.moodEntryEmoji}>{moodDef.emoji}</Text>
                  <View style={styles.moodEntryInfo}>
                    <Text style={styles.moodEntryLabel}>{moodDef.label}</Text>
                    <Text style={styles.moodEntryTime}>{time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📊</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your moods to see patterns
            </Text>
          </View>
        )}
      </View>

      {/* Mood Note Modal */}
      <MoodNoteModal
        visible={showNoteModal}
        moodType={selectedMood}
        onSave={handleSaveMoodWithNote}
        onSkip={handleSkipNote}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const VibesContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { availableSessions, stats, todaysSessions, getFavoriteStatus, toggleFavorite } = useMeditation();

  const handleStartSession = (session: any) => {
    navigation.navigate('MeditationTimer', { session });
  };

  return (
    <View style={styles.tabContent}>
      {/* Stats Card */}
      {stats.totalSessions > 0 && (
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak 🔥</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meditation Sessions</Text>
        <Text style={styles.sectionSubtitle}>
          Guided experiences for mindfulness and peace
        </Text>
      </View>

      <View style={styles.vibesGrid}>
        {availableSessions.map((session) => {
          const isFavorite = getFavoriteStatus(session.id);

          return (
            <TouchableOpacity
              key={session.id}
              style={styles.vibeCard}
              onPress={() => handleStartSession(session)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[session.color + '90', session.color]}
                style={styles.vibeCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.vibeEmoji}>{session.emoji}</Text>
                <View style={styles.vibeInfo}>
                  <Text style={styles.vibeLabel}>{session.title}</Text>
                  <Text style={styles.vibeDuration}>{session.duration} min</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(session.id);
                  }}
                  style={styles.favoriteButton}
                >
                  <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {todaysSessions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Sessions</Text>
          <View style={styles.todaySessionsContainer}>
            {todaysSessions.slice(0, 3).map((session) => {
              const time = new Date(session.completedAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });
              const minutes = Math.floor(session.duration / 60);

              return (
                <View key={session.id} style={styles.sessionEntryCard}>
                  <Text style={styles.sessionEntryEmoji}>✓</Text>
                  <View style={styles.sessionEntryInfo}>
                    <Text style={styles.sessionEntryLabel}>{session.sessionTitle}</Text>
                    <Text style={styles.sessionEntryTime}>{time} • {minutes} min</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
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
    paddingTop: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  profileText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
    marginTop: Spacing.md,
  },
  tabContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  moodCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  vibesGrid: {
    gap: Spacing.md,
  },
  vibeCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  vibeCardGradient: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vibeEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  vibeLabel: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.surface,
  },
  vibeDuration: {
    fontSize: Typography.fontSize.sm,
    color: Colors.surface,
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    ...Shadows.small,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statEmoji: {
    fontSize: Typography.fontSize.xxl,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  viewAllText: {
    fontSize: Typography.fontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  todayMoodsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  moodEntryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.small,
  },
  moodEntryEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  moodEntryInfo: {
    flex: 1,
  },
  moodEntryLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  moodEntryTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  vibeInfo: {
    flex: 1,
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  todaySessionsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sessionEntryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.small,
  },
  sessionEntryEmoji: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  sessionEntryInfo: {
    flex: 1,
  },
  sessionEntryLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  sessionEntryTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
