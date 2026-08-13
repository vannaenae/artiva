import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import TopAppBar from '../../components/TopAppBar';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CustomerBookingFormNGN'>;

export default function CustomerBookingFormNGNScreen({ navigation }: Props) {
  const [location, setLocation] = useState('123 Admiralty Way, Lekki Phase 1, Lagos');
  const [notes, setNotes] = useState('');

  return (
    <ScreenContainer scroll>
      <TopAppBar title="Book Service" onBack={() => navigation.goBack()} />
      <View style={styles.main}>
        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Feather name="briefcase" size={24} color={colors.textOnLightSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceTitle}>Deep Commercial Cleaning</Text>
            <Text style={styles.serviceSubtitle}>Premium full-scale office sanitization</Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={13} color={colors.orange} />
              <Text style={styles.ratingText}>4.9 (128 reviews)</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.price}>₦75,000</Text>
            <Text style={styles.priceUnit}>/HOUR</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, { flex: 1 }]}>
            <View style={styles.fieldLabel}>
              <Feather name="calendar" size={13} color={colors.textOnLightSecondary} />
              <Text style={styles.labelText}>Date</Text>
            </View>
            <Text style={styles.fieldValue}>11 / 15 / 2026</Text>
          </View>
          <View style={[styles.card, { flex: 1 }]}>
            <View style={styles.fieldLabel}>
              <Feather name="clock" size={13} color={colors.textOnLightSecondary} />
              <Text style={styles.labelText}>Time</Text>
            </View>
            <Text style={styles.fieldValue}>10:00 AM</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldLabel}>
            <Feather name="map-pin" size={13} color={colors.textOnLightSecondary} />
            <Text style={styles.labelText}>Service Location</Text>
          </View>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} />
        </View>

        <View style={styles.card}>
          <View style={styles.fieldLabel}>
            <Feather name="file-text" size={13} color={colors.textOnLightSecondary} />
            <Text style={styles.labelText}>Job Description & Notes</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Add specific instructions for the service provider..."
            placeholderTextColor="#6B7280"
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>₦150,000</Text>
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Button
            label="Continue to Payment"
            icon="arrow-right"
            onPress={() => navigation.navigate('CustomerEscrowPaymentSummaryNGN')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.md },
  serviceCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
  },
  serviceIcon: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: '#EDEEEF', alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  serviceSubtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLight },
  price: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: colors.textOnLight },
  priceUnit: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary, letterSpacing: 1.2 },
  row: { flexDirection: 'row', gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 17,
    gap: spacing.sm,
  },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  labelText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.sm, color: colors.textOnLightSecondary },
  fieldValue: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.textOnLight },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.textOnLight,
  },
  textarea: { minHeight: 96 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontFamily: typography.fontFamily.medium, fontSize: 12, color: colors.textOnLightSecondary },
  totalValue: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xl, color: colors.textOnLight },
});
