import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CustomerHome'>;

const categories: { icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { icon: 'zap', label: 'Electrician' },
  { icon: 'droplet', label: 'Plumber' },
  { icon: 'wind', label: 'Cleaner' },
  { icon: 'tool', label: 'Handyman' },
];

const providers = [
  { name: 'David Chen', title: 'Master Electrician', rating: '4.9', status: 'Available Now', available: true, distance: '1.2 mi' },
  { name: 'Sarah Jenkins', title: 'Licensed Plumber', rating: '4.8', status: 'Busy', available: false, distance: '2.5 mi' },
];

export default function CustomerHomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar
        onBack={undefined}
        right={<Feather name="bell" size={16} color={colors.white} />}
      />
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.search}
          onPress={() => navigation.navigate('CustomerSearchFilters')}
        >
          <Feather name="search" size={18} color={colors.textOnLightSecondary} />
          <Text style={styles.searchPlaceholder}>What service do you need?</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity key={c.label} style={styles.categoryCard}>
              <Feather name={c.icon} size={24} color={colors.textOnLight} />
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Nearby Providers</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        {providers.map((p) => (
          <TouchableOpacity
            key={p.name}
            style={styles.providerCard}
            onPress={() => navigation.navigate('CustomerProviderProfileNigeria')}
          >
            <View style={styles.providerAvatar}>
              <Feather name="user" size={24} color={colors.textOnLightSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerName}>{p.name}</Text>
                <View style={styles.ratingRow}>
                  <Feather name="star" size={13} color={colors.orange} />
                  <Text style={styles.ratingText}>{p.rating}</Text>
                </View>
              </View>
              <Text style={styles.providerTitle}>{p.title}</Text>
              <View style={styles.providerFooter}>
                <View style={[styles.statusBadge, p.available && styles.statusBadgeActive]}>
                  <Text style={[styles.statusText, p.available && styles.statusTextActive]}>
                    {p.status}
                  </Text>
                </View>
                <Text style={styles.distanceText}>{p.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchPlaceholder: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: '#6B7280' },
  sectionTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.orange },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryCard: {
    width: '47%',
    height: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    justifyContent: 'space-between',
  },
  categoryLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  providerCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
  },
  providerAvatar: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: '#E1E3E4', alignItems: 'center', justifyContent: 'center' },
  providerHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  providerName: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: typography.fontFamily.bold, fontSize: 12, color: colors.orange },
  providerTitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  providerFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  statusBadge: { backgroundColor: colors.border, borderRadius: 9999, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  statusBadgeActive: { backgroundColor: 'rgba(16,185,129,0.1)' },
  statusText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  statusTextActive: { color: '#10B981' },
  distanceText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
});
