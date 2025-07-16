import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSwipe } from '../src/context/SwipeContext';

export default function ChosenScreen() {
  const { choose } = useSwipe();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Tanlanganlar</Text>
      <FlatList
        data={choose}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 30 }}>Hali hech narsa tanlanmagan</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: '#e0ffe0',
    marginBottom: 10,
    borderRadius: 8,
  },
});
