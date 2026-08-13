import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderStatusToggle'>;

const jobs = [
  { title: 'Premium Home Cleaning', client: 'Sarah Jenkins', status: 'In Progress', amount: '$120.00', active: true },
  { title: 'Furniture Assembly', client: 'David Chen', status: 'Upcoming', amount: '4:00 PM', active: false },
];

export default function ProviderStatusToggleScreen({ navigation }: Props) {
  const [online, setOnline] = useState(true);

  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusDotWrap}>
              <View style={styles.statusDot} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>{online ? 'Currently Online' : 'Currently Offline'}</Text>
              <Text style={styles.statusSubtitle}>
                {online ? 'Accepting new requests in your area' : "You won't receive new requests"}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{ true: '#10B981', false: colors.border }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Jobs</Text>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </View>
        {jobs.map((j) => (
          <View key={j.title} style={styles.jobCard}>
            <View style={styles.jobRow}>
              <View style={styles.jobIcon}>
                <Feather name="briefcase" size={20} color="#3A4A9E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{j.title}</Text>
                <Text style={styles.jobClient}>Client: {j.client}</Text>
              </View>
              <View style={[styles.jobBadge, j.active && styles.jobBadgeActive]}>
                <Text style={[styles.jobBadgeText, j.active && styles.jobBadgeTextActive]}>
                  {j.status}
                </Text>
              </View>
            </View>
            <View style={styles.jobFooter}>
              <Text style={styles.jobFooterLabel}>{j.active ? 'Expected Completion' : 'Starts at'}</Text>
              <Text style={styles.jobFooterValue}>{j.amount}</Text>
            </View>
          </View>
        ))}

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsValue}>$245.50</Text>
            <Text style={styles.earningsDelta}>+12%</Text>
          </View>
          <View style={styles.earningsStatsRow}>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatLabel}>Jobs Done</Text>
              <Text style={styles.earningsStatValue}>3</Text>
            </View>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatLabel}>Hours</Text>
              <Text style={styles.earningsStatValue}>4.5</Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.lg },
  statusCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: radius.md,
    padding: 25,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  statusDotWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: { width: 16, height: 16, borderRadius: 9999, backgroundColor: '#10B981' },
  statusTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xxl, color: colors.textOnLight },
  statusSubtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  viewAll: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: '#904D00', letterSpacing: 0.6 },
  jobCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.md,
  },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  jobIcon: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: '#EDEEEF', alignItems: 'center', justifyContent: 'center' },
  jobTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  jobClient: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  jobBadge: { backgroundColor: '#E7E8E9', borderRadius: 9999, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  jobBadgeActive: { backgroundColor: 'rgba(16,185,129,0.1)' },
  jobBadgeText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLight },
  jobBadgeTextActive: { color: '#10B981' },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  jobFooterLabel: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  jobFooterValue: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  earningsCard: { backgroundColor: colors.navy, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  earningsLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.white, opacity: 0.8 },
  earningsRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  earningsValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.display, color: colors.white },
  earningsDelta: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: '#6FFBBE' },
  earningsStatsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#414756',
    paddingTop: spacing.sm,
  },
  earningsStat: { gap: 4 },
  earningsStatLabel: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.white, opacity: 0.7 },
  earningsStatValue: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.white },
});
