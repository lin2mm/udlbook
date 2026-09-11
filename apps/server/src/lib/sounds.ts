/**
 * Sound library for iFarted — multiple fart variants
 * For MVP, single fart.caf, but we can have multiple variants for fun
 * In production, these would be real audio files, but we can generate metadata
 */

export interface FartSound {
  id: string;
  name: string;
  file: string; // e.g., fart.caf, fart2.caf, etc.
  durationMs: number;
  description: string;
}

export const FART_SOUNDS: FartSound[] = [
  { id: "classic", name: "Classic", file: "fart.caf", durationMs: 1200, description: "The OG — brown noise + sine sweep, deadpan" },
  { id: "short", name: "Short & Sweet", file: "fart_short.caf", durationMs: 400, description: "Quick puff, like a Yo but fartier" },
  { id: "long", name: "Long Rumble", file: "fart_long.caf", durationMs: 2500, description: "Extended, for when context demands emphasis" },
  { id: "squeaky", name: "Squeaky", file: "fart_squeaky.caf", durationMs: 800, description: "High-pitched, cartoonish" },
  { id: "wet", name: "Wet", file: "fart_wet.caf", durationMs: 1500, description: "Don't ask, you know what it means" },
];

export function getRandomFartSound(): FartSound {
  return FART_SOUNDS[Math.floor(Math.random() * FART_SOUNDS.length)];
}

export function getFartSoundById(id: string): FartSound | undefined {
  return FART_SOUNDS.find(s => s.id === id);
}

export function getDefaultFartSound(): FartSound {
  return FART_SOUNDS[0];
}
