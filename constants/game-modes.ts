// Game mode types and configuration

export type GameMode = 'time-attack' | 'speed-run';

export interface TimeAttackSettings {
  timeLimit: 30 | 60 | 90; // seconds
  deckSize: 10 | 20 | 30; // number of cards
}

export interface SpeedRunSettings {
  deckSize: 5 | 10 | 15; // number of cards
  maxTimeout: 300; // 5 minutes in seconds
}

export type GameSettings = TimeAttackSettings | SpeedRunSettings;

// Default settings for each mode
export const DEFAULT_TIME_ATTACK: TimeAttackSettings = {
  timeLimit: 60,
  deckSize: 10,
};

export const DEFAULT_SPEED_RUN: SpeedRunSettings = {
  deckSize: 10,
  maxTimeout: 300,
};

// Helper function to get default settings for a mode
export function getDefaultSettings(mode: GameMode): GameSettings {
  switch (mode) {
    case 'time-attack':
      return DEFAULT_TIME_ATTACK;
    case 'speed-run':
      return DEFAULT_SPEED_RUN;
  }
}

// Get available time limit options for Time Attack mode
export function getTimeOptions(): (30 | 60 | 90)[] {
  return [30, 60, 90];
}

// Get available deck size options based on mode
export function getDeckSizeOptions(mode: GameMode): number[] {
  switch (mode) {
    case 'time-attack':
      return [10, 20, 30];
    case 'speed-run':
      return [5, 10, 15];
  }
}
