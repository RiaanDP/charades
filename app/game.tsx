import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCardsByCategory, shuffleCards, Card } from '@/constants/cards';

export default function GameScreen() {
  useEffect(() => {
    // Lock to landscape orientation when this screen mounts
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (categoryId) {
      const categoryCards = getCardsByCategory(categoryId);
      const shuffled = shuffleCards(categoryCards);
      setCards(shuffled.slice(0, 10));
    }
  }, [categoryId]);

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

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
        >
          <ThemedText style={styles.buttonText}>Skip</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.correctButton]}
          onPress={handleCorrect}
        >
          <ThemedText style={styles.buttonText}>Correct</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
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
  },
  card: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
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
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
    marginBottom: 40,
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
  skipButton: {
    backgroundColor: '#FF9500',
  },
  correctButton: {
    backgroundColor: '#34C759',
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
    gap: 40,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scoreLabel: {
    fontSize: 24,
    opacity: 0.7,
  },
  finalScore: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 32,
    opacity: 0.7,
  },
  gameOverButtons: {
    width: '100%',
    gap: 16,
  },
  playAgainButton: {
    backgroundColor: '#007AFF',
  },
  backButton: {
    backgroundColor: '#8E8E93',
  },
});
