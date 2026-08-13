import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'BackgroundCheckConsent'>;

const checks = ['Identity Verification (SSN Trace)', 'National Criminal Records', 'Sex Offender Registry Search'];

export default function BackgroundCheckConsentScreen({ navigation }: Props) {
  const [consented, setConsented] = useState(false);

  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Feather name="shield" size={28} color={colors.orange} />
          </View>
          <Text style={styles.heading}>Background Check Consent</Text>
          <Text style={styles.subheading}>We need your permission to proceed</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="clock" size={18} color={colors.textOnLight} />
              <Text style={styles.sectionTitle}>The Process</Text>
            </View>
            <Text style={styles.sectionBody}>
              To ensure the safety and security of our high-end marketplace, we require all
              service providers to undergo a standard background check. This process is secure,
              confidential, and typically takes 1-3 business days to complete.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="search" size={18} color={colors.textOnLight} />
              <Text style={styles.sectionTitle}>What We Check</Text>
            </View>
            {checks.map((c) => (
              <View key={c} style={styles.checkRow}>
                <Feather name="check" size={16} color="#10B981" />
                <Text style={styles.checkText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.consentCard} onPress={() => setConsented((v) => !v)}>
          <View style={[styles.checkbox, consented && styles.checkboxChecked]}>
            {consented && <Feather name="check" size={16} color={colors.white} />}
          </View>
          <Text style={styles.consentText}>
            <Text style={styles.consentBold}>I consent</Text> to Artiva conducting a background
            check. I acknowledge that I have read and agree to the{' '}
            <Text style={styles.consentLink}>FCRA Disclosure</Text> and{' '}
            <Text style={styles.consentLink}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          label="Submit Application"
          icon="arrow-right"
          disabled={!consented}
          onPress={() => navigation.navigate('PendingStatus')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.xs },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    textAlign: 'center',
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.lg,
  },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  sectionBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    lineHeight: 22,
  },
  divider: { height: 1, backgroundColor: 'rgba(221,193,174,0.3)' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  consentCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.5)',
    borderRadius: radius.md,
    padding: 17,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.orange, borderColor: colors.orange },
  consentText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
    lineHeight: 20,
  },
  consentBold: { fontFamily: typography.fontFamily.bold },
  consentLink: { color: colors.orange },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: 'rgba(248,249,250,0.9)',
  },
});
