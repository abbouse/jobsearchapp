import React, { createContext, useContext, useState } from 'react';
import { CardData } from '../data/mockData';

interface SwipeContextType {
  choose: CardData[];
  refusal: CardData[];
  swipeRight: (card: CardData) => void;
  swipeLeft: (card: CardData) => void;
  removeCard: (cardId: string, listType: 'choose' | 'refusal') => void;
}

const SwipeContext = createContext<SwipeContextType | undefined>(undefined);

export const SwipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [choose, setChoose] = useState<CardData[]>([]);
  const [refusal, setRefusal] = useState<CardData[]>([]);

  const swipeRight = (card: CardData) => {
    console.log('Swiping right:', card.id, card.title);
    setChoose((prev) => {
      if (!prev.some((item) => item.id === card.id)) {
        return [...prev, card];
      }
      return prev;
    });
    setRefusal((prev) => prev.filter((item) => item.id !== card.id));
  };

  const swipeLeft = (card: CardData) => {
    console.log('Swiping left:', card.id, card.title);
    setRefusal((prev) => {
      if (!prev.some((item) => item.id === card.id)) {
        return [...prev, card];
      }
      return prev;
    });
    setChoose((prev) => prev.filter((item) => item.id !== card.id));
  };

  const removeCard = (cardId: string, listType: 'choose' | 'refusal') => {
    console.log(`Removing card ${cardId} from ${listType}`);
    if (listType === 'choose') {
      setChoose((prev) => prev.filter((item) => item.id !== cardId));
    } else if (listType === 'refusal') {
      setRefusal((prev) => prev.filter((item) => item.id !== cardId));
    }
  };

  return (
    <SwipeContext.Provider value={{ choose, refusal, swipeRight, swipeLeft, removeCard }}>
      {children}
    </SwipeContext.Provider>
  );
};

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (!context) {
    throw new Error('useSwipe must be used within a SwipeProvider');
  }
  return context;
};