import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES } from '@/constants/categories';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Charades</ThemedText>
        <ThemedText style={styles.subtitle}>Choose a category to start playing</ThemedText>
      </View>

      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => {
              // TODO: Navigate to game setup
              console.log('Selected:', category.name);
            }}
          >
            <ThemedText type="subtitle" style={styles.categoryName}>
              {category.name}
            </ThemedText>
            <ThemedText style={styles.categoryDescription}>
              {category.description}
            </ThemedText>
            <ThemedText style={styles.cardCount}>
              {category.cardCount} cards
            </ThemedText>
          </TouchableOpacity>
        ))}
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
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 12,
  },
  cardCount: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 14,
  },
});
