import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderPricingSetup'>;

export default function ProviderPricingSetupScreen({ navigation }: Props) {
  const [model, setModel] = useState<'hourly' | 'flat'>('hourly');
  const [rate, setRate] = useState('');

  return (
    <ScreenContainer scroll>
      <TopAppBar title="Rates Setup" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.title}>Service Pricing</Text>
          <Text style={styles.subtitle}>
            Define your base rates for services. You can always negotiate specific project terms
            later.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Default Currency</Text>
            <View style={styles.select}>
              <Text style={styles.selectText}>🇺🇸  USD - US Dollar</Text>
              <Feather name="chevron-down" size={14} color={colors.textOnLightSecondary} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.label}>Primary Pricing Model</Text>
            <View style={styles.segment}>
              {(['hourly', 'flat'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.segmentButton, model === m && styles.segmentButtonActive]}
                  onPress={() => setModel(m)}
                >
                  <Text style={[styles.segmentText, model === m && styles.segmentTextActive]}>
                    {m === 'hourly' ? 'Hourly Rate' : 'Flat Fee'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Base Hourly Rate</Text>
            <View style={styles.select}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                style={styles.rateInput}
                value={rate}
                onChangeText={setRate}
                placeholder="0.00"
                placeholderTextColor={colors.textOnLightSecondary}
                keyboardType="decimal-pad"
              />
              <Text style={styles.rateSuffix}>/hr</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Save Rates"
          icon="check"
          iconPosition="left"
          onPress={() => navigation.navigate('ProviderAvailabilitySetup')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.lg,
  },
  title: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  subtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary, marginTop: -spacing.md },
  field: { gap: 4 },
  label: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.sm,
    paddingHorizontal: 17,
    paddingVertical: spacing.sm,
  },
  selectText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLight },
  divider: { height: 1, backgroundColor: colors.divider },
  segment: { flexDirection: 'row', backgroundColor: '#F3F4F5', borderRadius: radius.sm, padding: 4 },
  segmentButton: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: 6 },
  segmentButtonActive: { backgroundColor: colors.surface },
  segmentText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  segmentTextActive: { color: '#904D00' },
  currencyPrefix: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLightSecondary },
  rateInput: { flex: 1, paddingHorizontal: spacing.sm, fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLight },
  rateSuffix: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider },
});
