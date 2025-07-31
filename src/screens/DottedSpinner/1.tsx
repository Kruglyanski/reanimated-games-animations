import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  interpolate,
  Easing,
  Extrapolation,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DOTS = 8;
const RADIUS = 40;
const DOT_RADIUS = 6;
const SPINNER_DURATION = 3000; // один цикл

export const DottedSpinner = () => {
  // Главный прогресс — ведущая точка
  const leaderProgress = useSharedValue(0);

  useEffect(() => {
    leaderProgress.value = withRepeat(
      withTiming(1, {
        duration: SPINNER_DURATION,
        easing: Easing.out(Easing.quad), // замедление к концу
      }),
      -1,
      false
    );
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={100} height={100}>
        {Array.from({ length: DOTS }).map((_, i) => {
          const progress = useDerivedValue(() => {
            const delay = (i / DOTS) * 0.3; // запаздывание
            let p = leaderProgress.value - delay;
            if (p < 0) p += 1;
            return p;
          });

          const animatedProps = useAnimatedProps(() => {
            const angle = interpolate(
              progress.value,
              [0, 1],
              [-Math.PI / 2, 3 * Math.PI / 2], // от верхней точки, по кругу
              Extrapolation.CLAMP
            );

            const cx = 50 + RADIUS * Math.cos(angle);
            const cy = 50 + RADIUS * Math.sin(angle);

            const opacity = interpolate(
              progress.value,
              [0, 0.7, 1],
              [1, 0.5, 0.2]
            );

            const scale = interpolate(
              progress.value,
              [0, 0.2, 1],
              [1.2, 1, 0.8]
            );

            return {
              cx,
              cy,
              r: DOT_RADIUS * scale,
              opacity,
            };
          });

          return (
            <AnimatedCircle
              key={i}
              animatedProps={animatedProps}
              fill="#4D90FE"
            />
          );
        })}
      </Svg>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
