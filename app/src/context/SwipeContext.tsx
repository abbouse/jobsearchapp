

import React, { createContext, useContext, useState } from 'react';

export interface CardData {
  id: string;
  title: string;
  category?: string;
  salary?: string;
  languageLevel?: string;
  commuteTime?: string;
  workingDays?: string[];
  appealPoints?: string[];
  station?: string;
  image?: string;
}

interface SwipeContextType {
  choose: CardData[];
  refusal: CardData[];
  swipeLeft: (card: CardData) => void;
  swipeRight: (card: CardData) => void;
}

const SwipeContext = createContext<SwipeContextType | undefined>(undefined);

export const SwipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [choose, setChoose] = useState<CardData[]>([]);
  const [refusal, setRefusal] = useState<CardData[]>([]);

  const swipeLeft = (card: CardData) => setRefusal((prev) => [...prev, card]);
  const swipeRight = (card: CardData) => setChoose((prev) => [...prev, card]);

  return (
    <SwipeContext.Provider value={{ choose, refusal, swipeLeft, swipeRight }}>
      {children}
    </SwipeContext.Provider>
  );
};

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (!context) throw new Error('useSwipe must be used within SwipeProvider');
  return context;
};
