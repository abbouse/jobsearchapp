import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function LanguageScreen() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('uz');
  const router = useRouter();

  // Til tanlash uchun tarjimalar
  const languageLabels = {
    uz: t('uzbek'),
    en: t('english'),
    jp: t('japanese'),
  };

  // Tanlangan tilni yuklash
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Tilni yuklashda xato:', error);
      }
    };
    loadLanguage();
  }, [i18n]);

  // Tilni o'zgartirish va saqlash
  const changeLanguage = async (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Tilni saqlashda xato:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('select_language')}</Text>
      {(['uz', 'en', 'jp'] as const).map((lang) => (
        <TouchableOpacity
          key={lang}
          style={styles.radioButton}
          onPress={() => changeLanguage(lang)}
        >
          <View style={styles.radioCircle}>
            {selectedLanguage === lang && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>{languageLabels[lang]}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>{t('home')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});