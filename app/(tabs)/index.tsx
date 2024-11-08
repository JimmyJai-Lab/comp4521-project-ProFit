import * as React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Button from '@/components/Button';

export default function Index() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <View style={styles.inputBox}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme = "primary" label="Login" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  footerContainer: {
    flex: 1 / 10,
  },
  inputBox: {
    flex: 1 / 10,
    width: '80%',
  },
});