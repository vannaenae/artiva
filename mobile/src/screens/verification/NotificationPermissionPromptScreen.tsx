import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'NotificationPermissionPrompt'>;

export default function NotificationPermissionPromptScreen({ navigation }: Props) {
  return (
    <ScreenContainer dark>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.illustration}>
            <View style={styles.iconCircle}>
              <Feather name="bell" size={40} color={colors.white} />
              <View style={styles.badge}>
                <Feather name="check" size={12} color={colors.white} />
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Stay Updated</Text>
            <Text style={styles.body}>
              Get real-time alerts for booking confirmations, messages from providers, and
              important account updates. Never miss a critical moment.
            </Text>
            <View style={styles.actions}>
              <Button
                label="Enable Notifications"
                icon="bell"
                iconPosition="left"
                onPress={() => navigation.navigate('CustomerHome')}
              />
              <Button
                label="Maybe later"
                variant="ghost"
                onPress={() => navigation.navigate('CustomerHome')}
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  modal: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  illustration: {
    height: 192,
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#22C087',
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: spacing.lg, alignItems: 'center' },
  title: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xxl,
    color: colors.textOnLight,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: { width: '100%', gap: spacing.md },
});
