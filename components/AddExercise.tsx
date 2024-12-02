import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { TextInput } from "react-native-paper";
import * as React from 'react';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const AddExercise = ({ item }: { item: any }) => {
    // State for input values
    const [rep, setRep] = React.useState('');
    const [set, setSet] = React.useState('');
    const [weight, setWeight] = React.useState('');

    // Function to handle adding exercise to Firebase
    const handleAddExercise = async () => {
        // Validate inputs
        if (!rep || !set || !weight) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            // Get current user
            const user = auth().currentUser;
            if (!user) {
                Alert.alert('Error', 'You must be logged in');
                return;
            }

            // Get current date
            const currentDate = new Date().toISOString().split('T')[0];

            // Create exercise record
            const exerciseData = {
                exerciseId: item.id,
                name: item.name,
                reps: parseInt(rep),
                sets: parseInt(set),
                weight: parseFloat(weight),
                date: currentDate,
                timestamp: new Date(),
            };

            // Store exercise under user's document
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('exercises')
                .add(exerciseData);

            // Reset input fields after successful add
            setRep('');
            setSet('');
            setWeight('');

            Alert.alert('Success', 'Exercise added successfully');
        } catch (error) {
            console.error('Error adding exercise:', error);
            Alert.alert('Error', 'Failed to add exercise');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ width: 120, backgroundColor: 'transparent', height: 100 }}>
                <Text style={{ fontSize: 20, color: '#1c438b', fontWeight: 'bold', paddingTop: 10 }}>{item.name}</Text>
            </View>

            <View style={{ backgroundColor: 'transparent', width: 180, marginLeft: 5 }}>
                <View style={{ alignSelf: 'center', flexDirection: 'row', width: 180 }}>
                    <TextInput
                        mode='outlined'
                        label="Rep"
                        value={rep}
                        onChangeText={setRep}
                        keyboardType="numeric"
                        style={{ flex: 1 }}
                    />
                    <TextInput
                        mode='outlined'
                        label="Set"
                        value={set}
                        onChangeText={setSet}
                        keyboardType="numeric"
                        style={{ flex: 1 }}
                    />
                    <TextInput
                        mode='outlined'
                        label="Kg"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        style={{ flex: 1 }}
                    />
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: '#75E6DA', borderRadius: 20, height: 40, width: 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                    onPress={handleAddExercise}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', padding: 4 }}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddExercise;

const styles = StyleSheet.create({
    container: {
        height: 120,
        width: 360,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center'
    },
});

