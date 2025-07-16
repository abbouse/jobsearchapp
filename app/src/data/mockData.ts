// This file is not a React component and should not be treated as a route.
// It only exports data for use in other components.

export interface CardData {
  id: string;
  title: string;
  category: string;
  salary: string;
  languageLevel: string;
  commuteTime: string;
  workingDays: string[];
  workHours: string;
  appealPoints: string[];
  station: string;
  image?: string;
}

export const cards: CardData[] = [
  {
    id: '1',
    title: '【倉庫】軽作業',
    category: 'Sorting',
    salary: '¥1,078〜¥1,130',
    languageLevel: 'N3',
    commuteTime: '? min',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    workHours: '6:00 - 17:00',
    appealPoints: ['シフト調整可能', '未経験歓迎'],
    station: 'todakouenn',
    image: 'https://via.placeholder.com/300x200.png?text=Light+Work',
  },
  {
    id: '2',
    title: '【工場】部品製造',
    category: 'Manufacturing',
    salary: '¥1,200〜¥1,500',
    languageLevel: 'N2',
    commuteTime: '30 min',
    workingDays: ['MON', 'TUE', 'WED', 'THU'],
    workHours: '6:00 - 18:00',
    appealPoints: ['交通費支給', '週払いOK'],
    station: 'shinjuku',
    image: 'https://via.placeholder.com/300x200.png?text=Factory+Job',
  },
  {
    id: '3',
    title: '【飲食】ホールスタッフ',
    category: 'Hospitality',
    salary: '¥1,000〜¥1,200',
    languageLevel: 'N4',
    commuteTime: '15 min',
    workingDays: ['FRI', 'SAT', 'SUN'],
    workHours: '6:00 - 18:00',
    appealPoints: ['まかないあり', '駅近'],
    station: 'ikebukuro',
    image: 'https://via.placeholder.com/300x200.png?text=Restaurant+Job',
  },
];
