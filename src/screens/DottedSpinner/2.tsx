import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DOTS = 8;
const RADIUS = 40;
const DOT_RADIUS = 6;
const DURATION = 3500;

const PAUSE_RATIO = 0.2; // 20% времени в начале и конце пауза

export const DottedSpinner = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: DURATION, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={100} height={100}>
        {Array.from({ length: DOTS }).map((_, i) => {
          const animatedProgress = useDerivedValue(() => {
            const t = progress.value;
            const delay = i / DOTS * (1 - 2 * PAUSE_RATIO); // задержка с учётом пауз

            if (t < PAUSE_RATIO) {
              // пауза в начале, точки стоят в ряд
              return 0;
            }
            if (t > 1 - PAUSE_RATIO) {
              // пауза в конце, точки в ряд
              return 1;
            }

            // нормализуем прогресс для движения
            let moveT = (t - PAUSE_RATIO) / (1 - 2 * PAUSE_RATIO);
            moveT -= delay;
            if (moveT < 0) moveT = 0;

            // ускоряем движение, чтобы догонять
            const eased = Easing.out(Easing.quad)(moveT);
            return eased;
          });

          const animatedProps = useAnimatedProps(() => {
            const p = animatedProgress.value;

            // В паузах точки в ряд, слегка разнесены
            if (p === 0 || p === 1) {
              const spacing = 3.5;
              return {
                cx: 50 + (i - (DOTS - 1) / 2) * spacing,
                cy: 50 - RADIUS,
                r: DOT_RADIUS,
                opacity: 1,
              };
            }

            // По кругу движение
            const angle = interpolate(
              p,
              [0, 1],
              [-Math.PI / 2, 3 * Math.PI / 2],
              Extrapolation.CLAMP
            );
            const cx = 50 + RADIUS * Math.cos(angle);
            const cy = 50 + RADIUS * Math.sin(angle);

            // Масштаб и прозрачность для эффекта паровозика
            const scale = interpolate(p, [0, 0.6, 1], [1.3, 1, 0.7]);
            const opacity = interpolate(p, [0, 0.7, 1], [1, 0.7, 0.3]);

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
  container: { alignItems: "center", justifyContent: "center", padding: 20 },
});
