import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

export const DottedSpinner = () => {
  const dotCount = 5; // Количество точек
  const animationDuration = 1000; // Длительность анимации в ms
  const dotSize = 10; // Размер точки
  const dotSpacing = 8; // Расстояние между точками

  // Создаем массив точек
  const dots = Array.from({ length: dotCount }).map((_, index) => {
    const progress = useSharedValue(0);
    
    // Запускаем анимацию с задержкой для каждой точки
    progress.value = withRepeat(
      withTiming(1, {
        duration: animationDuration,
        easing: Easing.linear,
      }),
      -1, // Бесконечное повторение
      false
    );

    // Анимированный стиль для каждой точки
    const animatedStyle = useAnimatedStyle(() => {
      // Задержка для каждой точки (0.2 сек между точками)
      const delay = index * (animationDuration / dotCount);
      const adjustedProgress = (progress.value + delay / animationDuration) % 1;
      
      // Прозрачность и масштаб изменяются по синусоиде со сдвигом фазы
      const opacity = 0.3 + 0.7 * Math.sin(adjustedProgress * Math.PI * 2);
      const scale = 0.5 + 0.5 * opacity;
      
      return {
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            marginHorizontal: dotSpacing / 2,
          },
          animatedStyle,
        ]}
      />
    );
  });

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dot: {
    backgroundColor: '#0078D7', // Синий цвет как в Windows
  },
});