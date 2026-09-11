/**
 * SoundPicker for mobile — choose fart variant
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FART_SOUNDS, FartSound } from '../../../server/src/lib/sounds'; // shared lib, but for mobile we duplicate type

// Duplicate for mobile independence
const SOUNDS: FartSound[] = [
  { id: "classic", name: "Classic", file: "fart.caf", durationMs: 1200, description: "The OG — brown noise + sine sweep, deadpan" },
  { id: "short", name: "Short & Sweet", file: "fart_short.caf", durationMs: 400, description: "Quick puff, like a Yo but fartier" },
  { id: "long", name: "Long Rumble", file: "fart_long.caf", durationMs: 2500, description: "Extended, for when context demands emphasis" },
  { id: "squeaky", name: "Squeaky", file: "fart_squeaky.caf", durationMs: 800, description: "High-pitched, cartoonish" },
  { id: "wet", name: "Wet", file: "fart_wet.caf", durationMs: 1500, description: "Don't ask, you know what it means" },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function SoundPicker({ selected, onSelect }: Props) {
  return (
    <ScrollView style={{ maxHeight: 300 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>🔊 Sound Picker</Text>
      <Text style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>Choose your fart — classic is default</Text>
      {SOUNDS.map(s => (
        <TouchableOpacity
          key={s.id}
          onPress={() => onSelect(s.id)}
          style={{
            padding: 12,
            borderWidth: 2,
            borderColor: selected === s.id ? '#000' : '#eee',
            borderRadius: 12,
            backgroundColor: selected === s.id ? '#fff7ed' : '#fff',
            marginBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600' }}>{s.name} {selected === s.id && '✅'}</Text>
            <Text style={{ fontSize: 11, color: '#666' }}>{s.description} · {s.durationMs}ms</Text>
          </View>
          <Text style={{ fontSize: 12 }}>▶️</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

interface FartSound {
  id: string;
  name: string;
  file: string;
  durationMs: number;
  description: string;
}
