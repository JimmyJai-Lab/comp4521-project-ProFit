import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert } from 'react-native';

interface Exercise {
    id: string;
    exerciseId: number;
    name: string;
    weight: number;
    sets: number;
    reps: number;
    date: string;
    completedSets: number;
}

interface Template {
    id: string;
    name: string;
    exercises: Exercise[];
    timestamp: Date;
}

interface TemplateCardProps {
    template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
    const saveTemplate = async () => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const templateData = {
                name: template.name,
                exercises: template.exercises,
                timestamp: new Date()
            };

            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('exercise_templates')
                .add(templateData);

            Alert.alert('Success', 'Template saved to your collection!');
        } catch (error) {
            console.error('Error saving template:', error);
            Alert.alert('Error', 'Failed to save template');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{template.name}</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveTemplate}
                >
                    <MaterialIcons name="save-alt" size={24} color="#7743CE" />
                    <Text style={styles.saveButtonText}>Save Template</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.exerciseList}>
                {template.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseDetails}>
                            {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        padding: 15,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7743CE',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0E6FF',
        padding: 8,
        borderRadius: 20,
    },
    saveButtonText: {
        color: '#7743CE',
        fontWeight: '600',
        marginLeft: 4,
    },
    exerciseList: {
        marginTop: 8,
    },
    exerciseItem: {
        marginBottom: 8,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    exerciseDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
}); 