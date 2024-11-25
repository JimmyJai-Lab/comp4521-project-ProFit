import * as React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import {LinearGradient} from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Button from '@/components/Button';

// export const [email, setEmail] = React.useState('');
// export const [password, setPassword] = React.useState('');

export default function Signup() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [name, setName] = React.useState('');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an Acccount</Text>
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
      <View style={styles.inputBox}>
        <TextInput
          label="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon="eye" />}
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          left={<TextInput.Icon icon="account" />}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme = "register" label="Sign Up" />
      </View>
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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
    margin:50,
  },
  inputBox: {
    flex: 1 / 10,
    width: '80%',
    padding: 10,
  },
});