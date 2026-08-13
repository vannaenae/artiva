import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, keyof AuthStackParamList> & {
  title: string;
};

/**
 * Temporary stand-in for screens not yet built pixel-for-pixel from Figma.
 * Lets the full 40-screen flow be navigable end-to-end while each real
 * screen is implemented incrementally.
 */
export default function PlaceholderScreen({ navigation, title }: Props) {
  return (
    <ScreenContainer>
      <TopAppBar onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>This screen is coming soon.</Text>
        {navigation.canGoBack() && (
          <Button label="Go back" variant="outline" onPress={() => navigation.goBack()} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
});
