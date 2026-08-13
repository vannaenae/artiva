import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProviderBusinessBio'>;

const MAX_LENGTH = 1000;
const tags = ['Experience', 'Certifications', 'Service Area', 'Work Ethic'];

export default function ProviderBusinessBioScreen({ navigation }: Props) {
  const [bio, setBio] = useState('');

  return (
    <ScreenContainer scroll>
      <TopAppBar title="Business Bio" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.heading}>Tell customers about yourself</Text>
        <Text style={styles.subheading}>
          Your bio is the first thing clients read. Share your experience, specialties, and what
          makes your service unique to build trust and attract the right customers.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>Biography</Text>
            <Text style={styles.counter}>
              {bio.length} / {MAX_LENGTH}
            </Text>
          </View>
          <TextInput
            style={styles.textarea}
            multiline
            maxLength={MAX_LENGTH}
            value={bio}
            onChangeText={setBio}
            placeholder="e.g. Hi, I'm Alex. With over 10 years of experience in..."
            placeholderTextColor={colors.textOnLightSecondary}
            textAlignVertical="top"
          />
          {!bio && (
            <View style={styles.tip}>
              <Feather name="info" size={12} color={colors.textOnLightSecondary} />
              <Text style={styles.tipText}>
                Tip: Mention your years of experience and specific skills.
              </Text>
            </View>
          )}

          <Text style={styles.suggestedLabel}>Suggested topics to include:</Text>
          <View style={styles.tagsRow}>
            {tags.map((t) => (
              <TouchableOpacity key={t} style={styles.tag} onPress={() => setBio((b) => (b ? `${b} ${t}` : t))}>
                <Text style={styles.tagText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Save & Continue"
          icon="arrow-right"
          disabled={bio.length === 0}
          onPress={() => navigation.navigate('ProviderStatusToggle')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.lg },
  heading: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.display, color: colors.textOnLight, letterSpacing: -0.64 },
  subheading: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLightSecondary },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  counter: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  textarea: {
    minHeight: 160,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.textOnLight,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(243,244,245,0.8)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  tipText: { flex: 1, fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  suggestedLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textOnLightSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: '#DADFF3',
    borderWidth: 1,
    borderColor: 'rgba(221,193,174,0.3)',
    borderRadius: 9999,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  tagText: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: '#5D6273' },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
