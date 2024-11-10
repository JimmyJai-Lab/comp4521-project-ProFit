import { StyleSheet, View, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

type Props = {
  label: string;
  theme?: 'primary';
};

export default function Button({ label, theme }: Props) {
    if(theme === 'primary'){
        return (
            <View style={[styles.buttonContainer,
                { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },]}>
              <Pressable style={[styles.button, , { backgroundColor: '#fff' }]} onPress={() => router.navigate("/fitness")}>
                  <MaterialIcons name="login" size={24} color="black" paddingRight={20} />
                  <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
              </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
            <Text style={styles.buttonLabel}>{label}</Text>
          </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});