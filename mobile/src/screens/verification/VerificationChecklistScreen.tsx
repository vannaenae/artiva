import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerificationChecklist'>;

const steps: { icon: keyof typeof Feather.glyphMap; title: string }[] = [
  { icon: 'credit-card', title: '1. Government ID' },
  { icon: 'camera', title: '2. Selfie Capture' },
  { icon: 'home', title: '3. Proof of Address' },
];

export default function VerificationChecklistScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View>
          <Text style={styles.heading}>Verification Checklist</Text>
          <Text style={styles.subheading}>
            Complete the following steps to verify your identity and access all premium services
            securely.
          </Text>
        </View>

        <View style={styles.list}>
          {steps.map((s) => (
            <View key={s.title} style={styles.row}>
              <View style={styles.rowIcon}>
                <Feather name={s.icon} size={20} color={colors.textOnLightSecondary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{s.title}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusLabel}>NOT STARTED</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.textOnLightSecondary} />
            </View>
          ))}
        </View>

        <Button
          label="Begin"
          icon="arrow-right"
          onPress={() => navigation.navigate('IdUploadEmpty')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    marginTop: spacing.sm,
  },
  list: { gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: radius.md,
    padding: 17,
  },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#EDEEEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 9999, backgroundColor: colors.textOnLightSecondary },
  statusLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: '#585E6F',
    letterSpacing: 0.6,
  },
});
