/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import {StyleSheet, } from 'react-native';
import CatchTheBoxScreen from './src/screens/CatchTheBoxScreen/CatchTheBoxScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Puzzle from './src/screens/Puzzle/Puzzle';


function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <CatchTheBoxScreen/> */}
      <Puzzle/>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;