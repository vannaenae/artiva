import React from 'react';
import StatusScreen from '../../components/StatusScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'UploadFailed'>;

export default function UploadFailedScreen({ navigation }: Props) {
  return (
    <StatusScreen
      icon="wifi-off"
      iconColor="#BA1A1A"
      iconBg="rgba(186,26,26,0.1)"
      title="Network Error"
      body="Please check your connection and try again."
      primaryLabel="Retry Upload"
      onPrimary={() => navigation.goBack()}
      secondaryLabel="Cancel"
      onSecondary={() => navigation.goBack()}
      footer="Need help? Check our troubleshooting guide for common upload issues."
    />
  );
}
