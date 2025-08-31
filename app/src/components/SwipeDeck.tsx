import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SwipeCard from './SwipeCard';
import { CardData } from '../data/mockData';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  cards: CardData[];
}

const SwipeDeck: React.FC<Props> = ({ cards }) => {
  const [cardIndex, setCardIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    setCardIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      {cards
        .slice(cardIndex, cardIndex + 3) // faqat oldingi + 2 ta orqa kartani ko‘rsatamiz
        .map((card, idx) => {
          const isTop = idx === 0;
          return (
            <View
              key={card.id}
              style={[
                styles.cardContainer,
                {
                  zIndex: cards.length - idx,
                  transform: [
                    { scale: 1 - idx * 0.05 }, // orqa kartalar kichrayadi
                    { translateY: idx * 15 },  // pastroqqa tushadi
                  ],
                },
              ]}
            >
              <SwipeCard
                card={card}
                onSwipe={handleSwipe}
              />
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
  },
});

export default SwipeDeck;
