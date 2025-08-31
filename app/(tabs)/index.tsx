import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Share, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Header from '../src/components/Header';
import SwipeCard from '../src/components/SwipeCard';
import { useSwipe } from '../src/context/SwipeContext';
import { cards } from '../src/data/mockData';
interface AbbosDropdownProps {
  label: string;
  value: string | string[];
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  showSort?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  isOpen: boolean;
  onToggle: () => void;
}

const AbbosDropdown: React.FC<AbbosDropdownProps> = ({ label, value, options, onSelect, showSort = false, sortDirection = null, isOpen, onToggle }) => {
  const { t } = useTranslation();
  const isActive = Array.isArray(value) ? value.length > 0 : value !== 'all';
  const displayLabel = Array.isArray(value) && value.length > 0
    ? value.map(v => options.find(opt => opt.value === v)?.label || v).join(', ')
    : label;

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={onToggle}
      >
        <Ionicons name={isActive ? 'checkbox' : 'square-outline'} size={20} color="#D4A373" />
        <Text style={styles.dropdownText}>{displayLabel}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {showSort && isActive && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onSelect(Array.isArray(value) ? value[0] || 'all' : value);
              }}
            >
              <View style={{ flexDirection: 'column' }}>
                <Ionicons name="arrow-up" size={16} color={sortDirection === 'asc' ? '#D4A373' : '#ccc'} />
                <Ionicons name="arrow-down" size={16} color={sortDirection === 'desc' ? '#D4A373' : '#ccc'} />
              </View>
            </TouchableOpacity>
          )}
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#D4A373" style={{ marginLeft: 5 }} />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => onSelect(option.value)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons 
                      name={Array.isArray(value) ? (value.includes(option.value) ? 'checkbox' : 'square-outline') : (value === option.value ? 'checkbox' : 'square-outline')} 
                      size={20} 
                      color="#D4A373" 
                    />
                    <Text style={[styles.dropdownItemText, { marginLeft: 10 }]}>{option.label}</Text>
                  </View>
                  {showSort && (
                    <View style={{ flexDirection: 'column' }}>
                      <Ionicons name="arrow-up" size={16} color={sortDirection === 'asc' && (Array.isArray(value) ? value.includes(option.value) : value === option.value) ? '#D4A373' : '#ccc'} />
                      <Ionicons name="arrow-down" size={16} color={sortDirection === 'desc' && (Array.isArray(value) ? value.includes(option.value) : value === option.value) ? '#D4A373' : '#ccc'} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function AbbosHomeScreen() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState<{ direction: 'left' | 'right' | null, value: number }>({ direction: null, value: 0 });
  const [wageSort, setWageSort] = useState<'asc' | 'desc' | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [filters, setFilters] = useState({
    wageType: 'all' as 'all' | 'hourly' | 'daily' | 'weekly' | 'monthly',
    hourlyWage: 'all' as 'all' | '1000' | '1500' | '2000' | '3000',
    occupation: 'all',
    japaneseLevel: [] as string[],
    employmentType: 'all' as 'all' | 'full-time' | 'contractor' | 'temporary' | 'part-time',
    employmentPeriod: 'all' as 'all' | 'long-term' | 'short-term',
  });

  const router = useRouter();
  const { swipeLeft, swipeRight } = useSwipe();

  const AbbosHandleWageSelect = (selectedValue: string) => {
    let newWageType = filters.wageType;
    let newSort: 'asc' | 'desc' | null = wageSort;

    if (newWageType === selectedValue) {
      if (wageSort === 'asc') {
        newSort = 'desc';
      } else if (wageSort === 'desc') {
        newSort = null;
        newWageType = 'all';
      } else {
        newSort = 'asc';
      }
    } else {
      newWageType = selectedValue as 'all' | 'hourly' | 'daily' | 'weekly' | 'monthly';
      newSort = 'asc';
    }

    setFilters((prev) => ({ ...prev, wageType: newWageType }));
    setWageSort(newSort);
    setIndex(0);
  };

  const AbbosHandleHourlyWageSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      hourlyWage: prev.hourlyWage === selectedValue ? 'all' : (selectedValue as 'all' | '1000' | '1500' | '2000' | '3000'),
    }));
    setIndex(0);
  };

  const AbbosHandleOccupationSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      occupation: prev.occupation === selectedValue ? 'all' : selectedValue,
    }));
    setIndex(0);
  };

  const AbbosHandleJapaneseLevelSelect = (selectedValue: string) => {
    setFilters((prev) => {
      const currentLevels = prev.japaneseLevel;
      let newLevels: string[];
      if (currentLevels.includes(selectedValue)) {
        newLevels = currentLevels.filter(level => level !== selectedValue);
      } else {
        newLevels = [...currentLevels, selectedValue];
      }
      return { ...prev, japaneseLevel: newLevels };
    });
    setIndex(0);
  };

  const AbbosHandleEmploymentTypeSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentType: prev.employmentType === selectedValue
        ? 'all'
        : (selectedValue as 'all' | 'full-time' | 'contractor' | 'temporary' | 'part-time'),
    }));
    setIndex(0);
  };

  const AbbosHandleEmploymentPeriodSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentPeriod: prev.employmentPeriod === selectedValue
        ? 'all'
        : (selectedValue as 'all' | 'long-term' | 'short-term'),
    }));
    setIndex(0);
  };

  const AbbosHandleToggleDropdown = (dropdownKey: string) => {
    setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
  };

  useEffect(() => {
    let result = cards.filter((card) => {
      let matches = true;
      if (filters.wageType !== 'all') {
        matches = matches && card.salary.toLowerCase().startsWith(filters.wageType.toLowerCase());
      }
      if (filters.hourlyWage !== 'all' && filters.wageType === 'hourly') {
        const [min] = card.salary.replace('¥', '').split('〜').map((s) => parseInt(s));
        matches = matches && min >= parseInt(filters.hourlyWage);
      }
      if (filters.occupation !== 'all') {
        matches = matches && card.category.toLowerCase() === filters.occupation.toLowerCase();
      }
      if (filters.japaneseLevel.length > 0) {
        matches = matches && filters.japaneseLevel.includes(card.languageLevel);
      }
      if (filters.employmentType !== 'all') {
        matches = matches && card.employmentType === filters.employmentType;
      }
      if (filters.employmentPeriod !== 'all') {
        matches = matches && card.employmentPeriod === filters.employmentPeriod;
      }
      return matches;
    });
    if (wageSort) {
      result.sort((a, b) => {
        const getMinWage = (sal: string) => {
          const numStr = sal.replace('¥', '').split('〜')[0].trim();
          return parseInt(numStr, 10) || 0;
        };
        const aWage = getMinWage(a.salary);
        const bWage = getMinWage(b.salary);
        return wageSort === 'asc' ? aWage - bWage : bWage - aWage;
      });
    }
    setFilteredCards(result);
    setIndex(0);
  }, [filters, wageSort]);

  useEffect(() => {
    console.log('Fitrdan keyingi:', filteredCards.map(card => ({ id: card.id, title: card.title })), 'Hozirgi:', index);
  }, [filteredCards, index]);

  const AbbosTriggerSwipeEffect = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(null), 250);
  };

  const AbbosHandleSwipe = (direction: 'left' | 'right', cardIndex?: number) => {
    if (!filteredCards.length) {
      console.log('xechnima');
      return;
    }
    const idx = typeof cardIndex === 'number' ? cardIndex : index;
    const card = filteredCards[idx];
    if (!card) {
      console.log('bu yoq:', idx);
      return;
    }
    console.log('surilgan:', { id: card.id, title: card.title, direction });
    if (direction === 'left') {
      swipeLeft(card);
    } else {
      swipeRight(card);
    }
    AbbosTriggerSwipeEffect(direction);
    setFilteredCards((prev) => prev.filter((c) => c.id !== card.id));
    if (!cardIndex || cardIndex === index) {
      setIndex((prev) => {
        if (prev >= filteredCards.length - 1) {
          return 0;
        }
        return prev;
      });
    }
  };

  const AbbosHandleShare = async () => {
    if (!filteredCards[index]) return;
    await Share.share({
      message: t('share_message', { title: t(filteredCards[index].title) }),
    });
  };

  const wageTypeOptions = [
    { label: t('hourly'), value: 'hourly' },
    { label: t('daily'), value: 'daily' },
    { label: t('weekly'), value: 'weekly' },
    { label: t('monthly'), value: 'monthly' },
  ];

  const hourlyWageOptions = [
    { label: '¥1000+', value: '1000' },
    { label: '¥1500+', value: '1500' },
    { label: '¥2000+', value: '2000' },
    { label: '¥3000+', value: '3000' },
  ];

  const occupationOptions = [
    { label: t('sorting'), value: 'Sorting' },
    { label: t('manufacturing'), value: 'Manufacturing' },
    { label: t('hospitality'), value: 'Hospitality' },
    { label: t('retail'), value: 'Retail' },
    { label: t('construction'), value: 'Construction' },
  ];

  const japaneseLevelOptions = [
    { label: 'N1', value: 'N1' },
    { label: 'N2', value: 'N2' },
    { label: 'N3', value: 'N3' },
    { label: 'N4', value: 'N4' },
    { label: 'N5', value: 'N5' },
  ];

  const employmentTypeOptions = [
    { label: t('full_time'), value: 'full-time' },
    { label: t('contractor'), value: 'contractor' },
    { label: t('temporary'), value: 'temporary' },
    { label: t('part_time'), value: 'part-time' },
  ];

  const employmentPeriodOptions = [
    { label: t('long_term'), value: 'long-term' },
    { label: t('short_term'), value: 'short-term' },
  ];

  const AbbosRenderStackedCards = () => {
    const maxCardsToShow = 3;
    const cardsToRender = filteredCards.slice(index, index + maxCardsToShow);

    if (!cardsToRender.length) {
      return <Text style={styles.noMoreText}>{t('no_more_cards')}</Text>;
    }

    return cardsToRender.map((card, i) => {
      const cardStackIndex = index + i;
      const isTopCard = i === 0;
      const scale = 1 - i * 0.03;
      const offsetY = i * 20;
      return (
        <View
          key={card.id}
          style={[
            styles.cardContainer,
            {
              zIndex: -i,
              transform: [
                { scale: scale },
                { translateY: offsetY },
              ],
            },
          ]}
        >
          <SwipeCard
            card={card}
            onSwipe={(dir) => AbbosHandleSwipe(dir, cardStackIndex)}
            onSwipeProgress={isTopCard ? setSwipeProgress : () => {}}
          />
        </View>
      );
    });
  };

  return (
    <View style={styles.root}>
      <Header
        onFilterPress={() => {
          setFilterVisible(true);
          setOpenDropdown(null);
        }}
        onDetailPress={() => router.push(`./pages/detail/${filteredCards[index]?.id ?? '1'}`)}
        onSharePress={AbbosHandleShare}
      />
      <View style={styles.container}>
        {AbbosRenderStackedCards()}
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
                ? `#${[136, 136, 136].map(v => {
                    const c = Math.round(136 + (136 - 88) * swipeProgress.value);
                    return c.toString(16).padStart(2, '0');
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
                ? `#ff${(77 + Math.round((221 - 77) * (1 - swipeProgress.value))).toString(16).padStart(2, '0')}4d`
                : '#ddd'
            }
          />
        </TouchableOpacity>
        <View style={styles.customTabBar}>
          <TouchableOpacity style={styles.tabButton}>
            <IconSymbol size={28} name="clock.fill" color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <View style={styles.contactContainer}>
              <IconSymbol size={28} name="phone.fill" color="#fff" />
              <IconSymbol size={28} name="envelope.fill" color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <IconSymbol size={28} name="doc.fill" color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={filterVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => {
          setFilterVisible(false);
          setOpenDropdown(null);
        }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('filter_menu')}</Text>
                <ScrollView>
                  <AbbosDropdown
                    label={t('wage_type')}
                    value={filters.wageType}
                    options={wageTypeOptions}
                    onSelect={AbbosHandleWageSelect}
                    showSort={true}
                    sortDirection={wageSort}
                    isOpen={openDropdown === 'wageType'}
                    onToggle={() => AbbosHandleToggleDropdown('wageType')}
                  />
                  {filters.wageType === 'hourly' && (
                    <AbbosDropdown
                      label={t('hourly_wage')}
                      value={filters.hourlyWage}
                      options={hourlyWageOptions}
                      onSelect={AbbosHandleHourlyWageSelect}
                      isOpen={openDropdown === 'hourlyWage'}
                      onToggle={() => AbbosHandleToggleDropdown('hourlyWage')}
                    />
                  )}
                  <AbbosDropdown
                    label={t('occupation')}
                    value={filters.occupation}
                    options={occupationOptions}
                    onSelect={AbbosHandleOccupationSelect}
                    isOpen={openDropdown === 'occupation'}
                    onToggle={() => AbbosHandleToggleDropdown('occupation')}
                  />
                  <AbbosDropdown
                    label={t('japanese_level')}
                    value={filters.japaneseLevel}
                    options={japaneseLevelOptions}
                    onSelect={AbbosHandleJapaneseLevelSelect}
                    isOpen={openDropdown === 'japaneseLevel'}
                    onToggle={() => AbbosHandleToggleDropdown('japaneseLevel')}
                  />
                  <AbbosDropdown
                    label={t('employment_type')}
                    value={filters.employmentType}
                    options={employmentTypeOptions}
                    onSelect={AbbosHandleEmploymentTypeSelect}
                    isOpen={openDropdown === 'employmentType'}
                    onToggle={() => AbbosHandleToggleDropdown('employmentType')}
                  />
                  <AbbosDropdown
                    label={t('employment_period')}
                    value={filters.employmentPeriod}
                    options={employmentPeriodOptions}
                    onSelect={AbbosHandleEmploymentPeriodSelect}
                    isOpen={openDropdown === 'employmentPeriod'}
                    onToggle={() => AbbosHandleToggleDropdown('employmentPeriod')}
                  />
                </ScrollView>
                <TouchableOpacity
                  style={styles.dropdownContainer}
                  onPress={() => {
                    setFilterVisible(false);
                    router.push('/pages/lang');
                  }}
                >
                  <Text style={styles.dropdownText}>{t('language_settings')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setFilterVisible(false);
                  setOpenDropdown(null);
                }}>
                  <Text style={styles.closeButton}>{t('close')}</Text>
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
  root: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#D2B48C',
    elevation: 5,
    shadowColor: '#8B4513',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    height: '15%',
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
    right: -20,
    top: 28,
  },
  rightIcon: {
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
    width: 250,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D4A373',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D4A373',
    marginTop: 5,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
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
});