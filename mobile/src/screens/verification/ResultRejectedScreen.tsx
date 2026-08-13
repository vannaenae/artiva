import React from 'react';
import StatusScreen from '../../components/StatusScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResultRejected'>;

export default function ResultRejectedScreen({ navigation }: Props) {
  return (
    <StatusScreen
      icon="x-circle"
      iconColor="#BA1A1A"
      iconBg="#FFDAD6"
      title="Verification Failed"
      body={"We couldn't verify your identity.\nReason: Document unreadable."}
      primaryLabel="Try Again"
      onPrimary={() => navigation.navigate('VerificationChecklist')}
      secondaryLabel="Contact Support"
      footer="Ensure good lighting and avoid glare."
    />
  );
}
