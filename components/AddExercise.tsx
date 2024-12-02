import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { TextInput } from "react-native-paper";
import * as React from 'react';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { router } from 'expo-router';

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

            // Create exercise record with completedSets initialized to 0
            const exerciseData = {
                exerciseId: item.id,
                name: item.name,
                reps: parseInt(rep),
                sets: parseInt(set),
                weight: parseFloat(weight),
                date: currentDate,
                timestamp: new Date(),
                completedSets: 0
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

            Alert.alert('Success', 'Exercise added successfully', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate back to fitness screen
                        router.back();
                    }
                }
            ]);
        } catch (error) {
            console.error('Error adding exercise:', error);
            Alert.alert('Error', 'Failed to add exercise');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                    <TextInput
                        mode='outlined'
                        label="Reps"
                        value={rep}
                        onChangeText={setRep}
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#7743CE"
                        activeOutlineColor="#7743CE"
                    />
                    <TextInput
                        mode='outlined'
                        label="Sets"
                        value={set}
                        onChangeText={setSet}
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#7743CE"
                        activeOutlineColor="#7743CE"
                    />
                    <TextInput
                        mode='outlined'
                        label="Weight"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#7743CE"
                        activeOutlineColor="#7743CE"
                    />
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddExercise}
                >
                    <Text style={styles.addButtonText}>Add Exercise</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddExercise;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        margin: 8,
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    exerciseInfo: {
        marginBottom: 8,
    },
    exerciseName: {
        fontSize: 16,
        color: '#7743CE',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    description: {
        color: '#666',
        fontSize: 12,
        marginBottom: 4,
    },
    inputContainer: {
        gap: 8,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 6,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        fontSize: 12,
        height: 45,
    },
    addButton: {
        backgroundColor: '#7743CE',
        borderRadius: 20,
        padding: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

