import { Text, View, StyleSheet } from 'react-native';

export default function MealAPI() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MealAPI screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
});