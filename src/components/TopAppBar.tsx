import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '../theme/tokens';

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export default function TopAppBar({ title = 'Artiva', onBack, right }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconButton} hitSlop={8}>
            <Feather name="arrow-left" size={20} color={colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 64,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  side: {
    width: 40,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 9999,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
  },
});
