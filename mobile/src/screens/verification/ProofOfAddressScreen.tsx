import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProofOfAddress'>;

const options: { key: string; icon: keyof typeof Feather.glyphMap; title: string; hint: string }[] = [
  { key: 'bank', icon: 'file-text', title: 'Bank Statement', hint: 'Issued within last 3 months' },
  { key: 'utility', icon: 'zap', title: 'Utility Bill', hint: 'Water, electricity, or gas' },
  { key: 'rental', icon: 'key', title: 'Rental Agreement', hint: 'Current and signed' },
];

export default function ProofOfAddressScreen({ navigation }: Props) {
  const [selected, setSelected] = useState('bank');

  return (
    <ScreenContainer scroll>
      <TopAppBar
        onBack={() => navigation.goBack()}
        right={<Feather name="help-circle" size={20} color={colors.white} />}
      />
      <View style={styles.main}>
        <View>
          <Text style={styles.heading}>Proof of Address</Text>
          <Text style={styles.subheading}>
            To verify your account, please upload a recent document showing your full name and
            current address.
          </Text>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Accepted Documents</Text>
          <View style={styles.options}>
            {options.map((o) => {
              const active = selected === o.key;
              return (
                <TouchableOpacity
                  key={o.key}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => setSelected(o.key)}
                >
                  <View style={styles.optionIcon}>
                    <Feather name={o.icon} size={20} color="#3A4A9E" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{o.title}</Text>
                    <Text style={styles.optionHint}>{o.hint}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <Feather name="check" size={12} color={colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Upload Document</Text>
          <TouchableOpacity style={styles.dropzone}>
            <View style={styles.dropzoneIcon}>
              <Feather name="upload" size={24} color="#585E6F" />
            </View>
            <Text style={styles.dropzoneTitle}>Tap to upload or drag & drop</Text>
            <Text style={styles.dropzoneHint}>PDF, PNG, or JPG up to 10MB.</Text>
            <Text style={styles.dropzoneHint}>Ensure all edges are visible and text is clear.</Text>
          </TouchableOpacity>
        </View>

        <Button
          label="Next"
          icon="arrow-right"
          onPress={() => navigation.navigate('BackgroundCheckConsent')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xl },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
    marginBottom: spacing.sm,
  },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    padding: 17,
  },
  optionActive: { borderColor: colors.orange, borderWidth: 2 },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#DADFF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1, gap: 2 },
  optionTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  optionHint: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textOnLightSecondary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  dropzone: {
    borderWidth: 2,
    borderColor: colors.divider,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    gap: 4,
  },
  dropzoneIcon: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: '#EDEEEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dropzoneTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.textOnLight,
  },
  dropzoneHint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
});
