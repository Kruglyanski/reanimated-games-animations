import { FC, memo } from "react";
import { ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { styles } from "./styles";

interface IMisClickProps {
    animatedStyle: AnimatedStyle<ViewStyle>;
  }
  
  export const MisClick: FC<IMisClickProps> = memo(({ animatedStyle }) => {
    return (
      <Animated.View
        style={[styles.misclick, animatedStyle]}
        pointerEvents="none"
      />
    );
  });