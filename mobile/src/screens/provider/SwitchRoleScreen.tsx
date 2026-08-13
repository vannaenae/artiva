import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SwitchRole'>;

export default function SwitchRoleScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar title="Switch Account Mode" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.heading}>Choose Your Role</Text>
          <Text style={styles.subheading}>
            Switch seamlessly between seeking services and providing them.
          </Text>
        </View>

        <View style={styles.currentCard}>
          <View style={styles.currentRow}>
            <View style={styles.currentLeft}>
              <View style={styles.currentIcon}>
                <Feather name="user" size={20} color={colors.white} />
              </View>
              <View>
                <Text style={styles.currentLabel}>CURRENTLY ACTIVE AS</Text>
                <Text style={styles.currentRole}>Customer</Text>
              </View>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.currentBody}>
            You are currently browsing services, managing bookings, and discovering providers.
          </Text>
        </View>

        <View style={styles.switchCard}>
          <View style={styles.switchHeader}>
            <View style={styles.switchLeft}>
              <View style={styles.switchIcon}>
                <Feather name="tool" size={18} color={colors.textOnLight} />
              </View>
              <Text style={styles.switchTitle}>Switch to Provider</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textOnLightSecondary} />
          </View>
          <View style={styles.switchBenefits}>
            <View style={styles.switchBenefit}>
              <Feather name="briefcase" size={14} color={colors.textOnLightSecondary} />
              <Text style={styles.switchBenefitText}>Manage your service listings and availability.</Text>
            </View>
            <View style={styles.switchBenefit}>
              <Feather name="dollar-sign" size={14} color={colors.textOnLightSecondary} />
              <Text style={styles.switchBenefitText}>Track earnings and receive secure payments.</Text>
            </View>
          </View>
          <Button
            label="Switch to Provider Mode"
            onPress={() => navigation.navigate('ProviderProfileVerified')}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Feather name="check-circle" size={20} color="#22C087" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Verified Provider</Text>
            <Text style={styles.infoBody}>Your background check and documents are up to date.</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.lg },
  header: { alignItems: 'center', gap: 4 },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
  currentCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.md,
  },
  currentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  currentLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  currentIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textOnLightSecondary,
    letterSpacing: 0.6,
  },
  currentRole: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  activeBadge: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    borderRadius: 9999,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  activeBadgeText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: '#10B981' },
  currentBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  switchCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.md,
  },
  switchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  switchIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  switchBenefits: {
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  switchBenefit: { flex: 1, flexDirection: 'row', gap: spacing.sm },
  switchBenefitText: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textOnLightSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    alignItems: 'center',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(34,192,135,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  infoBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
});
