import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSwipe } from '../src/context/SwipeContext';

export default function RefusedScreen() {
  const { refusal } = useSwipe();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❌ Rad etilganlar</Text>
      <FlatList
        data={refusal}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 30 }}>Hali hech narsa rad etilmagan</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: '#ffe0e0',
    marginBottom: 10,
    borderRadius: 8,
  },
});
