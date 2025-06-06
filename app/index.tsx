import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import Leaderboard from './Leaderboard';
import Rules from './Rules';
import Settings from './Settings';

const BOARD_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [[5, 5]];
const INITIAL_DIRECTION = [1, 0];
const SPEED = 150;
const STORAGE_KEY = '@snake_game_scores';

const saveScore = async (newScore: number) => {
  try {
    const existingScores = await AsyncStorage.getItem(STORAGE_KEY);
    const scores = existingScores ? JSON.parse(existingScores) : [];
    scores.push({
      id: Date.now().toString(),
      score: newScore,
      date: new Date().toISOString(),
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Error saving score', e);
  }
};

const generateFood = () => [
  Math.floor(Math.random() * BOARD_SIZE),
  Math.floor(Math.random() * BOARD_SIZE),
];

export default function Index() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(generateFood());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [screen, setScreen] = useState<'menu' | 'game' | 'leaderboard' | 'settings' | 'rules'>('menu');

  useEffect(() => {
    if (gameOver || screen !== 'game') return;
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, screen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction[1] === 0) setDirection([0, -1]);
          break;
        case 'ArrowDown':
          if (direction[1] === 0) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          if (direction[0] === 0) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          if (direction[0] === 0) setDirection([1, 0]);
          break;
      }
    };
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [direction]);

  const moveSnake = () => {
    const head = snake[0];
    const newHead = [head[0] + direction[0], head[1] + direction[1]];

    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= BOARD_SIZE ||
      newHead[1] >= BOARD_SIZE ||
      snake.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      setGameOver(true);
      saveScore(score);
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood(generateFood());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
  };

  const handleDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (dir === 'up' && direction[1] === 0) setDirection([0, -1]);
    else if (dir === 'down' && direction[1] === 0) setDirection([0, 1]);
    else if (dir === 'left' && direction[0] === 0) setDirection([-1, 0]);
    else if (dir === 'right' && direction[0] === 0) setDirection([1, 0]);
  };

  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../assets/bg.jpg')}
          style={styles.background}
          resizeMode="cover"
        >
          <Text style={styles.title}>Snake Game</Text>
          <Pressable style={styles.menuButton} onPress={() => setScreen('game')}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={() => setScreen('settings')}>
            <Text style={styles.buttonText}>Settings</Text>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={() => setScreen('leaderboard')}>
            <Text style={styles.buttonText}>Leaderboard</Text>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={() => setScreen('rules')}>
            <Text style={styles.buttonText}>Rules</Text>
          </Pressable>
        </ImageBackground>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (screen === 'leaderboard') return <Leaderboard goBack={() => setScreen('menu')} />;
  if (screen === 'settings') return <Settings goBack={() => setScreen('menu')} />;
  if (screen === 'rules') return <Rules goBack={() => setScreen('menu')} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ImageBackground
          source={require('../assets/bg.jpg')}
          style={styles.background}
          resizeMode="cover"
          imageStyle={{ borderRadius: 12 }}
        >
          <Text style={styles.title}>Snake Game</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.score}>Score: {score}</Text>
          </View>

          <View style={styles.board}>
            {snake.map(([x, y], idx) => (
              <View key={idx} style={[styles.snake, { left: x * CELL_SIZE, top: y * CELL_SIZE }]} />
            ))}
            <View style={[styles.food, { left: food[0] * CELL_SIZE, top: food[1] * CELL_SIZE }]} />
          </View>

          <View style={styles.controls}>
            <View style={styles.row}>
              <Pressable onPress={() => handleDirection('up')} style={styles.controlBox}>
                <MaterialIcons name="keyboard-arrow-up" size={36} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.row}>
              <Pressable onPress={() => handleDirection('left')} style={styles.controlBox}>
                <MaterialIcons name="keyboard-arrow-left" size={36} color="#fff" />
              </Pressable>
              <View style={{ width: 80 }} />
              <Pressable onPress={() => handleDirection('right')} style={styles.controlBox}>
                <MaterialIcons name="keyboard-arrow-right" size={36} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.row}>
              <Pressable onPress={() => handleDirection('down')} style={styles.controlBox}>
                <MaterialIcons name="keyboard-arrow-down" size={36} color="#fff" />
              </Pressable>
            </View>
          </View>

          {gameOver && (
            <View style={styles.gameOverBox}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <View style={styles.scoreBox}>
                <Text style={styles.score}>Final Score: {score}</Text>
              </View>
              <View style={styles.row}>
                <Pressable style={styles.menuButton} onPress={resetGame}>
                  <Text style={styles.buttonText}>Restart</Text>
                </Pressable>
                <Pressable style={[styles.menuButton, { marginLeft: 20 }]} onPress={() => setScreen('menu')}>
                  <Text style={styles.buttonText}>Back to Menu</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ImageBackground>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  scoreBox: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
  },
  score: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  board: {
    width: BOARD_SIZE * CELL_SIZE,
    height: BOARD_SIZE * CELL_SIZE,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: '#4CAF50',
    borderWidth: 3,
    borderRadius: 12,
    position: 'relative',
  },
  snake: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    position: 'absolute',
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#e74c3c',
    borderRadius: 6,
    position: 'absolute',
  },
  controls: {
    marginTop: 30,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBox: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 8,
  },
  gameOverBox: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 26,
    color: '#f44336',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
