import React from 'react';
import StatusScreen from '../../components/StatusScreen';
import { colors } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PendingStatus'>;

export default function PendingStatusScreen({ navigation }: Props) {
  return (
    <StatusScreen
      icon="clock"
      iconColor={colors.navy}
      iconBg="#F3F4F5"
      title="Verification in progress"
      body={"We're reviewing your documents. This usually takes 24-48 hours."}
      primaryLabel="Go to Dashboard"
      onPrimary={() => navigation.navigate('CustomerHome')}
      footer="Need help? Contact Support"
    />
  );
}
