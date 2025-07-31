import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

export const DottedSpinner = ({ size = 40, dotSize = 8, color = '#0078D7' }) => {
  const progress = useSharedValue(0);
  const dotCount = 8; // Как в Windows
  
  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
    
    return () => cancelAnimation(progress);
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {[...Array(dotCount)].map((_, index) => {
        const angle = (index * (2 * Math.PI)) / dotCount;
        const delay = index * 120; // Задержка для каждой точки
        
        const animatedStyle = useAnimatedStyle(() => {
          const rotation = progress.value * 2 * Math.PI;
          const currentAngle = angle + rotation;
          
          // Прозрачность меняется в зависимости от положения
          const opacity = 0.3 + 0.7 * ((Math.sin(currentAngle) + 1) / 2);
          
          return {
            opacity,
            transform: [
              {
                translateX: (size / 2 - dotSize / 2) * Math.cos(currentAngle),
              },
              {
                translateY: (size / 2 - dotSize / 2) * Math.sin(currentAngle),
              },
            ],
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
                backgroundColor: color,
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
  },
});
