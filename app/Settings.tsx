import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

type Props = {
  goBack: () => void;
};

const VIBRATION_KEY = '@vibration_setting';
const DIFFICULTY_KEY = '@difficulty_setting';

export default function Settings({ goBack }: Props) {
  const [isVibrationOn, setIsVibrationOn] = useState(true);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedVibration = await AsyncStorage.getItem(VIBRATION_KEY);
        if (savedVibration !== null) {
          setIsVibrationOn(savedVibration === 'true');
        }
        const savedDifficulty = await AsyncStorage.getItem(DIFFICULTY_KEY);
        if (
          savedDifficulty === 'Easy' ||
          savedDifficulty === 'Normal' ||
          savedDifficulty === 'Hard'
        ) {
          setDifficulty(savedDifficulty);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  const toggleVibration = async (value: boolean) => {
    setIsVibrationOn(value);
    try {
      await AsyncStorage.setItem(VIBRATION_KEY, value.toString());
    } catch (e) {
      console.error('Failed to save vibration setting', e);
    }
  };

  const cycleDifficulty = async () => {
    const newDifficulty =
      difficulty === 'Easy' ? 'Normal' : difficulty === 'Normal' ? 'Hard' : 'Easy';
    setDifficulty(newDifficulty);
    try {
      await AsyncStorage.setItem(DIFFICULTY_KEY, newDifficulty);
    } catch (e) {
      console.error('Failed to save difficulty', e);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Vibration:</Text>
          <Switch
            value={isVibrationOn}
            onValueChange={toggleVibration}
            trackColor={{ false: '#aaa', true: '#4CAF50' }}
            thumbColor={isVibrationOn ? '#fff' : '#ccc'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Difficulty:</Text>
          <Pressable onPress={cycleDifficulty} style={styles.difficultyButton}>
            <Text style={styles.difficultyText}>{difficulty}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 50,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.3)', // transparent green
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#4CAF50',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 20,
    color: '#333',
  },
  difficultyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
