import React from 'react';
import OtpVerifyScreen from './OtpVerifyScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerifyNigeria'>;

/** Same screen as OtpVerifyScreen — only the displayed phone number differs. */
export default function OtpVerifyNigeriaScreen(props: Props) {
  return <OtpVerifyScreen {...props} phone="+234 800 019 2834" />;
}
