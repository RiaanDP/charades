import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES } from '@/constants/categories';
import {
  DEFAULT_SPEED_RUN,
  DEFAULT_TIME_ATTACK,
  GameMode,
  getDeckSizeOptions,
  getTimeOptions,
} from '@/constants/game-modes';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SetupScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();

  const [selectedMode, setSelectedMode] = useState<GameMode>('time-attack');
  const [timeLimit, setTimeLimit] = useState<30 | 60 | 90>(DEFAULT_TIME_ATTACK.timeLimit);
  const [deckSize, setDeckSize] = useState<number>(DEFAULT_TIME_ATTACK.deckSize);

  // Get category name from CATEGORIES
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  const categoryName = category?.name || 'Unknown';

  const timeOptions = getTimeOptions();
  const deckSizeOptions = getDeckSizeOptions(selectedMode);

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
    // Reset to defaults when switching modes
    if (mode === 'time-attack') {
      setTimeLimit(DEFAULT_TIME_ATTACK.timeLimit);
      setDeckSize(DEFAULT_TIME_ATTACK.deckSize);
    } else {
      setDeckSize(DEFAULT_SPEED_RUN.deckSize);
    }
  };

  const handleStartGame = () => {
    // Build URL with all parameters based on mode
    if (selectedMode === 'time-attack') {
      router.push(`/game?categoryId=${categoryId}&mode=time-attack&timeLimit=${timeLimit}&deckSize=${deckSize}`);
    } else {
      router.push(`/game?categoryId=${categoryId}&mode=speed-run&deckSize=${deckSize}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Game Setup
          </ThemedText>
          <ThemedText style={styles.subtitle}>{categoryName}</ThemedText>
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              styles.modeButtonLeft,
              selectedMode === 'time-attack' && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange('time-attack')}
            testID="mode-time-attack"
            accessibilityRole="button"
          >
            <ThemedText
              style={[
                styles.modeButtonText,
                selectedMode === 'time-attack' && styles.modeButtonTextActive,
              ]}
            >
              Time Attack
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              styles.modeButtonRight,
              selectedMode === 'speed-run' && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange('speed-run')}
            testID="mode-speed-run"
            accessibilityRole="button"
          >
            <ThemedText
              style={[
                styles.modeButtonText,
                selectedMode === 'speed-run' && styles.modeButtonTextActive,
              ]}
            >
              Speed Run
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Settings Panel */}
        <View style={styles.settingsPanel}>
          {selectedMode === 'time-attack' ? (
            <>
              {/* Time Limit */}
              <View style={styles.settingSection}>
                <ThemedText style={styles.settingLabel}>Time Limit</ThemedText>
                <View style={styles.optionGroup}>
                  {timeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.optionButton,
                        timeLimit === time && styles.optionButtonSelected,
                      ]}
                      onPress={() => setTimeLimit(time)}
                      id={`time-${time}`}
                    >
                      <ThemedText
                        style={[
                          styles.optionButtonText,
                          timeLimit === time && styles.optionButtonTextSelected,
                        ]}
                      >
                        {time}s
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Deck Size */}
              <View style={styles.settingSection}>
                <ThemedText style={styles.settingLabel}>Deck Size</ThemedText>
                <View style={styles.optionGroup}>
                  {deckSizeOptions.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.optionButton,
                        deckSize === size && styles.optionButtonSelected,
                      ]}
                      onPress={() => setDeckSize(size)}
                      id={`deck-${size}`}
                    >
                      <ThemedText
                        style={[
                          styles.optionButtonText,
                          deckSize === size && styles.optionButtonTextSelected,
                        ]}
                      >
                        {size} cards
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Deck Size */}
              <View style={styles.settingSection}>
                <ThemedText style={styles.settingLabel}>Deck Size</ThemedText>
                <View style={styles.optionGroup}>
                  {deckSizeOptions.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.optionButton,
                        deckSize === size && styles.optionButtonSelected,
                      ]}
                      onPress={() => setDeckSize(size)}
                      id={`deck-${size}`}
                    >
                      <ThemedText
                        style={[
                          styles.optionButtonText,
                          deckSize === size && styles.optionButtonTextSelected,
                        ]}
                      >
                        {size} cards
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartGame}
            testID="start-game-button"
            accessibilityRole="button"
          >
            <ThemedText style={styles.startButtonText}>Start Game</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBack}
            testID="back-button"
            accessibilityRole="button"
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    opacity: 0.7,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  modeButtonRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  settingsPanel: {
    flex: 1,
  },
  settingSection: {
    marginBottom: 30,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#34C759',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#8E8E93',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
