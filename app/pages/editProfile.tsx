import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import PagesHeader from '../src/components/PagesHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

interface DropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onSelect, isOpen, onToggle }) => {
  const { t } = useTranslation();
  const isActive = value !== 'Please select';
  const displayLabel = isActive ? options.find(opt => opt.value === value)?.label || t(label) : t(label);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Ionicons name={isActive ? 'checkbox' : 'square-outline'} size={20} color="#D4A373" />
        <Text style={styles.dropdownText}>{displayLabel}</Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#D4A373" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(option.value);
                  onToggle();
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name={value === option.value ? 'checkbox' : 'square-outline'}
                    size={20}
                    color="#D4A373"
                  />
                  <Text style={[styles.dropdownItemText, { marginLeft: 10 }]}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function EditProfile() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Others');
  const [age, setAge] = useState('Please select');
  const [nationality, setNationality] = useState('Please select');
  const [homeStation, setHomeStation] = useState('Please select');
  const [homeTime, setHomeTime] = useState('Please select');
  const [schoolStation, setSchoolStation] = useState('Please select');
  const [prefecture, setPrefecture] = useState('Please select');
  const [city1, setCity1] = useState('Please select');
  const [city2, setCity2] = useState('Please select');
  const [buildingName, setBuildingName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('2102889a@jdu.uz');
  const [visaStatus, setVisaStatus] = useState('Please select');
  const [residenceStatus, setResidenceStatus] = useState('Please select');
  const [japaneseLevel, setJapaneseLevel] = useState('Please select');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTime, setAvailableTime] = useState('Please select');
  const [jobValues, setJobValues] = useState('Please select');
  const [workExperiences, setWorkExperiences] = useState('Please select');
  const [otherHistory, setOtherHistory] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

const prefectures = [
    'Aichi', 'Akita', 'Aomori', 'Chiba', 'Ehime', 'Fukui', 'Fukuoka', 'Fukushima', 'Gifu', 'Gunma',
    'Hiroshima', 'Hokkaido', 'Hyogo', 'Ibaraki', 'Ishikawa', 'Iwate', 'Kagawa', 'Kagoshima', 'Kanagawa',
    'Kochi', 'Kumamoto', 'Kyoto', 'Mie', 'Miyagi', 'Miyazaki', 'Nagano', 'Nagasaki', 'Nara', 'Niigata',
    'Oita', 'Okayama', 'Okinawa', 'Osaka', 'Saga', 'Saitama', 'Shiga', 'Shimane', 'Shizuoka', 'Tochigi',
    'Tokushima', 'Tokyo', 'Tottori', 'Toyama', 'Wakayama', 'Yamagata', 'Yamaguchi', 'Yamanashi'
  ];

  const citiesByPrefecture: { [key: string]: string[] } = {
    Aichi: ['Nagoya'],
    Akita: ['Akita'],
    Aomori: ['Aomori'],
    Chiba: ['Chiba', 'Funabashi', 'Matsudo', 'Kashiwa', 'Ichikawa'],
    Ehime: ['Matsuyama'],
    Fukui: ['Fukui'],
    Fukuoka: ['Fukuoka', 'Kitakyūshū'],
    Fukushima: ['Fukushima'],
    Gifu: ['Gifu'],
    Gunma: ['Maebashi'],
    Hiroshima: ['Hiroshima', 'Fukuyama'],
    Hokkaido: ['Sapporo'],
    Hyogo: ['Kobe', 'Himeji', 'Nishinomiya', 'Amagasaki'],
    Ibaraki: ['Mito'],
    Ishikawa: ['Kanazawa'],
    Iwate: ['Morioka'],
    Kagawa: ['Takamatsu'],
    Kagoshima: ['Kagoshima'],
    Kanagawa: ['Yokohama', 'Kawasaki', 'Sagamihara'],
    Kochi: ['Kochi'],
    Kumamoto: ['Kumamoto'],
    Kyoto: ['Kyoto'],
    Mie: ['Tsu'],
    Miyagi: ['Sendai'],
    Miyazaki: ['Miyazaki'],
    Nagano: ['Nagano'],
    Nagasaki: ['Nagasaki'],
    Nara: ['Nara'],
    Niigata: ['Niigata'],
    Oita: ['Oita'],
    Okayama: ['Okayama', 'Kurashiki'],
    Okinawa: ['Naha'],
    Osaka: ['Osaka', 'Sakai', 'Takatsuki', 'Toyonaka'],
    Saga: ['Saga'],
    Saitama: ['Saitama', 'Kawaguchi'],
    Shiga: ['Otsu'],
    Shimane: ['Matsue'],
    Shizuoka: ['Hamamatsu', 'Shizuoka'],
    Tochigi: ['Utsunomiya'],
    Tokushima: ['Tokushima'],
    Tokyo: ['Tokyo', 'Hachioji', 'Machida'],
    Tottori: ['Tottori'],
    Toyama: ['Toyama'],
    Wakayama: ['Wakayama'],
    Yamagata: ['Yamagata'],
    Yamaguchi: ['Yamaguchi'],
    Yamanashi: ['Kofu'],
  };

