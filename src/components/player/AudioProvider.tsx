import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export default function AudioProvider() {
  // This component simply calls the hook so the audio engine runs in the background
  // independent of which page is currently mounted.
  useAudioPlayer();
  return null;
}
