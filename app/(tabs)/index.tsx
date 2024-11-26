import * as React from 'react';
import { Text, View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Button from '@/components/Button';
import { signUpUser, loginUser, logoutUser } from '@/utils/auth';
import { useRouter } from 'expo-router';


// export const [email, setEmail] = React.useState('');
// export const [password, setPassword] = React.useState('');

export default function Index() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const validateInput = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    // Basic password validation (at least 6 characters)
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;

    try {
      const user = await loginUser(email, password);
      Alert.alert('Login Successful', `Welcome, ${user.email}`);
      // Only navigate after successful login
      router.push("/fitness");
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  // Handle Sign-Up
  const handleSignUp = async () => {
    if (!validateInput()) return;

    try {
      const user = await signUpUser(email, password);
      Alert.alert('Sign-Up Successful', `Welcome, ${user.email}`);
      // Only navigate after successful signup
      router.push("/fitness");
    } catch (error: any) {
      Alert.alert('Sign-Up Error', error.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Logout Successful', 'You have been logged out.');
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login functionality to be implemented');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login functionality to be implemented');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <MaskedView
          style={{ flex: 0.2, flexDirection: 'row', height: '100%' }}
          maskElement={
            <View
              style={{
                // Transparent background because mask is based off alpha channel.
                backgroundColor: 'transparent',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 50,
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                ProFit
              </Text>
            </View>
          }
        >
          {/* Shows behind the mask, you can put anything here, such as an image */}
          <LinearGradient
            colors={['#E0B0FF', '#702963']}
            start={{ x: 0, y: 0.33 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
        <Text style={styles.text}>Login</Text>
        <View style={styles.inputBox}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            left={<TextInput.Icon icon="email" />}
            mode="outlined"
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon icon="eye" />}
            mode="outlined"
          />
        </View>
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Login" onPress={handleLogin} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.25 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'grey' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'grey' }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.1 }}>
          <View>
            <Button theme="google" label="Login using Google" onPress={handleGoogleLogin} />
          </View>
          <View>
            <Button theme="facebook" label="Login using Facebook" onPress={handleFacebookLogin} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.1, padding: 40 }}>
          <Button theme="primary" label="Sign up" onPress={handleSignUp} />
        </View>

      </View>
    </TouchableWithoutFeedback>
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
    margin: 50,
  },
  inputBox: {
    flex: 1 / 10,
    width: '80%',
    padding: 10,
  },
});