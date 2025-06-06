import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
  goBack: () => void;
};

type ScoreEntry = {
  id: string;
  score: number;
  date: string;
};

const STORAGE_KEY = '@snake_game_scores';

export default function Leaderboard({ goBack }: Props) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const storedScores: ScoreEntry[] = JSON.parse(json);
        storedScores.sort((a, b) => b.score - a.score);
        setScores(storedScores);
      }
    } catch (e) {
      console.error('Failed to load scores', e);
    }
  };

  const clearScores = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setScores([]);
    } catch (e) {
      console.error('Failed to clear scores', e);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>

        {scores.length === 0 ? (
          <Text style={styles.noScores}>No scores recorded yet.</Text>
        ) : (
          scores.map((entry, idx) => (
            <View key={entry.id} style={styles.scoreRow}>
              <Text style={styles.rank}>{idx + 1}.</Text>
              <Text style={styles.scoreValue}>{entry.score}</Text>
              <Text style={styles.date}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}

        <View style={{ marginTop: 30, flexDirection: 'row' }}>
          <Pressable style={styles.button} onPress={clearScores}>
            <Text style={styles.buttonText}>Clear Scores</Text>
          </Pressable>
          <View style={{ width: 20 }} />
          <Pressable style={styles.button} onPress={goBack}>
            <Text style={styles.buttonText}>Back to Menu</Text>
          </Pressable>
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.6)', // more transparent green
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  noScores: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ffffff77',
  },
  rank: {
    fontSize: 18,
    width: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 18,
    flex: 1,
    color: '#fff',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#f1f1f1',
    width: 100,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#388E3C',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
