import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { BOX_SIZE, MISCLICK_RADIUS, styles } from './styles';
import { GameBox } from './GameBox';
import { MisClick } from './MisClick';
import { Header } from './Header';

export default function CatchTheBoxGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [intervalTime, setIntervalTime] = useState(1000);

  const interval = useRef<NodeJS.Timeout | null>(null);

  const boxX = useSharedValue(100);
  const boxY = useSharedValue(100);
  const boxScale = useSharedValue(1);
  const boxOpacity = useSharedValue(1);
  const misClickX = useSharedValue(0);
  const misClickY = useSharedValue(0);
  const misClickScale = useSharedValue(0);

  const { width, height } = useWindowDimensions();

  const showBox = useCallback(() => {
    boxX.value = Math.random() * (width - BOX_SIZE);
    boxY.value = Math.random() * (height - BOX_SIZE - 210);
    boxScale.value = 1;
    boxOpacity.value = 1;
  }, [width, height]);

  const decreaseInterval = useCallback(() => {
    setIntervalTime(prev => Math.max(400, prev - 30));
  }, []);

  const onBoxTap = useCallback(() => {
    interval.current && clearInterval(interval.current);

    setScore(prev => {
      const newScore = prev + 1;
      if (newScore > highScore) setHighScore(newScore);
      return newScore;
    });

    boxScale.value = withTiming(1.2, { duration: 100 }, () => {
      boxOpacity.value = withTiming(0, { duration: 100 }, () => {
        runOnJS(decreaseInterval)();
      });
    });
  }, [decreaseInterval, highScore]);

  const boxTap = useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        if (!gameOver) runOnJS(onBoxTap)();
      }),
    [gameOver, onBoxTap],
  );

  const misClickTap = useMemo(() => {
    return Gesture.Tap().onStart(e => {
      if (!gameOver) {
        misClickX.value = e.x - MISCLICK_RADIUS;
        misClickY.value = e.y - MISCLICK_RADIUS;

        misClickScale.value = withTiming(1.2, { duration: 100 }, () => {
          misClickScale.value = withTiming(0, { duration: 100 });
        });
      }
    });
  }, [gameOver]);

  const baxAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      boxScale.value,
      [1, 1.2],
      ['#FF8C00', 'green'],
    );

    return {
      transform: [
        { translateX: boxX.value },
        { translateY: boxY.value },
        { scale: boxScale.value },
      ],
      opacity: boxOpacity.value,
      backgroundColor,
    };
  });

  const misclickAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: misClickX.value },
        { translateY: misClickY.value },
        { scale: misClickScale.value },
      ],
    };
  });

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
      <GestureDetector gesture={misClickTap}>
        <View style={styles.gameField}>
          {!gameOver ? (
            <>
              <MisClick animatedStyle={misclickAnimatedStyle} />
              <GameBox animatedStyle={baxAnimatedStyle} tap={boxTap} />
            </>
          ) : (
            <Pressable style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}
