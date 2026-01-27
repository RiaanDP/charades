import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card, getCardsByCategory, shuffleCards } from '@/constants/cards';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GameScreen() {
  useEffect(() => {
    // Lock to landscape orientation when this screen mounts
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
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
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const lastGestureTime = useRef(0);
  const DEBOUNCE_MS = 1000;

  useEffect(() => {
    if (categoryId) {
      const categoryCards = getCardsByCategory(categoryId);
      const shuffled = shuffleCards(categoryCards);
      setCards(shuffled.slice(0, 10));
    }
  }, [categoryId]);

  // Accelerometer tilt detection
  useEffect(() => {
    if (gameOver) return;

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {

      const now = Date.now();
      if (now - lastGestureTime.current < DEBOUNCE_MS) {
        return;
      }

      // Phone held vertically in landscape mode against forehead:
      // - Long edge is horizontal (top and bottom)
      // - Screen faces outward
      // - When vertical: z ≈ -1 (screen perpendicular to ground)
      //
      // Tilt BACKWARD (top edge away from face): z becomes less negative (approaches 0)
      // Tilt FORWARD (top edge toward face): z becomes more negative (approaches -2 in units)
      //
      // We detect the change in z-axis from the vertical position

      // When vertical, z ≈ -1
      // Tilt backward (correct): z increases toward -0.7 or higher
      // Tilt forward (skip): z decreases toward -1.3 or lower

      if (z > 0.7) {
        // Tilted backward (top edge away from face) - Mark correct
        lastGestureTime.current = now;
        handleCorrect();
      } else if (z < -0.7) {
        // Tilted forward (top edge toward face) - Skip
        lastGestureTime.current = now;
        handleSkip();
      }
    });

    return () => subscription.remove();
  }, [currentCardIndex, score, cards.length, gameOver]);

  const handleCorrect = () => {
    setScore(score + 1);
    moveToNextCard();
  };

  const handleSkip = () => {
    moveToNextCard();
  };

  const moveToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const handlePlayAgain = () => {
    const categoryCards = getCardsByCategory(categoryId as string);
    const shuffled = shuffleCards(categoryCards);
    setCards(shuffled.slice(0, 10));
    setCurrentCardIndex(0);
    setScore(0);
    setGameOver(false);
  };

  const handleBackToCategories = () => {
    router.back();
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
          <ThemedText type="title" style={styles.gameOverTitle}>
            Game Over!
          </ThemedText>
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreLabel}>Your Score</ThemedText>
            <ThemedText style={styles.finalScore}>
              {score} / {cards.length}
            </ThemedText>
            <ThemedText style={styles.percentage}>
              {Math.round((score / cards.length) * 100)}%
            </ThemedText>
          </View>
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

  const currentCard = cards[currentCardIndex];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.cardCounter}>
          {currentCardIndex + 1} / {cards.length}
        </ThemedText>
        <ThemedText style={styles.scoreText}>Score: {score}</ThemedText>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <ThemedText style={styles.cardText}>{currentCard.text}</ThemedText>
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
  cardCounter: {
    fontSize: 18,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
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
