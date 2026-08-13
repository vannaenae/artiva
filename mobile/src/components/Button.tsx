import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  GestureResponderEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  fullWidth = true,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.orange} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Feather
              name={icon}
              size={16}
              color={textColor(variant)}
              style={{ marginRight: spacing.xs }}
            />
          )}
          <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
          {icon && iconPosition === 'right' && (
            <Feather
              name={icon}
              size={16}
              color={textColor(variant)}
              style={{ marginLeft: spacing.xs }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function textColor(variant: Variant) {
  if (variant === 'primary') return colors.white;
  return colors.orange;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    letterSpacing: 0.14,
  },
  disabled: { opacity: 0.5 },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.orange,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  secondary: {
    backgroundColor: colors.navy,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.orange,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.white },
  outline: { color: colors.orange },
  ghost: { color: colors.orange },
});
