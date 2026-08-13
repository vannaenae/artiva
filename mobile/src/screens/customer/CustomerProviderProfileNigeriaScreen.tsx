import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CustomerProviderProfileNigeria'>;

const services = [
  { icon: 'sun' as const, title: 'Inverter & Solar Setup', desc: 'Complete installation of power backup solutions.', price: 'From ₦75,000' },
  { icon: 'zap' as const, title: 'Changeover Panel Upgrade', desc: 'Auto/manual changeover switches for modern homes.', price: 'From ₦150,000' },
];

export default function CustomerProviderProfileNigeriaScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar
        right={<Feather name="user" size={16} color={colors.orange} />}
      />
      <View style={styles.main}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Feather name="user" size={48} color={colors.textOnLightSecondary} />
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={10} color="#22C087" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.name}>Chinedu Okafor</Text>
          <Text style={styles.title}>Master Electrician, Lagos • 12 Yrs Exp.</Text>
          <View style={styles.ratingPill}>
            <Feather name="star" size={16} color={colors.orange} />
            <Text style={styles.ratingValue}>4.9</Text>
            <Text style={styles.ratingCount}>(128 Reviews)</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Chinedu</Text>
          <Text style={styles.bio}>
            Licensed Master Electrician specializing in residential inverter setups, complex
            rewiring, and modern lighting solutions across Lagos. Committed to safety, precision,
            and leaving every workspace cleaner than I found it.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Top Services</Text>
        {services.map((s) => (
          <View key={s.title} style={styles.serviceCard}>
            <View style={styles.serviceRow}>
              <View style={styles.serviceIcon}>
                <Feather name={s.icon} size={20} color="#3A4A9E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitle}>{s.title}</Text>
                <Text style={styles.serviceDesc}>{s.desc}</Text>
              </View>
            </View>
            <Text style={styles.servicePrice}>{s.price}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Recent Work in Lekki & Ikeja</Text>
        <View style={styles.portfolioRow}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.portfolioTile}>
              <Feather name="image" size={28} color={colors.textOnLightSecondary} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Book Service"
          icon="calendar"
          iconPosition="left"
          onPress={() => navigation.navigate('CustomerBookingFormNGN')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.md },
  header: { alignItems: 'center', marginBottom: spacing.sm },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 12,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,192,135,0.1)',
    borderWidth: 1,
    borderColor: '#22C087',
    borderRadius: 9999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  verifiedText: { fontFamily: typography.fontFamily.bold, fontSize: 12, color: '#22C087' },
  name: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xl, color: colors.textOnLight },
  title: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLightSecondary },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: '#F3F4F5', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.sm },
  ratingValue: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  ratingCount: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 17, gap: spacing.xs },
  sectionTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  bio: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary, lineHeight: 22 },
  serviceCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 17, gap: spacing.sm },
  serviceRow: { flexDirection: 'row', gap: spacing.sm },
  serviceIcon: { width: 40, height: 40, borderRadius: 9999, backgroundColor: '#DADFF3', alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  serviceDesc: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  servicePrice: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight, textAlign: 'right' },
  portfolioRow: { flexDirection: 'row', gap: spacing.sm },
  portfolioTile: { flex: 1, height: 175, borderRadius: radius.sm, backgroundColor: '#E7E8E9', alignItems: 'center', justifyContent: 'center' },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
