import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'TermsConsent'>;

const sections = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By accessing or using the Artiva platform, you agree to be bound by these Terms of Service and all terms incorporated by reference.',
  },
  {
    heading: '2. User Accounts',
    body: 'You may need to register for an account to access some or all of our services. Keep your account information up-to-date.',
  },
  {
    heading: '3. Privacy and Data Collection',
    body: 'Our Privacy Policy describes how we handle the information you provide. We collect data primarily to facilitate secure transactions and optimize pairing.',
  },
  {
    heading: '4. Service Provider Obligations',
    body: 'Providers must maintain professional standards, adhere to local regulations, and ensure all representations of their services are accurate.',
  },
  {
    heading: '5. Limitation of Liability',
    body: 'To the maximum extent permitted by law, Artiva shall not be liable for any indirect, incidental, or consequential damages.',
  },
  {
    heading: '6. Modifications to Terms',
    body: 'We reserve the right to modify these terms at any time. We will provide notice by updating the terms on this page.',
  },
];

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Feather name="check" size={16} color={colors.white} />}
    </View>
  );
}

export default function TermsConsentScreen({ navigation }: Props) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const canContinue = agreedTerms && agreedPrivacy;

  return (
    <ScreenContainer>
      <TopAppBar title="Legal Consent" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.heading}>Terms of Service & Privacy Policy</Text>
        <Text style={styles.subheading}>
          Please review our updated terms and privacy practices before continuing to use Artiva.
        </Text>

        <ScrollView style={styles.legalBox} contentContainerStyle={styles.legalContent}>
          {sections.map((s) => (
            <View key={s.heading} style={styles.section}>
              <Text style={styles.sectionHeading}>{s.heading}</Text>
              <Text style={styles.sectionBody}>{s.body}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.checkRow} onPress={() => setAgreedTerms((v) => !v)}>
          <Checkbox checked={agreedTerms} />
          <Text style={styles.checkLabel}>
            I agree to the <Text style={styles.checkLink}>Terms of Service</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkRow} onPress={() => setAgreedPrivacy((v) => !v)}>
          <Checkbox checked={agreedPrivacy} />
          <Text style={styles.checkLabel}>
            I acknowledge and consent to the <Text style={styles.checkLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          label="Agree & Continue"
          icon="arrow-right"
          disabled={!canContinue}
          onPress={() => navigation.navigate('VerificationIntro')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
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
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  legalBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  legalContent: { padding: 17, gap: spacing.md },
  section: { gap: 4 },
  sectionHeading: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  sectionBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    lineHeight: 20,
  },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.orange, borderColor: colors.orange },
  checkLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLight,
  },
  checkLink: { fontFamily: typography.fontFamily.semibold, color: colors.orange },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(248,249,250,0.9)',
  },
});
