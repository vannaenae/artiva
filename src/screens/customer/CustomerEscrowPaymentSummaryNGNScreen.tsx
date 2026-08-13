import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CustomerEscrowPaymentSummaryNGN'>;

const lineItems = [
  { label: 'Service Fee', value: '₦2,500,000.00' },
  { label: 'Platform Fee (5%)', value: '₦125,000.00' },
  { label: 'Processing Fee', value: '₦35,000.00' },
];

export default function CustomerEscrowPaymentSummaryNGNScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll dark={false}>
      <TopAppBar title="Payment Summary" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.projectTitle}>Website Redesign UI/UX</Text>
              <Text style={styles.projectMeta}>Service provided by Elena Rostova</Text>
            </View>
            <View style={styles.milestoneBadge}>
              <Text style={styles.milestoneText}>Milestone 1</Text>
            </View>
          </View>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownLabel}>ESCROW BREAKDOWN</Text>
          {lineItems.map((item) => (
            <View key={item.label} style={styles.lineRow}>
              <Text style={styles.lineLabel}>{item.label}</Text>
              <Text style={styles.lineValue}>{item.value}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to Escrow</Text>
            <Text style={styles.totalValue}>₦2,660,000.00</Text>
          </View>
        </View>

        <View style={styles.explainCard}>
          <View style={styles.explainIcon}>
            <Feather name="shield" size={20} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.explainTitle}>Funds Held Securely in Escrow</Text>
            <Text style={styles.explainBody}>
              Your payment of ₦2,660,000.00 will be held safely in an Artiva escrow account.
              Funds are only released to the service provider once you approve the completed
              milestone.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.breakdownLabel}>PAYMENT METHOD</Text>
            <Text style={styles.changeText}>Change</Text>
          </View>
          <View style={styles.paymentRow}>
            <View style={styles.cardIcon}>
              <Feather name="credit-card" size={18} color={colors.textOnLight} />
            </View>
            <View>
              <Text style={styles.paymentTitle}>Visa ending in 4242</Text>
              <Text style={styles.paymentMeta}>Expires 12/25</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Cancel" variant="outline" fullWidth={false} onPress={() => navigation.goBack()} />
        <View style={{ flex: 2 }}>
          <Button
            label="Fund Escrow"
            icon="lock"
            iconPosition="left"
            onPress={() => navigation.navigate('CustomerHome')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.sm,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  projectMeta: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  milestoneBadge: { backgroundColor: 'rgba(34,192,135,0.1)', borderWidth: 1, borderColor: 'rgba(34,192,135,0.3)', borderRadius: 9999, paddingHorizontal: 13, paddingVertical: 5 },
  milestoneText: { fontFamily: typography.fontFamily.semibold, fontSize: 12, color: '#22C087' },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: radius.md,
    overflow: 'hidden',
    padding: spacing.md,
    gap: spacing.sm,
  },
  breakdownLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary, letterSpacing: 0.7 },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  lineLabel: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLightSecondary },
  lineValue: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLight },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(243,244,245,0.5)',
    marginHorizontal: -spacing.md,
    marginBottom: -spacing.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  totalLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xxl, color: colors.textOnLight },
  totalValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.display, color: colors.textOnLight },
  explainCard: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.navy, borderRadius: radius.md, padding: spacing.md },
  explainIcon: { width: 32, height: 32, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  explainTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.white, marginBottom: 4 },
  explainBody: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textSecondary, lineHeight: 20 },
  changeText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: '#904D00' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: 'rgba(221,193,174,0.5)', borderRadius: radius.sm, padding: spacing.sm },
  cardIcon: { width: 48, height: 32, borderRadius: 4, backgroundColor: '#E7E8E9', borderWidth: 1, borderColor: 'rgba(221,193,174,0.3)', alignItems: 'center', justifyContent: 'center' },
  paymentTitle: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.textOnLight },
  paymentMeta: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  footer: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(221,193,174,0.3)' },
});
