import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PermissionDenied'>;

const steps = [
  { pre: '', bold: '', post: "Tap 'Open Settings' below." },
  { pre: 'Find and tap ', bold: 'Artiva', post: '.' },
  { pre: 'Toggle the ', bold: 'Camera', post: ' switch on.' },
];

export default function PermissionDeniedScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Feather name="camera-off" size={36} color="#BA1A1A" />
          </View>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.body}>
            Artiva needs access to your camera to capture high-quality images for your profile
            and service verification.
          </Text>

          <View style={styles.instructions}>
            <View style={styles.instructionsHeader}>
              <Feather name="info" size={14} color={colors.textOnLight} />
              <Text style={styles.instructionsTitle}>How to enable</Text>
            </View>
            {steps.map((s, i) => (
              <Text key={i} style={styles.step}>
                {i + 1}. {s.pre}
                {s.bold ? <Text style={styles.stepBold}>{s.bold}</Text> : null}
                {s.post}
              </Text>
            ))}
          </View>

          <View style={styles.actions}>
            <Button label="Open Settings" icon="settings" onPress={() => {}} />
            <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, alignItems: 'center', padding: spacing.md },
  card: { maxWidth: 384, alignItems: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,218,214,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    textAlign: 'center',
    letterSpacing: -0.64,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
  instructions: {
    width: '100%',
    backgroundColor: '#F3F4F5',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 17,
    gap: spacing.xs,
  },
  instructionsHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  instructionsTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  step: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    lineHeight: 20,
  },
  stepBold: { fontFamily: typography.fontFamily.bold, color: colors.textOnLight },
  actions: { width: '100%', gap: spacing.sm },
});
