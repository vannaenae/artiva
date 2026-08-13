import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'DocumentUnreadable'>;

export default function DocumentUnreadableScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar title="Verification" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.iconCircle}>
          <Feather name="alert-triangle" size={25} color="#BA1A1A" />
        </View>
        <Text style={styles.title}>Blurry Document</Text>
        <Text style={styles.body}>
          We couldn't clearly read the details on your document. Please ensure the photo is in
          focus and well-lit.
        </Text>

        <View style={styles.previewCard}>
          <View style={styles.previewImage}>
            <Feather name="file-text" size={32} color={colors.textOnLightSecondary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>UNREADABLE</Text>
            </View>
          </View>
          <View style={styles.previewMeta}>
            <Text style={styles.previewName}>Driver's License (Front)</Text>
            <Text style={styles.previewTime}>Just now</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Retake Photo" icon="camera" onPress={() => navigation.goBack()} />
          <Button
            label="Cancel Verification"
            variant="outline"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, alignItems: 'center', padding: spacing.md, paddingTop: spacing.lg },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: '#FFDAD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    letterSpacing: -0.64,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  previewCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  previewImage: {
    height: 192,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: '#BA1A1A',
    backgroundColor: 'rgba(186,26,26,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#BA1A1A',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.white,
    letterSpacing: 0.6,
  },
  previewMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  previewName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  previewTime: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  actions: { width: '100%', gap: spacing.md },
});
