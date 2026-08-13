import React from 'react';
import ProviderPricingSetupScreen from './ProviderPricingSetupScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderPricingSetupNGN'>;

/** Same screen as ProviderPricingSetupScreen — only the currency differs. */
export default function ProviderPricingSetupNGNScreen(props: Props) {
  return <ProviderPricingSetupScreen {...props} currency="NGN" />;
}
