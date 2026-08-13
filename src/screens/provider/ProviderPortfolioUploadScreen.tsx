import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderPortfolioUpload'>;

const guidelines = [
  'Use natural lighting when possible.',
  'Ensure images are in focus and high resolution (at least 1080px wide).',
  'Avoid heavy filters; keep the look professional and authentic.',
  'Supported formats: JPG, PNG. Max size: 5MB per image.',
];

export default function ProviderPortfolioUploadScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <TopAppBar onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.heading}>Showcase your work</Text>
        <Text style={styles.subheading}>Upload high-quality images to attract more clients.</Text>

        <View style={styles.guidelinesCard}>
          <Feather name="image" size={28} color="#3A4A9E" />
          <View style={{ flex: 1 }}>
            <Text style={styles.guidelinesTitle}>Image Quality Guidelines</Text>
            {guidelines.map((g) => (
              <Text key={g} style={styles.guidelineItem}>
                •  {g}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.addTile}>
            <View style={styles.addIcon}>
              <Feather name="plus" size={24} color={colors.orange} />
            </View>
            <Text style={styles.addLabel}>Add Photo</Text>
          </TouchableOpacity>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.photoTile}>
              <Feather name="image" size={32} color={colors.textOnLightSecondary} />
              <TouchableOpacity style={styles.deleteBadge}>
                <Feather name="trash-2" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Button
          label="Save Portfolio"
          onPress={() => navigation.navigate('ProviderBusinessBio')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.lg },
  heading: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.display, color: colors.textOnLight, letterSpacing: -0.64 },
  subheading: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLightSecondary, marginTop: -spacing.sm },
  guidelinesCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
  },
  guidelinesTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight, marginBottom: 4 },
  guidelineItem: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary, marginBottom: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  addTile: {
    width: '47%',
    height: 171,
    borderWidth: 2,
    borderColor: colors.divider,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    backgroundColor: '#EDEEEF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addIcon: { width: 48, height: 48, borderRadius: 9999, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  addLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  photoTile: {
    width: '47%',
    height: 171,
    borderRadius: radius.md,
    backgroundColor: '#E7E8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: 'rgba(25,28,29,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
