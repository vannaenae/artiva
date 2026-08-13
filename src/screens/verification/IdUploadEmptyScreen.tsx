import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'IdUploadEmpty'>;

const requirements = ['Clear and readable', 'No glare or reflections', 'All four corners visible'];

export default function IdUploadEmptyScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.heading}>Upload ID Front</Text>
          <Text style={styles.subheading}>
            Please upload a clear photo of the front of your government-issued ID.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => navigation.navigate('IdUploadSelected')}
        >
          <View style={styles.uploadIcon}>
            <Feather name="upload" size={24} color="#3A4A9E" />
          </View>
          <Text style={styles.uploadPrimary}>Tap to take photo</Text>
          <Text style={styles.uploadSecondary}>or browse files</Text>
        </TouchableOpacity>

        <View style={styles.requirements}>
          <View style={styles.requirementsHeader}>
            <Feather name="info" size={14} color={colors.textOnLight} />
            <Text style={styles.requirementsTitle}>Requirements</Text>
          </View>
          {requirements.map((r) => (
            <Text key={r} style={styles.requirementItem}>
              •  {r}
            </Text>
          ))}
        </View>

        <Button label="Upload" disabled />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.xl },
  header: { gap: 4 },
  heading: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xl,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
    textAlign: 'center',
  },
  uploadBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: '#DADFF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPrimary: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: '#904D00',
  },
  uploadSecondary: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: '#585E6F',
  },
  requirements: {
    backgroundColor: '#F3F4F5',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.xs,
  },
  requirementsHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  requirementsTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  requirementItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLightSecondary,
  },
});
