/**
 * FartButton v2 — with haptics, sound variants, and animation
 * Yo-style: big, deadpan, no frills
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { hapticLight, hapticSuccess } from '../lib/haptics';

interface Props {
  onPress: () => Promise<void> | void;
  disabled?: boolean;
  username?: string;
}

export default function FartButtonV2({ onPress, disabled, username }: Props) {
  const [scale] = useState(new Animated.Value(1));
  const [sending, setSending] = useState(false);

  const handlePress = async () => {
    if (disabled || sending) return;
    setSending(true);
    await hapticLight();
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    try {
      await onPress();
      await hapticSuccess();
    } finally {
      setTimeout(() => setSending(false), 600);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || sending}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#000',
          borderRadius: 28,
          paddingVertical: 12,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 90,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
          {sending ? '...' : '💨 Fart'}
        </Text>
        {username && (
          <Text style={{ color: '#999', fontSize: 10, marginTop: 2 }}>@{username}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
