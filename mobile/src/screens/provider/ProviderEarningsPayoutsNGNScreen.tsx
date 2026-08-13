import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderEarningsPayoutsNGN'>;

const transactions = [
  { title: 'Interior Painting - Smith Res.', meta: 'Completed Job • Oct 12', amount: '+₦850.00', positive: true },
  { title: 'Plumbing Consultation', meta: 'Completed Job • Oct 10', amount: '+₦120.00', positive: true },
  { title: 'Payout to GTBank ****9012', meta: 'Withdrawal • Oct 01', amount: '-₦3,000.00', positive: false },
];

export default function ProviderEarningsPayoutsNGNScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦4,250.00</Text>
          <Text style={styles.balanceHint}>Next payout scheduled for Oct 15</Text>
          <Button label="Withdraw Funds" onPress={() => {}} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Linked Account</Text>
            <Feather name="chevron-right" size={18} color={colors.textOnLightSecondary} />
          </View>
          <View style={styles.accountRow}>
            <View style={styles.accountIcon}>
              <Feather name="credit-card" size={18} color={colors.textOnLight} />
            </View>
            <View>
              <Text style={styles.accountName}>GTBank Checking</Text>
              <Text style={styles.accountMeta}>**** 9012</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings Overview</Text>
          <View style={styles.chartPlaceholder}>
            <Feather name="trending-up" size={28} color="#3A4A9E" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>
          {transactions.map((t) => (
            <View key={t.title} style={styles.txnRow}>
              <View style={[styles.txnIcon, !t.positive && styles.txnIconNeutral]}>
                <Feather
                  name={t.positive ? 'arrow-down-left' : 'arrow-up-right'}
                  size={16}
                  color={t.positive ? '#22C087' : colors.textOnLight}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txnTitle}>{t.title}</Text>
                <Text style={styles.txnMeta}>{t.meta}</Text>
              </View>
              <Text style={[styles.txnAmount, t.positive ? styles.txnAmountPositive : null]}>
                {t.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.md },
  balanceCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: 4,
  },
  balanceLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  balanceValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.display, color: colors.textOnLight, letterSpacing: -0.64 },
  balanceHint: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.sm,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  viewAll: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.orange },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  accountIcon: { width: 40, height: 40, borderRadius: 9999, backgroundColor: '#EDEEEF', alignItems: 'center', justifyContent: 'center' },
  accountName: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  accountMeta: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  chartPlaceholder: {
    height: 120,
    borderRadius: radius.sm,
    backgroundColor: '#EDEEEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txnIcon: { width: 40, height: 40, borderRadius: 9999, backgroundColor: 'rgba(34,192,135,0.1)', alignItems: 'center', justifyContent: 'center' },
  txnIconNeutral: { backgroundColor: colors.border },
  txnTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  txnMeta: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  txnAmount: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  txnAmountPositive: { color: '#22C087' },
});
