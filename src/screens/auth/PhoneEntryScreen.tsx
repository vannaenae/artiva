import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry' | 'PhoneEntryNigeria'> & {
  countryCode?: string;
  placeholder?: string;
  otpRoute?: 'OtpVerify' | 'OtpVerifyNigeria';
};

export default function PhoneEntryScreen({
  navigation,
  countryCode = '+1',
  placeholder = '(555) 000-0000',
  otpRoute = 'OtpVerify',
}: Props) {
  const [phone, setPhone] = useState('');

  return (
    <ScreenContainer edges={['bottom']}>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Card>
          <View style={styles.headingBlock}>
            <Text style={styles.heading}>Enter your phone number</Text>
            <Text style={styles.subheading}>
              We'll send you a One Time Password (OTP) to verify your number.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputRow}>
              <View style={styles.countryCode}>
                <Feather name="chevron-down" size={12} color={colors.textOnLightSecondary} />
                <Text style={styles.countryCodeText}>{countryCode}</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholderOnLight}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Button
              label="Send OTP"
              icon="arrow-right"
              onPress={() => navigation.navigate(otpRoute)}
            />
          </View>
        </Card>

        <View style={styles.legal}>
          <Text style={styles.legalText}>
            By tapping "Send OTP", you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Service</Text>
            {'\n'}and <Text style={styles.legalLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: spacing.md,
  },
  headingBlock: { alignItems: 'center', gap: spacing.sm },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    textAlign: 'center',
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
  form: { width: '100%', gap: spacing.md },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 15,
  },
  countryCodeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
  },
  divider: { width: 1, height: 24, backgroundColor: colors.divider },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 15,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLight,
  },
  legal: { paddingTop: spacing.xl, maxWidth: 384 },
  legalText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
    letterSpacing: 0.24,
    lineHeight: 16,
  },
  legalLink: {
    fontFamily: typography.fontFamily.semibold,
    color: colors.orange,
  },
});
