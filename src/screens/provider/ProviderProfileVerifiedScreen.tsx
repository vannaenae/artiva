import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderProfileVerified'>;

const services = [
  { icon: 'home' as const, title: 'Smart Home', hint: 'Installation & Setup' },
  { icon: 'zap' as const, title: 'Panel Upgrades', hint: 'Modernization' },
];

export default function ProviderProfileVerifiedScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <Feather name="chevron-left" size={20} color={colors.white} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Artiva</Text>
          <Feather name="bell" size={18} color={colors.white} />
        </View>

        <View style={styles.avatar}>
          <Feather name="user" size={40} color={colors.textOnLightSecondary} />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.title}>Master Electrician</Text>
        <View style={styles.verifiedBadge}>
          <Feather name="shield" size={12} color="#22C087" />
          <Text style={styles.verifiedText}>Verified Professional</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <View style={styles.statRow}>
              <Text style={styles.statValueOrange}>4.9</Text>
              <Feather name="star" size={14} color={colors.orange} />
            </View>
            <Text style={styles.statLabel}>120+ Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>350+</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.bioCard}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioBody}>
            Licensed Master Electrician with over 15 years of experience in residential and
            commercial electrical systems. Specializing in smart home installations.
          </Text>
          <Text style={styles.readMore}>Read full bio</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Services</Text>
        <View style={styles.servicesRow}>
          {services.map((s) => (
            <View key={s.title} style={styles.serviceCard}>
              <View style={styles.serviceIcon}>
                <Feather name={s.icon} size={18} color="#3A4A9E" />
              </View>
              <Text style={styles.serviceTitle}>{s.title}</Text>
              <Text style={styles.serviceHint}>{s.hint}</Text>
            </View>
          ))}
        </View>

        <Button label="Book Now" icon="calendar" iconPosition="left" onPress={() => {}} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.navy,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    gap: 4,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  headerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, color: colors.white },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: colors.navy,
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xl, color: colors.white, marginTop: spacing.sm },
  title: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textSecondary },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,192,135,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,192,135,0.2)',
    borderRadius: 9999,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginTop: spacing.sm,
  },
  verifiedText: { fontFamily: typography.fontFamily.semibold, fontSize: 12, color: '#22C087' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#414756',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  stat: { alignItems: 'center', gap: 4 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValueOrange: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.orange },
  statValue: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.white },
  statLabel: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textSecondary },
  statDivider: { width: 1, height: 32, backgroundColor: '#414756' },
  main: { padding: spacing.md, gap: spacing.md },
  bioCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: 4,
  },
  sectionTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  bioBody: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  readMore: { fontFamily: typography.fontFamily.semibold, fontSize: 12, color: colors.orange, marginTop: 4 },
  servicesRow: { flexDirection: 'row', gap: spacing.sm },
  serviceCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: 4,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#DADFF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  serviceTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  serviceHint: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
});
