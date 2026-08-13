import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  dark?: boolean;
  style?: ViewStyle;
  edges?: Edge[];
};

/** Shared page background + safe-area wrapper used by every screen. */
export default function ScreenContainer({
  children,
  scroll = false,
  dark = false,
  style,
  edges = ['bottom'],
}: Props) {
  const bg = dark ? colors.navy : colors.background;
  const Wrapper = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: bg }]} edges={edges}>
      <Wrapper
        style={scroll ? styles.flex : [styles.flex, style]}
        contentContainerStyle={scroll ? [styles.scrollContent, style] : undefined}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
