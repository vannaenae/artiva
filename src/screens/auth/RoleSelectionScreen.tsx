import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import { useRole, type Role } from '../../context/RoleContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RoleSelection'>;

const roles: {
  key: Role;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}[] = [
  {
    key: 'customer',
    icon: 'briefcase',
    title: 'I want to hire services',
    description: 'Find professionals for your needs.',
  },
  {
    key: 'provider',
    icon: 'tool',
    title: 'I want to provide services',
    description: 'Offer your skills and get hired.',
  },
];

export default function RoleSelectionScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<Role | null>(null);
  const { setRole } = useRole();

  return (
    <ScreenContainer>
      <TopAppBar />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.heading}>Join Artiva</Text>
          <Text style={styles.subheading}>Select how you want to use the platform.</Text>
        </View>

        <View style={styles.cards}>
          {roles.map((role) => {
            const active = selected === role.key;
            return (
              <TouchableOpacity
                key={role.key}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setSelected(role.key)}
                activeOpacity={0.8}
              >
                <View style={styles.cardIcon}>
                  <Feather name={role.icon} size={20} color={colors.textOnLight} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardDescription}>{role.description}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button
            label="Continue"
            icon="arrow-right"
            disabled={!selected}
            onPress={() => {
              if (selected) setRole(selected);
              navigation.navigate('TermsConsent');
            }}
          />
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.loginAction}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, justifyContent: 'space-between' },
  header: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md },
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
  },
  cards: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    shadowColor: '#121826',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cardActive: { borderColor: colors.orange, borderWidth: 2 },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#F3F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 2 },
  cardTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  cardDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.orange },
  radioDot: { width: 12, height: 12, borderRadius: 9999, backgroundColor: colors.orange },
  actions: { gap: spacing.md, paddingBottom: spacing.md, paddingTop: spacing.lg },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  loginAction: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.orange,
  },
});
