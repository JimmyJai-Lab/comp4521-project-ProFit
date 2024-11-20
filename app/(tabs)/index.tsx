import * as React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import {LinearGradient} from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Button from '@/components/Button';

// export const [email, setEmail] = React.useState('');
// export const [password, setPassword] = React.useState('');

export default function Index() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  return (
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
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.25}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
          <View>
            <Text style={{width: 50, textAlign: 'center'}}>Or</Text>
          </View>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.1}}>
        <View>
          <Button  label="Login using Google"/>
        </View>
        <View>
          <Button  label="Login using Facebook"/>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.1, padding: 40}}>
        <Button theme="primary" label="Sign up"/>
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
    margin:50,
  },
  inputBox: {
    flex: 1 / 10,
    width: '80%',
    padding: 10,
  },
});