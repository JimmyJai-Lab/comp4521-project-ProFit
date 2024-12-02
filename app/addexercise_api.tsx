import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AddExercise from '@/components/AddExercise';
import { SearchBar } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { wgerExerciseService, Exercise } from '@/services/exercise/WgerExerciseService';

export default function ExerciseAPI() {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

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
      <SearchBar
        placeholder="Search for Exercises Here ..."
        onChangeText={updateSearch}
        value={search}
        lightTheme={true}
        inputContainerStyle={{ height: 10, backgroundColor: '#d1d0d0' }}
        containerStyle={{ minHeight: 0, height: 47 }}
        inputStyle={{
          minHeight: 0,
          fontSize: 10
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#75E6DA" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView>
          {exercises.map((exercise) => (
            <AddExercise
              key={exercise.id}
              item={{
                id: exercise.id,
                name: exercise.name,
                weight: 0,
                set: 4,
                rep: 10,
                description: exercise.description,
                checked: false
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
});