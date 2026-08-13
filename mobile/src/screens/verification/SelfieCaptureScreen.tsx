import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import { colors, typography, spacing } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SelfieCapture'>;

export default function SelfieCaptureScreen({ navigation }: Props) {
  return (
    <ScreenContainer dark edges={[]}>
      <TopAppBar
        title="Verification"
        onBack={() => navigation.goBack()}
        right={<Feather name="help-circle" size={20} color={colors.white} />}
      />
      <View style={styles.camera}>
        <View style={styles.oval} />
        <View style={styles.instructionCard}>
          <Feather name="user" size={20} color={colors.white} style={{ marginBottom: spacing.xs }} />
          <Text style={styles.instructionTitle}>Align your face</Text>
          <Text style={styles.instructionBody}>Position your face entirely within the oval frame</Text>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.shutterOuter}
          onPress={() => navigation.navigate('SelfiePreview')}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>
        <View style={styles.privacyRow}>
          <Feather name="lock" size={14} color={colors.textOnLightSecondary} />
          <Text style={styles.privacyText}>Your photo will be securely encrypted.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    backgroundColor: '#191C1D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  oval: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 3 / 4,
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: 'rgba(255,140,0,0.8)',
    borderStyle: 'dashed',
  },
  instructionCard: {
    position: 'absolute',
    bottom: '18%',
    backgroundColor: 'rgba(21,27,41,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 17,
    alignItems: 'center',
  },
  instructionTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.white,
    marginBottom: 4,
  },
  instructionBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.border,
    textAlign: 'center',
    maxWidth: 200,
  },
  controls: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 64, height: 64, borderRadius: 9999, backgroundColor: colors.orange },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  privacyText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.textOnLightSecondary,
  },
});
