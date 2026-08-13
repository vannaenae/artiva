import React from 'react';
import PhoneEntryScreen from './PhoneEntryScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntryNigeria'>;

/** Same screen as PhoneEntryScreen — only the country code/placeholder differ. */
export default function PhoneEntryNigeriaScreen(props: Props) {
  return (
    <PhoneEntryScreen
      {...props}
      countryCode="+234"
      placeholder="800 000 0000"
      otpRoute="OtpVerifyNigeria"
    />
  );
}
