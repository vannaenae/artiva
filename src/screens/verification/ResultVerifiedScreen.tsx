import React from 'react';
import StatusScreen from '../../components/StatusScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResultVerified'>;

export default function ResultVerifiedScreen({ navigation }: Props) {
  return (
    <StatusScreen
      icon="check-circle"
      iconColor="#10B981"
      iconBg="rgba(16,185,129,0.1)"
      title="You're Verified!"
      body="Your profile is now live. You can start offering your services to clients immediately."
      primaryLabel="Start Exploring"
      onPrimary={() => navigation.navigate('CustomerHome')}
    />
  );
}
