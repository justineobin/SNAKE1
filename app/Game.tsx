import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DIFFICULTY_KEY = '@snake_game_difficulty';

type Difficulty = 'Easy' | 'Normal' | 'Hard';

export default function Game() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Normal');
  const [snakeSpeed, setSnakeSpeed] = useState(300); // ms per move, default normal
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Load difficulty on mount
  useEffect(() => {
    const loadDifficulty = async () => {
      try {
        const storedDifficulty = await AsyncStorage.getItem(DIFFICULTY_KEY);
        if (storedDifficulty === 'Easy' || storedDifficulty === 'Normal' || storedDifficulty === 'Hard') {
          setDifficulty(storedDifficulty);
          updateSpeed(storedDifficulty);
        } else {
          updateSpeed('Normal'); // fallback
        }
      } catch (e) {
        console.error('Failed to load difficulty', e);
        updateSpeed('Normal');
      }
    };

    loadDifficulty();

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // Set snake speed based on difficulty
  const updateSpeed = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        setSnakeSpeed(400);
        break;
      case 'Normal':
        setSnakeSpeed(300);
        break;
      case 'Hard':
        setSnakeSpeed(200);
        break;
    }
  };

  // Example of starting a game loop based on snakeSpeed
  useEffect(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);

    gameLoopRef.current = setInterval(() => {
      // Here you would move your snake one step
      // For example: moveSnake();
      console.log('Snake moves with speed:', snakeSpeed);
    }, snakeSpeed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [snakeSpeed]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snake Game</Text>
      <Text style={styles.info}>Difficulty: {difficulty}</Text>
      {/* Your actual game rendering here */}
      <Text>Game board and snake will be here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  title: {fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#4CAF50'},
  info: {fontSize: 20, marginBottom: 10},
});
