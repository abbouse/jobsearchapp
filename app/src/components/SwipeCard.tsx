import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CardData } from '../data/mockData';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  card: CardData;
  onSwipe: (direction: 'left' | 'right') => void;
  onSwipeProgress?: (progress: { direction: 'left' | 'right' | null, value: number }) => void;
}

const ICON_SIZE = 22;
const ICON_CONTAINER_SIZE = 42;

const appealPointIcons: Record<string, React.ReactNode> = {
  '交通費支給': <FontAwesome5 name="coins" size={20} color="#f4a261" />,
  '週払いOK': <MaterialCommunityIcons name="calendar-week" size={20} color="#f4a261" />,
  '駅近': <MaterialIcons name="train" size={20} color="#f4a261" />,
  'まかないあり': <MaterialIcons name="restaurant" size={20} color="#f4a261" />,
  '未経験歓迎': <FontAwesome5 name="user-plus" size={20} color="#f4a261" />,
  'シフト調整可能': <Ionicons name="time" size={20} color="#f4a261" />,
};

// Haftaning kunlari va ularning yaponcha birinchi kanjisi
const daysOfWeek = [
  { en: 'Mon', jp: '月' },
  { en: 'Tue', jp: '火' },
  { en: 'Wed', jp: '水' },
  { en: 'Thu', jp: '木' },
  { en: 'Fri', jp: '金' },
  { en: 'Sat', jp: '土' },
  { en: 'Sun', jp: '日' },
];

const iconRows = [
  {
    icon: (color: string) => <Feather name="clipboard" size={ICON_SIZE} color={color} />,
    value: (card: CardData) => card.category,
    info: 'Ish turi (kategoriya)',
  },
  {
    icon: (color: string) => <Feather name="dollar-sign" size={ICON_SIZE} color={color} />,
    value: (card: CardData) => card.salary,
    info: 'Ish haqi',
  },
  {
    icon: (color: string) => <Ionicons name="language" size={ICON_SIZE} color={color} />,
    value: (card: CardData) => card.languageLevel,
    info: 'Yapon tili darajasi',
  },
  {
    icon: (color: string) => <Ionicons name="walk" size={ICON_SIZE} color={color} />,
    value: (card: CardData) => card.commuteTime,
    info: 'Ishgacha yurish vaqti',
  },
  {
    icon: (color: string) => <MaterialIcons name="train" size={ICON_SIZE} color={color} />,
    value: (card: CardData) => card.station,
    info: 'Eng yaqin stansiya',
  },
];

