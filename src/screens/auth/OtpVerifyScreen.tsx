import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerify'>;

const OTP_LENGTH = 6;

export default function OtpVerifyScreen({ navigation }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  return (
    <ScreenContainer>
      <TopAppBar title="Verification" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.iconAnchor}>
          <Feather name="smartphone" size={28} color={colors.orange} />
        </View>

        <Text style={styles.heading}>Check your phone</Text>
        <View style={styles.subheadingBlock}>
          <Text style={styles.subheading}>Enter 6-digit code sent to</Text>
          <Text style={styles.phone}>+1 (555) 019-2834</Text>
        </View>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <React.Fragment key={i}>
              {i === 3 && <View style={styles.otpDash} />}
              <TextInput
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                style={[styles.otpBox, d ? styles.otpBoxFilled : null]}
                value={d}
                onChangeText={(v) => setDigit(i, v)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive a code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendAction}>Resend code</Text>
          </TouchableOpacity>
        </View>

        <Button
          label="Verify"
          icon="arrow-right"
          onPress={() => navigation.navigate('RoleSelection')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  iconAnchor: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: '#FFDCC3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xxl,
    color: colors.textOnLight,
    letterSpacing: -0.24,
    marginBottom: spacing.sm,
  },
  subheadingBlock: { alignItems: 'center', marginBottom: spacing.xl, gap: 2 },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLightSecondary,
  },
  phone: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.textOnLight,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  otpDash: { width: 8, height: 4, borderRadius: 9999, backgroundColor: colors.divider },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.background,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xl,
    color: colors.textOnLight,
  },
  otpBoxFilled: {
    borderColor: colors.orange,
    borderWidth: 2,
  },
  resendRow: { flexDirection: 'row', marginBottom: spacing.xl },
  resendLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
  resendAction: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: '#904D00',
  },
});
