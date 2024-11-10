import * as React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Button from '@/components/Button';

export default function Index() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.profit}>ProFit</Text>
      <Text style={styles.text}>Login</Text>
      <View style={styles.inputBox}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          left={<TextInput.Icon icon="email" />}
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon="eye" />}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme = "primary" label="Login" />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    //justifyContent: 'center',
    //testing123
  },
  text: {
    color: '#000000',
    paddingBottom: 20,
    fontSize: 30,
    fontWeight: "bold"
  },
  profit: {
    color: '#cac7ff',
    padding: 60,
    fontSize: 50,
    fontWeight: "bold"
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000000',
  },
  footerContainer: {
    flex: 1 / 10,
    padding: 10,
  },
  inputBox: {
    flex: 1 / 10,
    width: '80%',
    padding: 10,
  },
});