  const stations = [
    'Shinjuku', 'Shibuya', 'Ikebukuro', 'Tokyo', 'Yokohama', 'Nagoya', 'Osaka', 'Kyoto', 'Sapporo', 'Fukuoka',
    'Hiroshima', 'Sendai', 'Chiba', 'Saitama', 'Kitakyushu', 'Kobe', 'Kanazawa', 'Takamatsu', 'Kagoshima', 'Naha'
  ];

  const ages = Array.from({ length: 43 }, (_, i) => (18 + i).toString());

  const nationalities = ['Japan', 'Uzbekistan', 'China', 'South Korea', 'USA', 'Vietnam', 'Philippines', 'India', 'Brazil', 'Other'];

  const walkTimes = ['5 min', '10 min', '15 min', '20 min', '30 min', 'Over 30 min'];

  const visaStatuses = ['Student', 'Working Holiday', 'Engineer/Specialist', 'Business Manager', 'Skilled Labor', 'Spouse of Japanese', 'Long-Term Resident', 'Tourist'];

  const residenceStatuses = ['Student', 'Designated Activities', 'Engineer', 'Dependent', 'Permanent Resident'];

  const japaneseLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'None'];

  const availableTimes = ['Morning (8-12)', 'Afternoon (12-18)', 'Evening (18-22)', 'Night (22-8)', 'Anytime'];

  const jobValueOptions = ['High Salary', 'Flexible Hours', 'Close to Home', 'Easy Work', 'Learning Opportunity'];

  const workExperienceOptions = ['Retail', 'Hospitality', 'Manufacturing', 'Construction', 'Sorting', 'None'];
