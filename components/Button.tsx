import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  theme: 'primary' | 'secondary' | 'google' | 'facebook' | 'signup' | 'register';
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Button({ theme, label, onPress, disabled }: Props) {
  const buttonStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    google: styles.googleButton,
    facebook: styles.facebookButton,
    signup: styles.signupButton,
    register: styles.registerButton,
  };

  const textStyles = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    google: styles.socialText,
    facebook: styles.socialText,
    signup: styles.signupText,
    register: styles.registerText,
  };

  return (
    <TouchableOpacity
      style={[buttonStyles[theme], disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyles[theme]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#702963',
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#E0B0FF',
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 10,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
    margin: 5,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
    padding: 10,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
    margin: 5,
  },
  signupButton: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#702963',
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  socialText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  signupText: {
    color: '#000000',
    textDecorationLine: 'underline',
  },
  registerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});