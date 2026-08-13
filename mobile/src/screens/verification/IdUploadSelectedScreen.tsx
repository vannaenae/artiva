import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'IdUploadSelected'>;

const checks = ['All 4 corners are visible', 'Text is sharp and easy to read', 'No glare covering important details'];

export default function IdUploadSelectedScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar title="Verify Identity" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.progressRow}>
          <View style={[styles.progressSegment, styles.progressFilled]} />
          <View style={[styles.progressSegment, styles.progressFilled]} />
          <View style={styles.progressSegment} />
        </View>

        <View style={styles.header}>
          <Text style={styles.heading}>ID Front Uploaded</Text>
          <Text style={styles.subheading}>
            Please review the photo to ensure all details are clear and legible.
          </Text>
        </View>

        <View style={styles.preview}>
          <Feather name="credit-card" size={48} color={colors.textOnLightSecondary} />
          <View style={styles.badge}>
            <Feather name="check-circle" size={13} color="#10B981" />
            <Text style={styles.badgeText}>Looks good</Text>
          </View>
        </View>

        <View style={styles.checklist}>
          {checks.map((c) => (
            <View key={c} style={styles.checkRow}>
              <Feather name="check" size={14} color="#10B981" />
              <Text style={styles.checkText}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            label="Continue"
            icon="arrow-right"
            onPress={() => navigation.navigate('SelfieCapture')}
          />
          <Button label="Retake Photo" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.lg },
  progressRow: { flexDirection: 'row', gap: spacing.sm },
  progressSegment: { flex: 1, height: 8, borderRadius: 9999, backgroundColor: colors.border },
  progressFilled: { backgroundColor: colors.orange },
  header: { gap: 4 },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    textAlign: 'center',
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: '#585E6F',
    textAlign: 'center',
  },
  preview: {
    aspectRatio: 1.586,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: 9999,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  badgeText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLight },
  checklist: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.sm,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLight },
  actions: { gap: spacing.md },
});