const ageOptions = ages.map(a => ({ label: a, value: a })); // Numeric, not translated
  const nationalityOptions = nationalities.map(n => ({ label: t(n), value: n }));
  const stationOptions = stations.map(s => ({ label: s, value: s })); // Proper nouns, not translated
  const walkTimeOptions = walkTimes.map(t => ({ label: t, value: t })); // Not translated for consistency
  const prefectureOptions = prefectures.map(p => ({ label: p, value: p })); // Proper nouns, not translated
  const cityOptions = (citiesByPrefecture[prefecture] || []).map(c => ({ label: c, value: c })); // Proper nouns, not translated
  const visaStatusOptions = visaStatuses.map(v => ({ label: t(v), value: v }));
  const residenceStatusOptions = residenceStatuses.map(r => ({ label: t(r), value: r }));
  const japaneseLevelOptions = japaneseLevels.map(j => ({ label: j, value: j })); // JLPT levels, not translated
  const availableTimeOptions = availableTimes.map(t => ({ label: t, value: t })); // Not translated for consistency
  const jobValueOptionsFormatted = jobValueOptions.map(j => ({ label: t(j), value: j }));
  const workExperienceOptionsFormatted = workExperienceOptions.map(w => ({ label: t(w), value: w }));

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('profileData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setName(parsedData.name || '');
          setGender(parsedData.gender && ['Male', 'Female', 'Others'].includes(parsedData.gender) ? parsedData.gender : 'Others');
          setAge(parsedData.age && ages.includes(parsedData.age) ? parsedData.age : 'Please select');
          setNationality(parsedData.nationality && nationalities.includes(parsedData.nationality) ? parsedData.nationality : 'Please select');
          setHomeStation(parsedData.homeStation && stations.includes(parsedData.homeStation) ? parsedData.homeStation : 'Please select');
          setHomeTime(parsedData.homeTime && walkTimes.includes(parsedData.homeTime) ? parsedData.homeTime : 'Please select');
          setSchoolStation(parsedData.schoolStation && stations.includes(parsedData.schoolStation) ? parsedData.schoolStation : 'Please select');
          setPrefecture(parsedData.prefecture && prefectures.includes(parsedData.prefecture) ? parsedData.prefecture : 'Please select');
          setCity1(parsedData.city1 && (citiesByPrefecture[parsedData.prefecture] || []).includes(parsedData.city1) ? parsedData.city1 : 'Please select');
          setCity2(parsedData.city2 && (citiesByPrefecture[parsedData.prefecture] || []).includes(parsedData.city2) ? parsedData.city2 : 'Please select');
          setBuildingName(parsedData.buildingName || '');
          setPhoneNumber(parsedData.phoneNumber || '');
          setEmail(parsedData.email || '2102889a@jdu.uz');
          setVisaStatus(parsedData.visaStatus && visaStatuses.includes(parsedData.visaStatus) ? parsedData.visaStatus : 'Please select');
          setResidenceStatus(parsedData.residenceStatus && residenceStatuses.includes(parsedData.residenceStatus) ? parsedData.residenceStatus : 'Please select');
          setJapaneseLevel(parsedData.japaneseLevel && japaneseLevels.includes(parsedData.japaneseLevel) ? parsedData.japaneseLevel : 'Please select');
          setAvailableDays(Array.isArray(parsedData.availableDays) ? parsedData.availableDays.filter((d: string) => daysOfWeek.includes(d)) : []);
          setAvailableTime(parsedData.availableTime && availableTimes.includes(parsedData.availableTime) ? parsedData.availableTime : 'Please select');
          setJobValues(parsedData.jobValues && jobValueOptions.includes(parsedData.jobValues) ? parsedData.jobValues : 'Please select');
          setWorkExperiences(parsedData.workExperiences && workExperienceOptions.includes(parsedData.workExperiences) ? parsedData.workExperiences : 'Please select');
          setOtherHistory(parsedData.otherHistory || '');
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    loadProfileData();
  }, []);

  const handleSave = async () => {
    try {
      const profileData = {
        name, gender, age, nationality, homeStation, homeTime, schoolStation, prefecture, city1, city2, buildingName,
        phoneNumber, email, visaStatus, residenceStatus, japaneseLevel, availableDays, availableTime, jobValues,
        workExperiences, otherHistory
      };
      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleToggleDropdown = (dropdownKey: string) => {
    setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
  };

  return (
    <View style={styles.root}>
      <PagesHeader
        title={t('profile')}
        onBackPress={() => router.back()}
      />
      <ScrollView>
        {/* Name */}
        <View style={styles.field}>
          <Ionicons name="person-circle-outline" size={32} color="#A9A9A9" />
          <TextInput
            style={styles.input}
            placeholder={t('name')}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.profilePic}>
            <Ionicons name="person" size={30} color="#fff" />
          </View>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload" size={30} color="#FF8C00" />
          </TouchableOpacity>
        </View>

        {/* Age */}
        <View style={styles.field}>
          <Ionicons name="cafe-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('age')}
            value={age}
            options={[{ label: t('please_select'), value: 'Please select' }, ...ageOptions]}
            onSelect={setAge}
            isOpen={openDropdown === 'age'}
            onToggle={() => handleToggleDropdown('age')}
          />
        </View>

        {/* Nationality */}
        <View style={styles.field}>
          <Ionicons name="earth-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('nationality')}
            value={nationality}
            options={[{ label: t('please_select'), value: 'Please select' }, ...nationalityOptions]}
            onSelect={setNationality}
            isOpen={openDropdown === 'nationality'}
            onToggle={() => handleToggleDropdown('nationality')}
          />
        </View>

        {/* Gender */}
        <View style={styles.field}>
          <Ionicons name="people-outline" size={32} color="#A9A9A9" />
          <View style={styles.genderContainer}>
            <TouchableOpacity style={styles.radio} onPress={() => setGender('Male')}>
              <View style={[styles.radioCircle, gender === 'Male' && styles.radioSelected, { borderColor: '#00BFFF' }]}>
                {gender === 'Male' && <View style={styles.radioDot} />}
              </View>
              <Text>{t('male')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radio} onPress={() => setGender('Female')}>
              <View style={[styles.radioCircle, gender === 'Female' && styles.radioSelected, { borderColor: '#FFC0CB' }]}>
                {gender === 'Female' && <View style={styles.radioDot} />}
              </View>
              <Text>{t('female')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radio} onPress={() => setGender('Others')}>
              <View style={[styles.radioCircle, gender === 'Others' && styles.radioSelected, { borderColor: '#00BFFF' }]}>
                {gender === 'Others' && <View style={styles.radioDot} />}
              </View>
              <Text>{t('others')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearest Station (Home) */}
        <View style={styles.field}>
          <Ionicons name="train-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('home_station')}
            value={homeStation}
            options={[{ label: t('please_select'), value: 'Please select' }, ...stationOptions]}
            onSelect={setHomeStation}
            isOpen={openDropdown === 'homeStation'}
            onToggle={() => handleToggleDropdown('homeStation')}
          />
          <Ionicons name="walk-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('walk_time')}
            value={homeTime}
            options={[{ label: t('please_select'), value: 'Please select' }, ...walkTimeOptions]}
            onSelect={setHomeTime}
            isOpen={openDropdown === 'homeTime'}
            onToggle={() => handleToggleDropdown('homeTime')}
          />
        </View>

        {/* Nearest Station (School) */}
        <View style={styles.field}>
          <Ionicons name="train-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('school_station')}
            value={schoolStation}
            options={[{ label: t('please_select'), value: 'Please select' }, ...stationOptions]}
            onSelect={setSchoolStation}
            isOpen={openDropdown === 'schoolStation'}
            onToggle={() => handleToggleDropdown('schoolStation')}
          />
        </View>

        {/* Postal Code */}
        <View style={styles.field}>
          <View style={styles.postalIcon}>
            <Text style={styles.postalText}>〒</Text>
          </View>
          <TextInput style={styles.input} placeholder={t('postal_code')} keyboardType="numeric" />
          <TouchableOpacity style={styles.autoCompleteButton}>
            <Text style={styles.autoCompleteText}>{t('choose')}</Text>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Prefecture */}
        <View style={styles.field}>
          <Ionicons name="flag-outline" size={32} color="#228B22" />
          <Dropdown
            label={t('prefecture')}
            value={prefecture}
            options={[{ label: t('please_select'), value: 'Please select' }, ...prefectureOptions]}
            onSelect={(value) => {
              setPrefecture(value);
              setCity1('Please select');
              setCity2('Please select');
            }}
            isOpen={openDropdown === 'prefecture'}
            onToggle={() => handleToggleDropdown('prefecture')}
          />
        </View>

        {/* City/Town 1 */}
        <View style={styles.field}>
          <Ionicons name="map-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('city_town_1')}
            value={city1}
            options={[{ label: t('please_select'), value: 'Please select' }, ...cityOptions]}
            onSelect={setCity1}
            isOpen={openDropdown === 'city1'}
            onToggle={() => handleToggleDropdown('city1')}
          />
        </View>

        {/* City/Town 2 */}
        <View style={styles.field}>
          <Ionicons name="location-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('city_town_2')}
            value={city2}
            options={[{ label: t('please_select'), value: 'Please select' }, ...cityOptions]}
            onSelect={setCity2}
            isOpen={openDropdown === 'city2'}
            onToggle={() => handleToggleDropdown('city2')}
          />
        </View>

        {/* Building Name */}
        <View style={styles.field}>
          <Ionicons name="home-outline" size={32} color="#A9A9A9" />
          <TextInput style={styles.input} placeholder={t('building_name')} value={buildingName} onChangeText={setBuildingName} />
        </View>

        {/* Phone Number */}
        <View style={styles.field}>
          <Ionicons name="phone-portrait-outline" size={32} color="#A9A9A9" />
          <TextInput style={styles.input} placeholder={t('phone_number')} keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Ionicons name="mail-outline" size={32} color="#DAA520" />
          <TextInput style={styles.input} placeholder={t('email')} keyboardType="email-address" value={email} onChangeText={setEmail} />
        </View>

        {/* Visa Status */}
        <View style={styles.field}>
          <Ionicons name="card-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('visa_status')}
            value={visaStatus}
            options={[{ label: t('please_select'), value: 'Please select' }, ...visaStatusOptions]}
            onSelect={setVisaStatus}
            isOpen={openDropdown === 'visaStatus'}
            onToggle={() => handleToggleDropdown('visaStatus')}
          />
          <Text style={styles.fieldLabel}>{t('date_of_expiry')}: 17/3/2030</Text>
        </View>

        {/* Residence Status */}
        <View style={styles.field}>
          <Ionicons name="school-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('residence_status')}
            value={residenceStatus}
            options={[{ label: t('please_select'), value: 'Please select' }, ...residenceStatusOptions]}
            onSelect={setResidenceStatus}
            isOpen={openDropdown === 'residenceStatus'}
            onToggle={() => handleToggleDropdown('residenceStatus')}
          />
          <Text style={styles.fieldLabel}>{t('expected_qualification_date')}</Text>
        </View>

        {/* Japanese Language Level */}
        <View style={styles.field}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#FF0000" />
          <Dropdown
            label={t('japanese_level')}
            value={japaneseLevel}
            options={[{ label: t('please_select'), value: 'Please select' }, ...japaneseLevelOptions]}
            onSelect={setJapaneseLevel}
            isOpen={openDropdown === 'japaneseLevel'}
            onToggle={() => handleToggleDropdown('japaneseLevel')}
          />
        </View>

        {/* Available Days */}
        <View style={styles.field}>
          <Ionicons name="calendar-outline" size={32} color="#A9A9A9" />
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={styles.dayButton}
                onPress={() => {
                  setAvailableDays((prev) =>
                    prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                  );
                }}
              >
                <Text style={availableDays.includes(day) ? styles.selectedDay : null}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Time */}
        <View style={styles.field}>
          <Ionicons name="time-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('available_time')}
            value={availableTime}
            options={[{ label: t('please_select'), value: 'Please select' }, ...availableTimeOptions]}
            onSelect={setAvailableTime}
            isOpen={openDropdown === 'availableTime'}
            onToggle={() => handleToggleDropdown('availableTime')}
          />
        </View>

        {/* Values for Jobs */}
        <View style={styles.field}>
          <Ionicons name="star-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('job_values')}
            value={jobValues}
            options={[{ label: t('please_select'), value: 'Please select' }, ...jobValueOptionsFormatted]}
            onSelect={setJobValues}
            isOpen={openDropdown === 'jobValues'}
            onToggle={() => handleToggleDropdown('jobValues')}
          />
        </View>

        {/* Past Working Experiences */}
        <View style={styles.field}>
          <Ionicons name="document-text-outline" size={32} color="#A9A9A9" />
          <Dropdown
            label={t('past_work_experiences')}
            value={workExperiences}
            options={[{ label: t('please_select'), value: 'Please select' }, ...workExperienceOptionsFormatted]}
            onSelect={setWorkExperiences}
            isOpen={openDropdown === 'workExperiences'}
            onToggle={() => handleToggleDropdown('workExperiences')}
          />
        </View>

        {/* Other Work History */}
        <View style={styles.field}>
          <Ionicons name="reader-outline" size={32} color="#A9A9A9" />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder={t('other_work_history')}
            multiline
            value={otherHistory}
            onChangeText={setOtherHistory}
          />
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.previewButton}>
            <Text style={styles.buttonText}>{t('preview_download')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{t('save_profile')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{t('profile_saved_successfully')}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  dropdownContainer: {
    flex: 1,
    marginLeft: 8,
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
  genderContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 8,
  },
  selectedDay: {
    color: '#fff',
    backgroundColor: '#FF8C00',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  radioSelected: {
    borderWidth: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  postalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  autoCompleteButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoCompleteText: {
    color: '#fff',
  },
  fieldLabel: {
    marginLeft: 8,
    color: '#A9A9A9',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  dayButton: {
    backgroundColor: '#A9A9A9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
  },
  previewButton: {
    backgroundColor: '#A9A9A9',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    backgroundColor: '#D2B48C',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  uploadButton: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});