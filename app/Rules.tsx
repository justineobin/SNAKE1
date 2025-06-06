import React from 'react';
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

export default function Rules({ goBack }: Props) {
  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🐍 Game Rules</Text>

        <View style={styles.card}>
          <Text style={styles.ruleLine}>1️⃣ Swipe to move the snake.</Text>
          <Text style={styles.ruleLine}>🍎 Eat apples to grow longer.</Text>
          <Text style={styles.ruleLine}>🧱 Avoid hitting walls or your tail.</Text>
          <Text style={styles.ruleLine}>⚡ Speed increases as you score!</Text>
          <Text style={styles.ruleLine}>🏁 Game ends when you crash.</Text>
          <Text style={styles.ruleLine}>🎯 Try to beat your high score!</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)', // Green with transparency
    padding: 25,
    borderRadius: 15,
    marginBottom: 40,
    width: '100%',
  },
  ruleLine: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
