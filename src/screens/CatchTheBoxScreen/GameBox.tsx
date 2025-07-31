import { FC, memo } from 'react';
import { ViewStyle } from 'react-native';
import { GestureType, GestureDetector } from 'react-native-gesture-handler';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';

interface IGameBoxProps {
  animatedStyle: AnimatedStyle<ViewStyle>;
  tap: GestureType;
}

export const GameBox: FC<IGameBoxProps> = memo(({ animatedStyle, tap }) => {
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
});
