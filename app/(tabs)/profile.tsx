import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Proflie screen</Text>
      <Link href="/" style={styles.button}>
        Logout
      </Link>
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
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000000',
  },
});