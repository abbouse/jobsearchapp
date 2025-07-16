import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { cards } from '../../src/data/mockData';
export const metadata = {
  title: 'Detail page',
};

export default function JobDetailPage() {
  
  const { id } = useLocalSearchParams();
  const card = cards.find((c) => c.id === id);

  if (!card) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>❌ Ma'lumot topilmadi</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {card.image && <Image source={{ uri: card.image }} style={styles.image} />}
      <Text style={styles.title}>{card.title}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: 18,
    color: '#888',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});
