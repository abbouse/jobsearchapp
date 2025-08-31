import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PagesHeaderProps {
  title: string;
  onBackPress?: () => void;
  onFilterPress?: () => void;
  onSharePress?: () => void;
}

const PagesHeader: React.FC<PagesHeaderProps> = ({ title, onBackPress, onFilterPress, onSharePress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
        <Ionicons name="arrow-back" size={24} color="#8B4513" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightIcons}>
        {onFilterPress && (
          <TouchableOpacity onPress={onFilterPress} style={styles.iconButton}>
            <Ionicons name="filter" size={24} color="#8B4513" />
          </TouchableOpacity>
        )}
        {onSharePress && (
          <TouchableOpacity onPress={onSharePress} style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#8B4513" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF8E1', // Parchment-like off-white/yellow
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
    elevation: 5,
    shadowColor: '#8B4513',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A2F0B', // Darker brown for text
    fontFamily: 'Georgia',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default PagesHeader;