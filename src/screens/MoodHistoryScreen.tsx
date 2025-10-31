import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useMood } from '../context/MoodContext';
import { MOOD_DEFINITIONS, MoodEntry } from '../types/mood';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface MoodHistoryScreenProps {
  navigation: any;
}

export const MoodHistoryScreen: React.FC<MoodHistoryScreenProps> = ({ navigation }) => {
  const { moods } = useMood();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [chartData, setChartData] = useState<any>(null);
  const [distributionData, setDistributionData] = useState<any>(null);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    prepareChartData();
  }, [moods, timeRange]);

  const prepareChartData = () => {
    const days = timeRange === 'week' ? 7 : 30;
    const now = new Date();
    const labels: string[] = [];
    const dataPoints: number[] = [];

    // Prepare labels and data points for line chart
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Get moods for this day
      const dayMoods = moods.filter(
        (mood) =>
          mood.timestamp >= date.getTime() &&
          mood.timestamp < nextDate.getTime()
      );

      // Calculate average mood value for the day
      const avgValue = dayMoods.length > 0
        ? dayMoods.reduce((sum, mood) => sum + MOOD_DEFINITIONS[mood.type].value, 0) / dayMoods.length
        : 3; // Default to middle value

      labels.push(
        timeRange === 'week'
          ? date.toLocaleDateString('en-US', { weekday: 'short' })
          : date.getDate().toString()
      );
      dataPoints.push(avgValue);
    }

    setChartData({
      labels,
      datasets: [
        {
          data: dataPoints,
          color: (opacity = 1) => `rgba(139, 127, 216, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    });

    // Prepare distribution data for bar chart
    const moodCounts: Record<string, number> = {
      Happy: 0,
      Calm: 0,
      Sad: 0,
      Anxious: 0,
      Tired: 0,
      Stressed: 0,
    };

    const recentMoods = moods.filter((mood) => {
      const moodDate = new Date(mood.timestamp);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return moodDate >= cutoffDate;
    });

    recentMoods.forEach((mood) => {
      const label = MOOD_DEFINITIONS[mood.type].label;
      moodCounts[label]++;
    });

    setDistributionData({
      labels: Object.keys(moodCounts),
      datasets: [
        {
          data: Object.values(moodCounts),
        },
      ],
    });
  };

  const getRecentMoodsList = () => {
    return moods.slice(0, 20); // Show last 20 entries
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood History</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === 'week' && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange('week')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === 'week' && styles.timeRangeTextActive,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === 'month' && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange('month')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === 'month' && styles.timeRangeTextActive,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mood Trend Chart */}
          {chartData && moods.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Mood Trend</Text>
              <Text style={styles.chartSubtitle}>
                Your emotional journey over time
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={chartData}
                  width={Math.max(screenWidth - 32, chartData.labels.length * 50)}
                  height={220}
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(139, 127, 216, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(123, 116, 134, ${opacity})`,
                    style: {
                      borderRadius: BorderRadius.lg,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: Colors.primary,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            </View>
          )}

          {/* Mood Distribution Chart */}
          {distributionData && moods.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Mood Distribution</Text>
              <Text style={styles.chartSubtitle}>
                Breakdown of your moods
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={distributionData}
                  width={Math.max(screenWidth - 32, distributionData.labels.length * 60)}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(139, 127, 216, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(123, 116, 134, ${opacity})`,
                    style: {
                      borderRadius: BorderRadius.lg,
                    },
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars
                />
              </ScrollView>
            </View>
          )}

          {/* Recent Entries List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {moods.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>📝</Text>
                <Text style={styles.emptyStateText}>
                  No mood entries yet. Start tracking your moods to see your history!
                </Text>
              </View>
            ) : (
              <View style={styles.entriesList}>
                {getRecentMoodsList().map((mood) => {
                  const moodDef = MOOD_DEFINITIONS[mood.type];
                  const date = new Date(mood.timestamp);
                  const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                  return (
                    <View key={mood.id} style={styles.entryCard}>
                      <Text style={styles.entryEmoji}>{moodDef.emoji}</Text>
                      <View style={styles.entryInfo}>
                        <Text style={styles.entryLabel}>{moodDef.label}</Text>
                        <Text style={styles.entryTime}>
                          {dateStr} at {timeStr}
                        </Text>
                        {mood.note && (
                          <Text style={styles.entryNote}>{mood.note}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
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
    paddingTop: Spacing.xl,
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
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.primary,
  },
  timeRangeText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeRangeTextActive: {
    color: Colors.surface,
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  chartTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  chartSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  chart: {
    borderRadius: BorderRadius.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  entriesList: {
    gap: Spacing.sm,
  },
  entryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.small,
  },
  entryEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  entryInfo: {
    flex: 1,
  },
  entryLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  entryTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  entryNote: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
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
});
