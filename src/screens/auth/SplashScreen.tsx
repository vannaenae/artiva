import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, typography, spacing } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('PhoneEntry'), 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <ScreenContainer dark edges={[]}>
      <View style={styles.decorativeOuter} pointerEvents="none" />
      <View style={styles.decorativeInner} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Ionicons name="color-palette" size={40} color={colors.white} />
        </View>
        <Text style={styles.brand}>Artiva</Text>
        <Text style={styles.tagline}>Elevating Service Experiences</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.loadingBar} />
        <Text style={styles.loadingText}>Initializing workspace...</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  decorativeOuter: {
    position: 'absolute',
    alignSelf: 'center',
    top: '23%',
    width: 384,
    height: 384,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.orange,
    opacity: 0.1,
  },
  decorativeInner: {
    position: 'absolute',
    alignSelf: 'center',
    top: '34%',
    width: 192,
    height: 192,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.white,
    opacity: 0.1,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  brand: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.white,
    letterSpacing: -0.8,
  },
  tagline: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  bottom: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  loadingBar: {
    width: 38,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.navyElevated,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    opacity: 0.6,
    letterSpacing: 0.24,
  },
});
