import { StyleSheet } from "react-native";

export const BOX_SIZE = 80;
export const MISCLICK_RADIUS = 40;

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'skyblue',
    },
  
    header: {
      height: 160,
      paddingTop: 50,
      justifyContent: 'center',
      alignItems: 'center',
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
  
    gameField: {
      flex: 1,
    },
  
    box: {
      position: 'absolute',
      width: BOX_SIZE,
      height: BOX_SIZE,
      borderRadius: 10,
    },
  
    misclick: {
      position: 'absolute',
      width: MISCLICK_RADIUS * 2,
      height: MISCLICK_RADIUS * 2,
      borderRadius: MISCLICK_RADIUS,
      backgroundColor: 'red',
      zIndex: 10,
    },
  
    button: {
      width: 160,
      alignSelf: 'center',
      marginTop: 50,
      backgroundColor: '#7E57C2',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 10,
    },
  
    buttonText: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
  });
  