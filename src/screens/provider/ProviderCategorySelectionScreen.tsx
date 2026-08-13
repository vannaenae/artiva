import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderCategorySelection'>;

const categories: { key: string; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { key: 'plumbing', icon: 'droplet', label: 'Plumbing' },
  { key: 'electrical', icon: 'zap', label: 'Electrical' },
  { key: 'cleaning', icon: 'wind', label: 'Cleaning' },
  { key: 'gardening', icon: 'sun', label: 'Gardening' },
  { key: 'carpentry', icon: 'tool', label: 'Carpentry' },
  { key: 'painting', icon: 'edit-3', label: 'Painting' },
  { key: 'moving', icon: 'truck', label: 'Moving' },
  { key: 'tech', icon: 'monitor', label: 'Tech Support' },
];

export default function ProviderCategorySelectionScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.step}>STEP 2 OF 4</Text>
        <Text style={styles.heading}>What services do you offer?</Text>
        <Text style={styles.subheading}>
          Select all categories that apply to your expertise. This helps us match you with the
          right clients.
        </Text>

        <View style={styles.grid}>
          {categories.map((c) => {
            const active = selected.includes(c.key);
            return (
              <TouchableOpacity
                key={c.key}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => toggle(c.key)}
              >
                <View style={styles.cardIcon}>
                  <Feather name={c.icon} size={22} color={colors.textOnLight} />
                </View>
                <Text style={styles.cardLabel}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Skip for now" variant="outline" fullWidth={false} onPress={() => navigation.navigate('ProviderPricingSetup')} />
        <View style={{ flex: 2 }}>
          <Button
            label="Continue"
            icon="arrow-right"
            onPress={() => navigation.navigate('ProviderPricingSetup')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xl },
  step: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: '#904D00',
    letterSpacing: 0.7,
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    letterSpacing: -0.64,
    marginTop: 4,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardActive: { borderColor: colors.orange, borderWidth: 2 },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#EDEEEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
