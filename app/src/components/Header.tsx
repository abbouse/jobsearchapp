import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

interface HeaderProps {
  onFilterPress: () => void;
  onDetailPress: () => void;
  onSharePress: () => void;
}

export default function Header({
  onFilterPress,
  onDetailPress,
  onSharePress,
}: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      {/* Asosiy header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Job list</Text>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={onFilterPress} style={styles.icon}>
            <Feather name="filter" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDetailPress} style={styles.icon}>
            <Feather name="info" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSharePress} style={styles.icon}>
            <Feather name="share-2" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu chiqgan holatda — ekranni to‘liq qamrab oladi */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.fullScreenOverlay}>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownItem}>👤 Profil</Text>
              <Text style={styles.dropdownItem}>⚙ Sozlamalar</Text>
              <Text style={styles.dropdownItem}>🚪 Chiqish</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 70,
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    marginLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    elevation: 5,
    borderRadius: 6,
    width: 180,
  },
  dropdownItem: {
    paddingVertical: 6,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.05)', // optional darkening
    zIndex: 5,
  },
});
