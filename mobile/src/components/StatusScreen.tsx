import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from './ScreenContainer';
import TopAppBar from './TopAppBar';
import Button from './Button';
import { colors, typography, spacing, radius } from '../theme/tokens';

/**
 * Shared shape behind the icon + heading + body + action(s) result/error/
 * pending screens in the verification flow (Verified, Rejected, Pending,
 * Upload Failed, ...). Each Figma screen only differs in icon/colors/copy.
 */
type Props = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  footer?: string;
  headerTitle?: string;
  onBack?: () => void;
};

export default function StatusScreen({
  icon,
  iconColor,
  iconBg,
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  footer,
  headerTitle = 'Artiva',
  onBack,
}: Props) {
  return (
    <ScreenContainer>
      <TopAppBar title={headerTitle} onBack={onBack} />
      <View style={styles.main}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
            <Feather name={icon} size={40} color={iconColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.actions}>
            <Button label={primaryLabel} onPress={onPrimary} icon="arrow-right" />
            {secondaryLabel && (
              <Button label={secondaryLabel} onPress={onSecondary} variant="outline" />
            )}
          </View>
        </View>
        {footer && <Text style={styles.footer}>{footer}</Text>}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  card: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xxl,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  actions: { width: '100%', gap: spacing.md, marginTop: spacing.sm },
  footer: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
});
