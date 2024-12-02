import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AddExercise from '@/components/AddExercise';
import { SearchBar } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { wgerExerciseService, Exercise } from '@/services/exercise/WgerExerciseService';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function ExerciseAPI() {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    fetchPreviousExercises();
  }, []);

  const fetchPreviousExercises = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .orderBy('timestamp', 'desc')
        .get();

      const uniqueExercises = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!uniqueExercises.has(data.exerciseId)) {
          uniqueExercises.set(data.exerciseId, {
            id: data.exerciseId,
            name: data.name,
            description: '',
            category: 0,
            muscles: [],
            equipment: []
          });
        }
      });

      setPreviousExercises(Array.from(uniqueExercises.values()));
    } catch (error) {
      console.error('Error fetching previous exercises:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        searchExercises();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const searchExercises = async () => {
    setLoading(true);
    try {
      const results = await wgerExerciseService.searchExercises(search);
      setExercises(results);
    } catch (error) {
      console.error('Error searching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (text: string) => {
    setSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search exercises..."
          onChangeText={updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInput}
          inputStyle={styles.searchBarText}
        />
      </View>

      {!search && !loading && (
        <View style={styles.previousExercisesContainer}>
          <Text style={styles.sectionTitle}>Previously Added Exercises</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {previousExercises.map((exercise) => (
              <AddExercise
                key={`previous-${exercise.id}`}
                item={{
                  id: exercise.id,
                  name: exercise.name,
                  description: exercise.description,
                  weight: 0,
                  set: 4,
                  rep: 10,
                  checked: false
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#7743CE" style={styles.loader} />
      ) : (
        search && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {exercises.map((exercise) => (
              <AddExercise
                key={exercise.id}
                item={{
                  id: exercise.id,
                  name: exercise.name,
                  description: exercise.description,
                  weight: 0,
                  set: 4,
                  rep: 10,
                  checked: false
                }}
              />
            ))}
          </ScrollView>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#7743CE',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchBarInput: {
    backgroundColor: 'white',
    height: 40,
    borderRadius: 25,
  },
  searchBarText: {
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  previousExercisesContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7743CE',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});