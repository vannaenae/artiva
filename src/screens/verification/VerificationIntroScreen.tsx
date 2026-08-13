import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerificationIntro'>;

const benefits: { icon: keyof typeof Feather.glyphMap; title: string; body: string }[] = [
  { icon: 'shield', title: 'Build trust', body: 'Clients are 3x more likely to hire verified professionals.' },
  { icon: 'trending-up', title: 'Get more jobs', body: 'Appear higher in search results and receive priority matching.' },
  { icon: 'credit-card', title: 'Secure payments', body: 'Access instant payouts and our payment protection guarantee.' },
];

export default function VerificationIntroScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar title="Verification" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather name="user-check" size={40} color={colors.textOnLightSecondary} />
          </View>
          <Text style={styles.heading}>Let's get you verified</Text>
          <Text style={styles.subheading}>
            Complete your profile to unlock premium features and stand out.
          </Text>
        </View>

        <View style={styles.list}>
          {benefits.map((b) => (
            <View key={b.title} style={styles.row}>
              <View style={styles.rowIcon}>
                <Feather name={b.icon} size={20} color={colors.orange} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{b.title}</Text>
                <Text style={styles.rowBody}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            label="Start Verification"
            icon="arrow-right"
            onPress={() => navigation.navigate('VerificationChecklist')}
          />
          <Text style={styles.hint}>Takes about 2 minutes</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flexGrow: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: '#EDEEEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    textAlign: 'center',
    letterSpacing: -0.64,
    marginBottom: spacing.sm,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
  list: { gap: spacing.md, marginBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
  },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  rowBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  actions: { gap: spacing.sm },
  hint: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
    letterSpacing: 0.24,
  },
});
