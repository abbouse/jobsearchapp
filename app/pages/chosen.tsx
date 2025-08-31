import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import PagesHeader from '../src/components/PagesHeader';
import { useSwipe } from '../src/context/SwipeContext';
import { CardData, cards } from '../src/data/mockData';
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

let AbbosDropdown: React.FC<AbbosDropdownProps> = ({ label, value, options, onSelect, showSort = false, sortDirection = null, isOpen, onToggle }) => {
  const { t } = useTranslation();
  const isActive = Array.isArray(value) ? value.length > 0 : value !== 'all';
  const displayLabel = Array.isArray(value) && value.length > 0
    ? value.map(v => options.find(opt => opt.value === v)?.label || v).join(', ')
    : label;

  return (
    <View style={AbbosStyles.dropdownContainer}>
      <TouchableOpacity 
        style={AbbosStyles.dropdownButton}
        onPress={onToggle}
      >
        <Ionicons name={isActive ? 'checkbox' : 'square-outline'} size={20} color="#D4A373" />
        <Text style={AbbosStyles.dropdownText}>{displayLabel}</Text>
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
        <View style={AbbosStyles.dropdownList}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={AbbosStyles.dropdownItem}
                onPress={() => onSelect(option.value)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons 
                      name={Array.isArray(value) ? (value.includes(option.value) ? 'checkbox' : 'square-outline') : (value === option.value ? 'checkbox' : 'square-outline')} 
                      size={20} 
                      color="#D4A373" 
                    />
                    <Text style={[AbbosStyles.dropdownItemText, { marginLeft: 10 }]}>{option.label}</Text>
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

export default function AbbosChosenScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const { choose, swipeLeft, removeCard } = useSwipe();
  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [wageSort, setWageSort] = useState<'asc' | 'desc' | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const [filters, setFilters] = useState({
    wageType: 'all' as 'all' | 'hourly' | 'daily' | 'weekly' | 'monthly',
    hourlyWage: 'all' as 'all' | '1000' | '1500' | '2000' | '3000',
    occupation: 'all',
    japaneseLevel: [] as string[],
    employmentType: 'all' as 'all' | 'full-time' | 'contractor' | 'temporary' | 'part-time',
    employmentPeriod: 'all' as 'all' | 'long-term' | 'short-term',
  });
  const filteredChoose = React.useMemo(() => {
    let result = cards.filter((card) => {
      let matches = choose.some((item) => item.id === card.id);
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
    return result;
  }, [choose, filters, wageSort]);

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
  };

  const AbbosHandleHourlyWageSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      hourlyWage: prev.hourlyWage === selectedValue ? 'all' : (selectedValue as 'all' | '1000' | '1500' | '2000' | '3000'),
    }));
  };

  const AbbosHandleOccupationSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      occupation: prev.occupation === selectedValue ? 'all' : selectedValue,
    }));
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
  };

  const AbbosHandleEmploymentTypeSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentType: prev.employmentType === selectedValue
        ? 'all'
        : (selectedValue as 'all' | 'full-time' | 'contractor' | 'temporary' | 'part-time'),
    }));
  };

  const AbbosHandleEmploymentPeriodSelect = (selectedValue: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentPeriod: prev.employmentPeriod === selectedValue
        ? 'all'
        : (selectedValue as 'all' | 'long-term' | 'short-term'),
    }));
  };

  const AbbosHandleToggleDropdown = (dropdownKey: string) => {
    setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
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

  const categoryIcons: Record<string, React.ReactNode> = {
    Sorting: <Feather name="clipboard" size={20} color="#8B4513" />,
    Manufacturing: <MaterialIcons name="build" size={20} color="#8B4513" />,
    Hospitality: <MaterialIcons name="restaurant" size={20} color="#8B4513" />,
    Retail: <Feather name="shopping-cart" size={20} color="#8B4513" />,
    Construction: <MaterialIcons name="construction" size={20} color="#8B4513" />,
  };

  const AbbosHandleRemove = (cardId: string) => {
    removeCard(cardId, 'choose');
  };

  const AbbosHandleMoveToRefused = (card: CardData) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const AbbosConfirmMoveToRefused = () => {
    if (selectedCard) {
      removeCard(selectedCard.id, 'choose');
      swipeLeft(selectedCard);
    }
    setModalVisible(false);
    setSelectedCard(null);
  };

  return (
    <View style={AbbosStyles.container}>
      <PagesHeader
        title={t('chosen_title')}
        onBackPress={() => router.back()}
        onFilterPress={() => {
          setFilterVisible(true);
          setOpenDropdown(null);
        }}
      />
      <FlatList
        data={filteredChoose}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={AbbosStyles.card}>
            <View style={AbbosStyles.cardContent}>
              <View style={AbbosStyles.iconContainer}>
                {categoryIcons[item.category] || <Feather name="briefcase" size={20} color="#8B4513" />}
              </View>
              <View style={AbbosStyles.textContainer}>
                <Text style={AbbosStyles.cardTitle}>{t(item.title)}</Text>
                <Text style={AbbosStyles.cardSalary}>{item.salary}</Text>
              </View>
              <View style={AbbosStyles.actionContainer}>
                <TouchableOpacity
                  style={AbbosStyles.actionButton}
                  onPress={() => AbbosHandleMoveToRefused(item)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4d4d" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={AbbosStyles.actionButton}
                  onPress={() => AbbosHandleRemove(item.id)}
                >
                  <Ionicons name="trash" size={24} color="#8B4513" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={AbbosStyles.emptyText}>{t('no_chosen')}</Text>}
      />
      <Modal visible={filterVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => {
          setFilterVisible(false);
          setOpenDropdown(null);
        }}>
          <View style={AbbosStyles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={AbbosStyles.modalContent}>
                <Text style={AbbosStyles.modalTitle}>{t('filter_menu')}</Text>
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
                  style={AbbosStyles.dropdownContainer}
                  onPress={() => {
                    setFilterVisible(false);
                    router.push('/pages/lang');
                  }}
                >
                  <Text style={AbbosStyles.dropdownText}>{t('language_settings')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setFilterVisible(false);
                  setOpenDropdown(null);
                }}>
                  <Text style={AbbosStyles.closeButton}>{t('close')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={AbbosStyles.modalOverlay}>
          <View style={AbbosStyles.modalContentBox}>
            <TouchableOpacity
              style={AbbosStyles.modalCloseIcon}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
            <Text style={AbbosStyles.modalText}>
              {selectedCard?.title} {t('move_to_refused')}
            </Text>
            <TouchableOpacity
              style={AbbosStyles.modalButton}
              onPress={AbbosConfirmMoveToRefused}
            >
              <Text style={AbbosStyles.modalButtonText}>{t('yes')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const AbbosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  card: {
    padding: 15,
    backgroundColor: '#FFF8E1',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
    elevation: 8,
    shadowColor: '#8B4513',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    marginHorizontal: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DEB887',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: '#D2B48C',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2F0B',
  },
  cardSalary: {
    fontSize: 14,
    color: '#4A2F0B',
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  emptyText: {
    fontSize: 18,
    color: '#4A2F0B',
    marginTop: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
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
  modalContentBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 24,
    minWidth: 220,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2B48C',
    elevation: 5,
    shadowColor: '#8B4513',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2F0B',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#4A2F0B',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalButton: {
    backgroundColor: '#D4A373',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: '600',
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
});