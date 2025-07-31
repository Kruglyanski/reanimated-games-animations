import { FC } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

interface IHeaderProps {
    timeLeft: number;
    score: number;
    highScore: number;
  }
  
  export const Header: FC<IHeaderProps> = ({ timeLeft, score, highScore }) => {
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