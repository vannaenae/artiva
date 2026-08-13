import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SelfiePreview'>;

export default function SelfiePreviewScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <TopAppBar title="Verification" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.heading}>Looking good?</Text>
        <Text style={styles.subheading}>Make sure your face is clearly visible and well lit.</Text>

        <View style={styles.previewWrap}>
          <View style={styles.previewRing} />
          <View style={styles.preview}>
            <Feather name="user" size={64} color={colors.textOnLightSecondary} />
          </View>
          <View style={styles.badge}>
            <Feather name="check" size={20} color={colors.white} />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label="Submit Photo"
            icon="arrow-right"
            onPress={() => navigation.navigate('TradeCertificate')}
          />
          <Button label="Retake" variant="outline" icon="camera" iconPosition="left" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, gap: spacing.lg },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.display,
    color: colors.textOnLight,
    letterSpacing: -0.64,
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: '#585E6F',
    textAlign: 'center',
    marginTop: -spacing.md,
  },
  previewWrap: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  previewRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(255,140,0,0.2)',
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#10B981',
    borderWidth: 4,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { width: '100%', gap: spacing.md },
});
