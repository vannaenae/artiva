import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CustomerSearchFilters'>;

const priceTiers = ['$', '$$', '$$$', '$$$$'];

export default function CustomerSearchFiltersScreen({ navigation }: Props) {
  const [price, setPrice] = useState('$$');
  const [minRating, setMinRating] = useState(true);

  return (
    <ScreenContainer scroll>
      <TopAppBar
        onBack={() => navigation.goBack()}
        right={<Feather name="bell" size={16} color={colors.white} />}
      />
      <View style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Find Services</Text>
          <View style={styles.searchInput}>
            <Feather name="search" size={16} color={colors.textOnLightSecondary} />
            <TextInput
              style={styles.searchField}
              placeholder="What do you need help with?"
              placeholderTextColor="rgba(86,67,52,0.7)"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.rowIconTitle}>
              <Feather name="dollar-sign" size={16} color={colors.textOnLight} />
              <Text style={styles.cardTitle}>Price Range</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{price}</Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>Select your preferred budget tier.</Text>
          <View style={styles.priceRow}>
            {priceTiers.map((tier) => (
              <TouchableOpacity
                key={tier}
                style={[styles.priceButton, price === tier && styles.priceButtonActive]}
                onPress={() => setPrice(tier)}
              >
                <Text style={[styles.priceButtonText, price === tier && styles.priceButtonTextActive]}>
                  {tier}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowIconTitle}>
            <Feather name="star" size={16} color={colors.textOnLight} />
            <Text style={styles.cardTitle}>Minimum Rating</Text>
          </View>
          <TouchableOpacity style={styles.checkRow} onPress={() => setMinRating((v) => !v)}>
            <View style={[styles.checkbox, minRating && styles.checkboxChecked]}>
              {minRating && <Feather name="check" size={14} color={colors.white} />}
            </View>
            <Text style={styles.checkLabel}>4.0+ Stars</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.rowIconTitle}>
            <Feather name="map-pin" size={16} color={colors.textOnLight} />
            <Text style={styles.cardTitle}>Distance</Text>
          </View>
          <Text style={styles.cardSubtitle}>Find providers near you.</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.distanceLabel}>Current Location</Text>
            <Text style={styles.distanceValue}>10 miles</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.sliderEnd}>1m</Text>
            <Text style={styles.sliderEnd}>50m</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Reset" variant="outline" fullWidth={false} onPress={() => {}} />
        <View style={{ flex: 2 }}>
          <Button
            label="Apply Filters"
            icon="arrow-right"
            onPress={() => navigation.navigate('CustomerHome')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  cardTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  cardSubtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
  searchField: { flex: 1, paddingVertical: spacing.sm, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLight },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowIconTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: { backgroundColor: '#EDEEEF', borderRadius: 9999, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  pillText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  priceRow: { flexDirection: 'row', gap: 4, backgroundColor: '#F3F4F5', borderRadius: radius.sm, padding: spacing.sm },
  priceButton: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: 6 },
  priceButtonActive: { backgroundColor: colors.orange },
  priceButtonText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  priceButtonTextActive: { color: '#623200' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.orange },
  checkLabel: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLight },
  distanceLabel: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  distanceValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: '#904D00' },
  sliderTrack: { height: 4, backgroundColor: colors.border, borderRadius: 9999, marginVertical: spacing.sm },
  sliderFill: { width: '18%', height: 4, backgroundColor: '#904D00', borderRadius: 9999 },
  sliderEnd: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: 'rgba(86,67,52,0.5)' },
  footer: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
