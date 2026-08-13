import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderAvailabilitySetup'>;

const initialDays = [
  { day: 'Monday', enabled: true, hours: '09:00 AM - 05:00 PM' },
  { day: 'Tuesday', enabled: true, hours: '09:00 AM - 05:00 PM' },
  { day: 'Wednesday', enabled: false, hours: 'Unavailable' },
  { day: 'Thursday', enabled: true, hours: '09:00 AM - 05:00 PM' },
  { day: 'Friday', enabled: true, hours: '09:00 AM - 03:00 PM' },
  { day: 'Saturday', enabled: false, hours: 'Unavailable' },
  { day: 'Sunday', enabled: false, hours: 'Unavailable' },
];

export default function ProviderAvailabilitySetupScreen({ navigation }: Props) {
  const [days, setDays] = useState(initialDays);
  const toggleDay = (day: string) =>
    setDays((ds) => ds.map((d) => (d.day === day ? { ...d, enabled: !d.enabled } : d)));

  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.heading}>Availability Setup</Text>
        <Text style={styles.subheading}>
          Configure your weekly business hours to let clients know when you're available for
          bookings.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Schedule</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Feather name="copy" size={13} color="#904D00" />
              <Text style={styles.copyText}>Copy to all</Text>
            </TouchableOpacity>
          </View>

          {days.map((d) => (
            <View key={d.day} style={[styles.dayRow, !d.enabled && styles.dayRowDisabled]}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{d.day}</Text>
                <Switch
                  value={d.enabled}
                  onValueChange={() => toggleDay(d.day)}
                  trackColor={{ true: colors.orange, false: colors.border }}
                  thumbColor={colors.white}
                />
              </View>
              <Text style={styles.dayHours}>{d.hours}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Feather name="globe" size={18} color={colors.textOnLight} />
          <Text style={styles.infoText}>
            Your hours are shown in <Text style={styles.infoBold}>PST (Pacific Standard Time)</Text>{' '}
            based on your profile settings. Clients will see these times converted to their local
            timezone.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Set Availability"
          onPress={() => navigation.navigate('ProviderPortfolioUpload')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.lg },
  heading: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.display, color: colors.textOnLight, letterSpacing: -0.64 },
  subheading: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLightSecondary, marginTop: -spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  cardTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  copyButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copyText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: '#904D00' },
  dayRow: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 17,
    gap: spacing.sm,
  },
  dayRowDisabled: { backgroundColor: '#F3F4F5', opacity: 0.6 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayName: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  dayHours: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#E7E8E9',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoText: { flex: 1, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary, lineHeight: 20 },
  infoBold: { fontFamily: typography.fontFamily.bold, color: colors.textOnLight },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
