import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Button from '@/components/Button';
import accountService from '@/services/auth/AccountService';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect } from 'react';
import { router } from 'expo-router';

// export const [email, setEmail] = React.useState('');
// export const [password, setPassword] = React.useState('');

export default function Index() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      // User is signed in, navigate to fitness screen
      router.push("/fitness");
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await accountService.logInUser(email.trim(), password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    setEmail("");
    setPassword("");
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topPadding} />
      <MaskedView
        style={{ flex: 0.4, flexDirection: "row", height: "100%" }}
        maskElement={
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 50,
                color: "black",
                fontWeight: "bold",
              }}
            >
              ProFit
            </Text>
          </View>
        }
      >
        {/* Shows behind the mask, you can put anything here, such as an image */}
        <LinearGradient
          colors={["#E0B0FF", "#702963"]}
          start={{ x: 0, y: 0.33 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
      <Text style={styles.text}>Login</Text>
      <View style={styles.inputBox}>
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          left={<TextInput.Icon icon="email" />}
          style={{ backgroundColor: 'white' }}
          outlineColor="#702963"
          activeOutlineColor="#702963"
          autoCapitalize="none"
          autoCorrect={false}
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
              onPress={() => setShowPassword(!showPassword)}
              forceTextInputFocus={false}
            />
          }
          style={{ backgroundColor: 'white' }}
          outlineColor="#702963"
          activeOutlineColor="#702963"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="primary"
          label="Login"
          onPress={handleLogin}
          disabled={loading}
        />
        <View style={{ height: 10 }} />
        <Button
          theme="secondary"
          label="Sign Up"
          onPress={handleSignUp}
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
  },
  topPadding: {
    height: 40,
    backgroundColor: '#FFFFFF',
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
