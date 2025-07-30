import React, {
  FC,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const { width, height } = Dimensions.get('window');
const BOX_SIZE = 80;

export default function CatchTheBoxGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [intervalTime, setIntervalTime] = useState(1000);

  const interval = useRef<NodeJS.Timeout | null>(null);

  const boxX = useSharedValue(100);
  const boxY = useSharedValue(100);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const showBox = () => {
    const x = Math.random() * (width - BOX_SIZE);
    const y = Math.random() * (height - BOX_SIZE - 204);
    console.log(
      `Box position: x=${x}, y=${y}, width=${width}, height=${height}`,
    );
    boxX.value = x;
    boxY.value = y;
    scale.value = 1;
    opacity.value = 1;
  };

  const decreaseInterval = React.useCallback(() => {
    setIntervalTime(prev => Math.max(300, prev - 30));
  }, []);

  const onBoxTap = () => {
    interval.current && clearInterval(interval.current);
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore > highScore) setHighScore(newScore);
      return newScore;
    });

    scale.value = withTiming(1.2, {}, () => {
      scale.value = withTiming(1, { duration: 100 }, () => {
        opacity.value = withTiming(0, { duration: 100 }, () => {
          runOnJS(decreaseInterval)();
        });
      });
    });
  };

  const tap = Gesture.Tap().onEnd(() => {
    if (!gameOver) runOnJS(onBoxTap)();
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: boxX.value },
      { translateY: boxY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (!gameOver) {
      showBox();

      interval.current = setInterval(() => {
        showBox();
      }, intervalTime);

      return () => {
        interval.current && clearInterval(interval.current);
      };
    }
  }, [gameOver, intervalTime]);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setIntervalTime(1000);
    setGameOver(false);
    showBox();
  }, []);

  return (
    <View style={styles.container}>
      <Header timeLeft={timeLeft} score={score} highScore={highScore} />
      <View style={{ flex: 1, backgroundColor: 'green' }}>
        {!gameOver ? (
          <GestureDetector gesture={tap}>
            <Animated.View style={[styles.box, animatedStyle]} />
          </GestureDetector>
        ) : (
          <Pressable style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Restart</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

interface IHeaderProps {
  timeLeft: number;
  score: number;
  highScore: number;
}

const Header: FC<IHeaderProps> = ({ timeLeft, score, highScore }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Catch the Box 🎯</Text>
      <Text style={styles.timer}>Time: {timeLeft}s</Text>
      <Text style={styles.score}>
        Score: {score} | Best: {highScore}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  header: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timer: {
    fontSize: 22,
    marginBottom: 10,
    color: '#333',
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
    color: '#555',
  },
  box: {
    position: 'absolute',
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: '#FF8C00',
    borderRadius: 10,
  },
  button: {
    marginTop: 50,
    backgroundColor: '#7E57C2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
