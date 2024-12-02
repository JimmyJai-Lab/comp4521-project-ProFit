import { Text, View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import * as React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { FlashList } from "@shopify/flash-list";
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Easing } from 'react-native';
import Animated, { withSpring } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

// Updated interface to match Firebase data structure
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

export default function FitnessScreen() {
  // State for statistics
  const [targetSets, setTargetSets] = React.useState<number>(20);
  const [currentSets, setCurrentSets] = React.useState<number>(0);
  const [volume, setVolume] = React.useState<number>(0);

  // State for exercises
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  // Add this new effect
  useFocusEffect(
    React.useCallback(() => {
      // Refresh exercises when screen comes into focus
      fetchExercises(selectedDate);
    }, [selectedDate])
  );

  // Function to calculate total sets and volume
  const calculateStats = (exerciseData: Exercise[]) => {
    // Calculate total sets (sum of all sets from exercises)
    const totalSets = exerciseData.reduce((acc, curr) => acc + curr.sets, 0);
    // Calculate completed sets
    const completedSets = exerciseData.reduce((acc, curr) => acc + (curr.completedSets || 0), 0);
    // Calculate volume based on completed sets, ensuring all values are numbers
    const totalVolume = exerciseData.reduce((acc, curr) =>
      acc + ((curr.completedSets || 0) * (curr.reps || 0) * (curr.weight || 0)), 0);

    setTargetSets(totalSets);
    setCurrentSets(completedSets);
    setVolume(Math.round(totalVolume)); // Round to whole numbers for cleaner display
  };

  // Function to handle set completion
  const handleSetCompletion = async (exerciseId: string, currentCompletedSets: number, totalSets: number) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const newCompletedSets = currentCompletedSets < totalSets ? currentCompletedSets + 1 : 0;

      // Update Firebase
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .doc(exerciseId)
        .update({
          completedSets: newCompletedSets
        });

      // Update local state
      const updatedExercises = exercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, completedSets: newCompletedSets }
          : exercise
      );

      setExercises(updatedExercises);
      calculateStats(updatedExercises);
    } catch (error) {
      console.error('Error updating exercise completion:', error);
    }
  };

  // Function to fetch exercises for selected date
  const fetchExercises = async (date: Date) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const dateString = date.toISOString().split('T')[0];

      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .where('date', '==', dateString)
        .get();

      const exerciseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Exercise[];

      setExercises(exerciseData);
      calculateStats(exerciseData);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  React.useEffect(() => {
    fetchExercises(selectedDate);
  }, [selectedDate]);

  // Add this function inside FitnessScreen component
  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      // Delete from Firebase
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .doc(exerciseId)
        .delete();

      // Update local state
      const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
      setExercises(updatedExercises);
      calculateStats(updatedExercises);

    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <View style={styles.mealcontainer}>
      <View style={{ flex: 1 }}>
        <Text style={{ marginLeft: 15, fontWeight: 'bold', fontSize: 15, color: '#1c438b' }}>
          {item.name}
        </Text>
        <Text style={{ marginLeft: 15, fontWeight: '300', color: 'black' }}>
          Completed: {item.completedSets} / {item.sets} sets × {item.reps} reps
        </Text>
        <Text style={{ marginLeft: 15, fontWeight: '300', color: 'black' }}>
          Weight: {item.weight} kg
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(item.completedSets / item.sets) * 100}%` }
            ]}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[
            styles.checkButton,
            { backgroundColor: item.completedSets === item.sets ? '#4CAF50' : '#75E6DA' }
          ]}
          onPress={() => handleSetCompletion(item.id, item.completedSets || 0, item.sets)}
        >
          <Text style={styles.checkButtonText}>
            {item.completedSets === item.sets ? 'Reset' : 'Complete Set'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => handleDeleteExercise(item.id)}
        >
          <FontAwesome5 name="trash" size={16} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 30 }}
          daySelectionAnimation={{
            type: "border",
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: "white",
          }}
          style={{ height: 80, paddingTop: 5, paddingBottom: 5 }}
          calendarHeaderStyle={{ color: "white", fontSize: 15 }}
          calendarColor={"#7743CE"}
          dateNumberStyle={{ color: "white", fontSize: 10 }}
          dateNameStyle={{ color: "white", fontSize: 10 }}
          highlightDateNumberStyle={{ color: "yellow", fontSize: 10 }}
          highlightDateNameStyle={{ color: "yellow", fontSize: 10 }}
          disabledDateNameStyle={{ color: "grey", fontSize: 10 }}
          disabledDateNumberStyle={{ color: "grey", fontSize: 10 }}
          iconContainer={{ flex: 0.1, fontSize: 10 }}
          selectedDate={new Date()}
          onDateSelected={(date) => {
            setSelectedDate(date.toDate());
          }}
        />

        <ScrollView>
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={200}
              width={15}
              fill={(currentSets / targetSets) * 100 || 0}
              tintColor="#7743CE"
              backgroundColor="#E7DDFF"
              duration={1000}
              easing={Easing.out(Easing.ease)}
              rotation={0}
              lineCap="round"
            >
              {(fill) => (
                <View style={{ alignItems: 'center' }}>
                  <Animated.Text
                    style={{
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}
                  >
                    {currentSets}
                  </Animated.Text>
                  <Text style={{ fontSize: 16 }}>of {targetSets} sets</Text>
                </View>
              )}
            </AnimatedCircularProgress>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Volume</Text>
                <Text style={styles.statValue}>{volume} kg</Text>
              </View>
            </View>
          </View>

          <View style={styles.exercisesHeader}>
            <Text style={styles.heading}>Today's Exercises</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.navigate('/addexercise_api')}>
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.exerciseList}>
            {exercises.map((exercise, index) => (
              <View key={index}>
                {renderExerciseItem({ item: exercise })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7743CE',
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#75E6DA',
    borderRadius: 20,
    padding: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  exerciseList: {
    padding: 10,
  },
  mealcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  rightcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c438b',
    borderRadius: 20,
    padding: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7743CE',
    borderRadius: 2,
  },
  checkButton: {
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  checkButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  deleteButton: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    shadowColor: '#FF0000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    transform: [{ scale: 0.9 }],
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#7743CE', // Same as calendarColor
  },
});