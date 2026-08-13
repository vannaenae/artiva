import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'TradeCertificate'>;

export default function TradeCertificateScreen({ navigation }: Props) {
  const next = () => navigation.navigate('ProofOfAddress');
  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Trade Certifications</Text>
          <Text style={styles.subheading}>
            Upload any relevant certifications to boost your profile visibility. This step is
            optional but highly recommended for licensed trades.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upload Document</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.dropzone}>
            <Feather name="award" size={40} color="#585E6F" />
            <Text style={styles.dropzoneTitle}>Tap to upload or drag file here</Text>
            <Text style={styles.dropzoneHint}>PDF, JPG, PNG (Max 5MB)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.callout}>
          <Feather name="info" size={20} color="#3A4A9E" />
          <Text style={styles.calloutText}>
            Verified certifications receive a <Text style={styles.calloutBold}>Trusted</Text>{' '}
            badge on your public profile, increasing client trust and booking rates.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button label="Next" onPress={next} />
          <Button label="Skip for now" variant="outline" onPress={next} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.lg },
  headerRow: { gap: 4 },
  heading: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xl,
    color: colors.textOnLight,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  optionalBadge: {
    backgroundColor: colors.border,
    borderRadius: 9999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  optionalText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textOnLightSecondary,
  },
  dropzone: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, gap: spacing.xs },
  dropzoneTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  dropzoneHint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textOnLightSecondary,
  },
  callout: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#DADFF3',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  calloutText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: '#5D6273',
    lineHeight: 20,
  },
  calloutBold: { fontFamily: typography.fontFamily.bold, color: '#006C49' },
  actions: { gap: spacing.sm },
});