const SwipeCard: React.FC<Props> = ({ card, onSwipe, onSwipeProgress }) => {
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalText, setModalText] = React.useState('');

  // Opacity for like/nope
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = pan.x.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Rotation for card
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp',
  });

  // PanResponder for 2D movement
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10,
      onPanResponderMove: (e, gesture) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(e, gesture);
        if (typeof gesture.dx === 'number' && onSwipeProgress) {
          let direction: 'left' | 'right' | null = null;
          let value = 0;
          if (gesture.dx > 0) {
            direction = 'right';
            value = Math.min(gesture.dx / 120, 1);
          } else if (gesture.dx < 0) {
            direction = 'left';
            value = Math.min(Math.abs(gesture.dx) / 120, 1);
          }
          onSwipeProgress({ direction, value });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (onSwipeProgress) onSwipeProgress({ direction: null, value: 0 });
        if (gesture.dx > 120) {
          Animated.timing(pan, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onSwipe('right');
            pan.setValue({ x: 0, y: 0 });
          });
        } else if (gesture.dx < -120) {
          Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onSwipe('left');
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Yapon tili darajalari uchun massiv
  const languageLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  return (
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
      {...panResponder.panHandlers}
    >
      {/* CHOOSE stamp */}
      <Animated.View
        style={[
          styles.stamp,
          styles.chooseStamp,
          { opacity: likeOpacity, transform: [{ rotate: '-20deg' }] },
        ]}
      >
        <Text style={[styles.stampText, { color: '#4caf50' }]}>Choose</Text>
      </Animated.View>

      {/* REFUSAL stamp */}
      <Animated.View
        style={[
          styles.stamp,
          styles.refusalStamp,
          { opacity: nopeOpacity, transform: [{ rotate: '20deg' }] },
        ]}
      >
        <Text style={[styles.stampText, { color: '#ff4d4d' }]}>Refusal</Text>
      </Animated.View>

      {/* Card Content */}
      <View style={styles.card}>
        <View style={styles.content}>
          {/* Title row (faqat title) */}
          <View style={styles.row}>
            <Text style={styles.title}>{card.title}</Text>
          </View>

          {/* Category row (kategoriya va ishlar ro'yxati iconi bir qatorda) */}
          <View style={[styles.row, { justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.iconBadgeContainer}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    setModalText('Kategoriya: ' + card.category);
                    setModalVisible(true);
                  }}
                >
                  <Feather name="clipboard" size={ICON_SIZE} color="#fff" />
                  <TouchableOpacity
                    style={styles.infoBadge}
                    onPress={() => {
                      setModalText('Kategoriya: ' + card.category);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="information-circle" size={18} color="#2196f3" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <Text style={styles.text}>{card.category}</Text>
            </View>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                setModalText('Ishlar roʻyxati');
                setModalVisible(true);
              }}
            >
              <FontAwesome5 name="list-ul" size={22} color="#fff" />
              <TouchableOpacity
                style={styles.infoBadge}
                onPress={() => {
                  setModalText('Ishlar roʻyxati');
                  setModalVisible(true);
                }}
              >
                <Ionicons name="information-circle" size={18} color="#2196f3" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Salary + Japanese level in one row */}
          <View style={[styles.row, { justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.iconBadgeContainer}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    setModalText('Ish haqi');
                    setModalVisible(true);
                  }}
                >
                  <Feather name="dollar-sign" size={ICON_SIZE} color="#fff" />
                  <TouchableOpacity
                    style={styles.infoBadge}
                    onPress={() => {
                      setModalText('Ish haqi');
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="information-circle" size={18} color="#2196f3" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <Text style={styles.text}>{card.salary}</Text>
            </View>
            <View style={styles.languageChainContainer}>
              <View style={styles.iconBadgeContainer}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    setModalText('Yapon tili darajasi');
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="language" size={ICON_SIZE} color="#fff" />
                  <TouchableOpacity
                    style={styles.infoBadge}
                    onPress={() => {
                      setModalText('Yapon tili darajasi');
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="information-circle" size={18} color="#2196f3" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              {languageLevels.map((level, index) => {
                const isActive = card.languageLevel === level;
                const isLast = index === languageLevels.length - 1;
                return (
                  <View key={level} style={styles.languageCircleWrapper}>
                    <View
                      style={[
                        styles.languageCircle,
                        {
                          backgroundColor: isActive ? '#2196f3' : '#A9A9A9',
                        },
                      ]}
                    />
                    {isActive && (
                      <Text style={styles.languageLabel}>{level}</Text>
                    )}
                    {!isLast && <View style={styles.connectorLine} />}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Commute time row with icons and dividers */}
          <View style={[styles.row, { justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' }]}>
            <View style={styles.iconBadgeContainer}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  setModalText('Ishgacha yurish vaqti');
                  setModalVisible(true);
                }}
              >
                <Ionicons name="walk" size={ICON_SIZE} color="#fff" />
                <TouchableOpacity
                  style={styles.infoBadge}
                  onPress={() => {
                    setModalText('Ishgacha yurish vaqti');
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="information-circle" size={18} color="#2196f3" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{card.commuteTime}</Text>
            <View style={[styles.iconBadgeContainer, { marginLeft: 10 }]}>
              <TouchableOpacity
                style={[styles.iconContainer, styles.smallIconContainer]}
                onPress={() => {
                  setModalText('Velosiped');
                  setModalVisible(true);
                }}
              >
                <MaterialCommunityIcons name="bike" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={[styles.iconBadgeContainer, { marginLeft: 8 }]}>
              <TouchableOpacity
                style={[styles.iconContainer, styles.smallIconContainer]}
                onPress={() => {
                  setModalText('Parking');
                  setModalVisible(true);
                }}
              >
                <MaterialCommunityIcons name="parking" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.iconBadgeContainer}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  setModalText('Stansiya: ' + card.station);
                  setModalVisible(true);
                }}
              >
                <MaterialIcons name="train" size={ICON_SIZE} color="#fff" />
                <TouchableOpacity
                  style={styles.infoBadge}
                  onPress={() => {
                    setModalText('Stansiya: ' + card.station);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="information-circle" size={18} color="#2196f3" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{card.station}</Text>
          </View>

          {/* Working Days */}
          <View style={[styles.badgeContainer, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
            <View style={styles.iconBadgeContainer}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  setModalText('Ish kunlari haqida ma‘lumot');
                  setModalVisible(true);
                }}
              >
                <MaterialIcons name="calendar-today" size={ICON_SIZE} color="#fff" />
                <TouchableOpacity
                  style={styles.infoBadge}
                  onPress={() => {
                    setModalText('Ish kunlari haqida ma‘lumot');
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="information-circle" size={18} color="#2196f3" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            {daysOfWeek.map((dayObj) => {
              const isWorkingDay = card.workingDays.some((day) => day.toLowerCase().startsWith(dayObj.en.toLowerCase()));
              return (
                <View
                  key={dayObj.en}
                  style={[
                    styles.dayBadge,
                    {
                      backgroundColor: isWorkingDay ? '#f4a261' : '#A9A9A9',
                    },
                  ]}
                >
                  <Text style={styles.dayText}>{dayObj.en}</Text>
                  <Text style={styles.dayJpText}>{dayObj.jp}</Text>
                </View>
              );
            })}
          </View>

          {/* Work Hours */}
          <View style={styles.workHoursContainer}>
            <Ionicons name="time-outline" size={ICON_SIZE} color="#888" />
            <Text style={styles.workHoursText}>{card.workHours || '6:00 - 18:00'}</Text>
          </View>

          {/* Appeal Points Icons */}
<View style={styles.appealIconWrapper}>
  <View style={styles.iconBadgeContainer}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  setModalText('Attractiveness of the workplace that X you want to highlight\nThis is an explanation of the icon of the company\'s appeal point.');
                  setModalVisible(true);
                }}
              >
                <MaterialIcons name="star" size={ICON_SIZE} color="#fff" />
                <TouchableOpacity
                  style={styles.infoBadge}
                  onPress={() => {
                    setModalText('Attractiveness of the workplace that X you want to highlight\nThis is an explanation of the icon of the company\'s appeal point.');
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="information-circle" size={18} color="#2196f3" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
  {card.appealPoints.map((point, idx) => (
    <View key={idx} style={styles.appealIconItem}>
      {appealPointIcons[point] || <Text style={{ fontSize: 16 }}>⭐</Text>}
    </View>
  ))}
</View>

        </View>
      </View>
      <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContentBox}>
      {/* Close Icon */}
      <TouchableOpacity
        style={styles.modalCloseIcon}
        onPress={() => setModalVisible(false)}
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={{ fontSize: 16, marginBottom: 12 }}>{modalText}</Text>
    </View>
  </View>
</Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: SCREEN_WIDTH - 40,
    marginHorizontal: 20,
    marginTop: 20,
  },
  card: {
    padding: 6,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 25,
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  dayBadge: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  dayText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  dayJpText: {
    fontSize: 8,
    color: '#fff',
  },
  stamp: {
    position: 'absolute',
    top: 10,
    width: 120,
    height: 120,
    borderWidth: 4,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  stampText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  chooseStamp: {
    left: 20,
    borderColor: '#4caf50',
  },
  refusalStamp: {
    right: 20,
    borderColor: '#ff4d4d',
  },
  iconBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: ICON_CONTAINER_SIZE / 2,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    position: 'relative',
    padding: 6,
  },
  smallIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 0,
    padding: 2,
  },
  infoBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 220,
    alignItems: 'center',
  },
  workHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  workHoursText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
    width: '100%',
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  languageChainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageCircleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  languageCircle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageLabel: {
    position: 'absolute',
    top: -20,
    left: -3,
    fontSize: 12,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  connectorLine: {
    width: 3,
    height: 1,
    backgroundColor: '#A9A9A9',
    marginHorizontal: 2,
  },
  appealIconWrapper: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 12,
},

appealIconItem: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#fcefe3',
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default SwipeCard;