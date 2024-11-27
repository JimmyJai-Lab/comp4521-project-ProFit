import * as React from 'react';
import { Text, View, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Button from '@/components/Button';
import { router } from 'expo-router';
import accountService from '@/services/auth/AccountService';
import auth from "@react-native-firebase/auth";
import { useEffect } from 'react';

// export const [email, setEmail] = React.useState('');
// export const [password, setPassword] = React.useState('');

export default function Signup() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        router.replace("/fitness");
      }
    });
    return subscriber;
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !confirm || !name) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    try {
      setLoading(true);
      await accountService.registerUser(email.trim(), password, name.trim());
      setEmail("");
      setPassword("");
      setConfirm("");
      setName("");
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setEmail("");
    setPassword("");
    setConfirm("");
    setName("");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an Acccount</Text>
      <View style={styles.inputBox}>
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => {
                setShowPassword(!showPassword);
                return false;
              }}
              forceTextInputFocus={false}
            />
          }
          style={{ backgroundColor: 'white' }}
          outlineColor="#702963"
          activeOutlineColor="#702963"
          textContentType="password"
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          mode="outlined"
          label="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirmPassword}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={() => {
                setShowConfirmPassword(!showConfirmPassword);
                return false;
              }}
              forceTextInputFocus={false}
            />
          }
          style={{ backgroundColor: 'white' }}
          outlineColor="#702963"
          activeOutlineColor="#702963"
          textContentType="password"
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          mode="outlined"
          label="Username"
          value={name}
          onChangeText={setName}
          left={<TextInput.Icon icon="account" />}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="register"
          label="Sign Up"
          onPress={handleSignUp}
          disabled={loading}
        />
        <View style={{ height: 10 }} />
        <Button
          theme="secondary"
          label="Back to Login"
          onPress={handleBack}
          disabled={loading}
        />
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
    flex: 1 / 6,
    padding: 10,
    margin: 20,
    alignItems: 'center',
  },
  inputBox: {
    flex: 1 / 10,
    width: '80%',
    padding: 10,
  },
});