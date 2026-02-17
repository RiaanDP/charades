import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card, getCardsByCategory, shuffleCards } from '@/constants/cards';
import { getAccelerometer } from '@/utils/accelerometer-mock';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GameScreen() {
  useEffect(() => {
    // Lock to landscape orientation when this screen mounts
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    // Disable hardware back button during gameplay
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default back behavior
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <GameContent />
    </View>
  );
}

function GameContent() {
  const { categoryId, mode, timeLimit, deckSize } = useLocalSearchParams<{
    categoryId: string;
    mode?: string;
    timeLimit?: string;
    deckSize?: string;
  }>();
  const router = useRouter();

  // Parse game parameters with fallbacks for backward compatibility
  const gameMode = (mode as 'time-attack' | 'speed-run') || 'time-attack';
  const gameDeckSize = deckSize ? parseInt(deckSize, 10) : 10;
  const gameTimeLimit = timeLimit ? parseInt(timeLimit, 10) : 60;

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'completed' | 'timeout' | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAppActive, setIsAppActive] = useState(true);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Time Attack mode
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Speed Run mode
  const [cardsAttempted, setCardsAttempted] = useState(0); // Time Attack tracking

  const isInNeutral = useRef(true);
  const lastGestureTime = useRef(0);
  const TILT_THRESHOLD = 0.5;
  const NEUTRAL_THRESHOLD = 0.3;
  const FLASH_DURATION = 300;
  const GESTURE_COOLDOWN = 2000; // 2 seconds between gestures
  const SPEED_RUN_TIMEOUT = 300; // 5 minutes in seconds

  useEffect(() => {
    if (categoryId) {
      const categoryCards = getCardsByCategory(categoryId);
      if (categoryCards.length === 0) {
        // Invalid category or no cards available
        return;
      }
      const shuffled = shuffleCards(categoryCards);
      // Clamp deck size to available cards
      const actualDeckSize = Math.min(gameDeckSize, categoryCards.length);
      setCards(shuffled.slice(0, actualDeckSize));
    }
  }, [categoryId, gameDeckSize]);

  // Handle app state changes (pause game when backgrounded)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsAppActive(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || !isAppActive) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished
      setGameStarted(true);
      setCountdown(null);
      // Initialize timer based on game mode
      if (gameMode === 'time-attack') {
        setTimeRemaining(gameTimeLimit);
      } else {
        setElapsedTime(0);
      }
    }
  }, [countdown, gameMode, gameTimeLimit, isAppActive]);

  // Game timer (Time Attack: countdown, Speed Run: stopwatch)
  useEffect(() => {
    if (!gameStarted || gameOver || !isAppActive) return;

    const timer = setInterval(() => {
      if (gameMode === 'time-attack') {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            setGameOver(true);
            setGameOverReason('timeout');
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Speed Run mode
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= SPEED_RUN_TIMEOUT) {
            setGameOver(true);
            setGameOverReason('timeout');
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, gameMode, isAppActive]);

  // Helper function to format time as M:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const moveToNextCard = useCallback(() => {
    // Track cards attempted for Time Attack mode
    if (gameMode === 'time-attack') {
      setCardsAttempted((prev) => prev + 1);
    }

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setGameOver(true);
      setGameOverReason('completed');
    }
  }, [currentCardIndex, cards.length, gameMode]);

  const handleCorrect = useCallback(() => {
    setScore(score + 1);
    moveToNextCard();
  }, [score, moveToNextCard]);

  const handleSkip = useCallback(() => {
    moveToNextCard();
  }, [moveToNextCard]);

  // Accelerometer tilt detection
  useEffect(() => {
    if (gameOver || !gameStarted || !isAppActive) return;

    const accelerometer = getAccelerometer();
    accelerometer.setUpdateInterval(100);

    const subscription = accelerometer.addListener(({ x, y, z }) => {
      // Phone held vertically in landscape mode against forehead:
      // - Long edge is horizontal (top and bottom)
      // - Screen faces outward
      // - When vertical against forehead: z ≈ 0
      //
      // Tilt BACKWARD (top edge tilts away from face): z becomes positive
      // Tilt FORWARD (top edge tilts toward face): z becomes negative
      //
      // State machine approach with cooldown:
      // 1. User must be in neutral position (|z| < 0.3) before gesture is recognized
      // 2. Once tilted beyond threshold, action triggers
      // 3. User must return to neutral before next action can trigger
      // 4. 2-second cooldown between gestures to prevent accidental triggers

      // Check if in neutral position
      if (Math.abs(z) < NEUTRAL_THRESHOLD) {
        isInNeutral.current = true;
        return;
      }

      // Only recognize gestures if we were previously in neutral
      if (!isInNeutral.current) {
        return;
      }

      // Check cooldown period (2 seconds since last gesture)
      const currentTime = Date.now();
      if (currentTime - lastGestureTime.current < GESTURE_COOLDOWN) {
        return;
      }

      if (z > TILT_THRESHOLD) {
        // Tilted backward (top edge away from face) - Mark correct
        isInNeutral.current = false;
        lastGestureTime.current = currentTime;
        triggerFlash('#34C759'); // Green flash
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        handleCorrect();
      } else if (z < -TILT_THRESHOLD) {
        // Tilted forward (top edge toward face) - Skip (Time Attack only)
        if (gameMode === 'time-attack') {
          isInNeutral.current = false;
          lastGestureTime.current = currentTime;
          triggerFlash('#FF9500'); // Orange flash
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          handleSkip();
        }
        // Speed Run: forward tilt is ignored (no skip allowed)
      }
    });

    return () => subscription.remove();
  }, [currentCardIndex, score, cards.length, gameOver, gameStarted, gameMode, isAppActive, handleCorrect, handleSkip]);

  const triggerFlash = (color: string) => {
    setFlashColor(color);
    setTimeout(() => {
      setFlashColor(null);
    }, FLASH_DURATION);
  };

  const handlePlayAgain = () => {
    if (!categoryId) return;

    const categoryCards = getCardsByCategory(categoryId);
    if (categoryCards.length === 0) return;

    const shuffled = shuffleCards(categoryCards);
    // Clamp deck size to available cards
    const actualDeckSize = Math.min(gameDeckSize, categoryCards.length);
    setCards(shuffled.slice(0, actualDeckSize));
    setCurrentCardIndex(0);
    setScore(0);
    setCardsAttempted(0);
    setTimeRemaining(null);
    setElapsedTime(0);
    setGameOver(false);
    setGameOverReason(null);
    setGameStarted(false);
    setCountdown(3);
    lastGestureTime.current = 0;
  };

  const handleBackToCategories = () => {
    router.push('/');
  };

  if (cards.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (gameOver) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.gameOverContainer}>
          {/* Title */}
          <ThemedText type="title" style={styles.gameOverTitle}>
            {gameMode === 'time-attack'
              ? "Time's Up!"
              : gameOverReason === 'completed'
              ? "Finished!"
              : "Time Limit Reached!"}
          </ThemedText>

          {/* Score/Time Display */}
          <View style={styles.scoreContainer}>
            {gameMode === 'time-attack' ? (
              // Time Attack: Show cards completed out of attempted
              <>
                <ThemedText style={styles.scoreLabel}>Cards Completed</ThemedText>
                <ThemedText style={styles.finalScore}>
                  {score} / {cardsAttempted}
                </ThemedText>
                <ThemedText style={styles.percentage}>
                  {cardsAttempted > 0 ? Math.round((score / cardsAttempted) * 100) : 0}%
                </ThemedText>
              </>
            ) : gameOverReason === 'completed' ? (
              // Speed Run completed: Show time
              <>
                <ThemedText style={styles.scoreLabel}>Your Time</ThemedText>
                <ThemedText style={styles.finalScore}>
                  {formatTime(elapsedTime)}
                </ThemedText>
                <ThemedText style={styles.statsLabel}>
                  {cards.length} cards
                </ThemedText>
              </>
            ) : (
              // Speed Run timeout: Show cards completed
              <>
                <ThemedText style={styles.scoreLabel}>Cards Completed</ThemedText>
                <ThemedText style={styles.finalScore}>
                  {score} / {cards.length}
                </ThemedText>
              </>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.gameOverButtons}>
            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={handlePlayAgain}
            >
              <ThemedText style={styles.buttonText}>Play Again</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBackToCategories}
            >
              <ThemedText style={styles.buttonText}>Back to Categories</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  }

  // Show countdown before game starts
  if (countdown !== null && countdown > 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.countdownContainer}>
          <ThemedText style={styles.countdownText}>{countdown}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.timerText}>
          {gameMode === 'time-attack' && timeRemaining !== null
            ? formatTime(timeRemaining)
            : formatTime(elapsedTime)}
        </ThemedText>
        <ThemedText style={styles.cardCounter}>
          {gameMode === 'time-attack'
            ? `${cardsAttempted} attempted`
            : `${currentCardIndex + 1} / ${cards.length}`}
        </ThemedText>
      </View>

      <View style={styles.cardContainer}>
        <View style={[
          styles.card,
          flashColor && { backgroundColor: flashColor }
        ]}>
          <ThemedText style={styles.cardText} id="card-text">{currentCard.text}</ThemedText>
        </View>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardCounter: {
    fontSize: 18,
    fontWeight: '600',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#FF9500',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    lineHeight: 130,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  card: {
    width: '100%',
    height: '100%',
    maxHeight: 400,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 60,
    includeFontPadding: false,
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 20,
    padding: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    gap: 5,
  },
  scoreLabel: {
    fontSize: 24,
    opacity: 0.7,
  },
  finalScore: {
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 60,
  },
  percentage: {
    fontSize: 32,
    opacity: 0.7,
  },
  statsLabel: {
    fontSize: 24,
    opacity: 0.7,
  },
  gameOverButtons: {
    width: '100%',
    gap: 16,
    flexDirection: 'row',
  },
  playAgainButton: {
    backgroundColor: '#007AFF',
  },
  backButton: {
    backgroundColor: '#8E8E93',
  },
});
