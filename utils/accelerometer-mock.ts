import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

/**
 * Mock accelerometer for web/test environments
 * The native Accelerometer API doesn't work in browsers (Playwright tests)
 */
const mockAccelerometer = {
  setUpdateInterval: (interval: number) => {
    // No-op for web
  },
  addListener: (callback: (data: { x: number; y: number; z: number }) => void) => {
    // Return a mock subscription that does nothing
    return {
      remove: () => {},
    };
  },
  removeAllListeners: () => {
    // No-op for web
  },
};

/**
 * Get the appropriate accelerometer implementation based on platform
 * Returns mock for web, real Accelerometer for native
 */
export const getAccelerometer = () => {
  if (Platform.OS === 'web') {
    return mockAccelerometer;
  }
  return Accelerometer;
};
