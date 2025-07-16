import { IconSymbol } from '@/components/ui/IconSymbol'; // IconSymbol komponentini import qiling
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Share, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Header from '../src/components/Header';
import SwipeCard from '../src/components/SwipeCard';
import { useSwipe } from '../src/context/SwipeContext';
import { cards } from '../src/data/mockData';

const data = cards;



export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState<{ direction: 'left' | 'right' | null, value: number }>({ direction: null, value: 0 });
  const router = useRouter();
  const { swipeLeft, swipeRight } = useSwipe();

  // Helper to reset swipe effect after short delay
  const triggerSwipeEffect = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(null), 250); // 250ms effect
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const card = cards[index];
    if (!card || index >= cards.length - 1) return;
    if (direction === 'left') swipeLeft(card);
    else swipeRight(card);
    triggerSwipeEffect(direction);
    setIndex((prev) => prev + 1);
  };

  const currentCard = cards[index];

  const handleShare = async () => {
    const card = cards[index];
    if (!card) return;
    await Share.share({
      message: `Ushbu ishni ko‘ring: ${card.title}`,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        onFilterPress={() => setFilterVisible(true)}
        onDetailPress={() => router.push(`./pages/detail/${cards[index]?.id ?? '1'}`)}
        onSharePress={handleShare}
      />

      <View style={styles.container}>
        {currentCard ? (
          <SwipeCard
            card={currentCard}
            onSwipe={handleSwipe}
            onSwipeProgress={setSwipeProgress}
          />
        ) : (
          <Text style={styles.noMoreText}>📭 Ma’lumotlar mavjud emas</Text>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, styles.leftBtn]}
          onPress={() => router.push('/pages/refused')}
        >
          <Ionicons
            style={styles.leftIcon}
            name="close"
            size={30}
            color={
              swipeProgress.direction === 'left'
                ? `#${[136,136,136].map(v=>{
                    const c = Math.round(136 + (136-88)*swipeProgress.value);
                    return c.toString(16).padStart(2,'0');
                  }).join('')}`
                : '#ddd'
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.rightBtn]}
          onPress={() => router.push('/pages/chosen')}
        >
          <Ionicons
            style={styles.rightIcon}
            name="heart"
            size={30}
            color={
              swipeProgress.direction === 'right'
                ? `#ff${(77 + Math.round((221-77)*(1-swipeProgress.value))).toString(16).padStart(2,'0')}4d` // from #888 to #ff4d4d
                : '#ddd'
            }
          />
        </TouchableOpacity>
        <View style={styles.customTabBar}>
          <TouchableOpacity style={styles.tabButton}>
            <IconSymbol size={28} name="clock.fill" color="#fff" /> {/* Offer in progress */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <View style={styles.contactContainer}>
              <IconSymbol size={28} name="phone.fill" color="#fff" /> {/* Phone icon */}
              
              <IconSymbol size={28} name="envelope.fill" color="#fff" /> {/* Contact icon */}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <IconSymbol size={28} name="doc.fill" color="#fff" /> {/* Application */}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter modal */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={{ fontSize: 16 }}>🔍 Filter menyu</Text> {/* Text komponenti qo‘shildi */}
                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Text style={{ color: 'blue', marginTop: 10 }}>Yopish</Text> {/* Text komponenti qo‘shildi */}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  noMoreText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
    textAlign: 'center',
  },
  actionBtn: {
    position: 'absolute',
    bottom: 40,
    width: 120,
    height: 120,
    borderRadius: 150,
    alignItems: 'center',
    elevation: 3,
  },
  leftBtn: {
    left: -50,
    backgroundColor: '#fff',
  },
  rightBtn: {
    right: -50,
    backgroundColor: '#fff',
  },
  leftIcon: {
    // color: '#888',
    right: -20,
    top: 28,
  },
  rightIcon: {
    // color: '#ff4d4d',
    right: 20,
    top: 28,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 50,
    paddingRight: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 6,
    width: 200,
  },
  customTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 85,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D4A373',
  },
  tabButton: {
    marginTop: -20,
  },
  contactContainer: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
})