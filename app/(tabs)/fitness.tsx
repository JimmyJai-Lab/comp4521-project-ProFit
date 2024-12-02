import { Text, View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
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
import { useState } from 'react';

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

// Add these new interfaces after the Exercise interface
interface Template {
  id: string;
  name: string;
  exercises: Exercise[];
  timestamp: Date;
}

export default function FitnessScreen() {
  // State for statistics
  const [targetSets, setTargetSets] = React.useState<number>(20);
  const [currentSets, setCurrentSets] = React.useState<number>(0);
  const [volume, setVolume] = React.useState<number>(0);

  // State for exercises
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  // Add new state for template modal
  const [isTemplateModalVisible, setTemplateModalVisible] = React.useState(false);
  const [isSaveModalVisible, setSaveModalVisible] = React.useState(false);
  const [templateName, setTemplateName] = React.useState('');
  const [templates, setTemplates] = React.useState<Template[]>([]);

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

  // Add new functions for template handling
  const saveAsTemplate = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      if (!templateName.trim()) {
        Alert.alert('Error', 'Please enter a template name');
        return;
      }

      const templateData = {
        name: templateName,
        exercises: exercises.map(({ id, ...rest }) => rest), // Exclude the document id
        timestamp: new Date()
      };

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercise_templates')
        .add(templateData);

      setSaveModalVisible(false);
      setTemplateName('');
      Alert.alert('Success', 'Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template');
    }
  };

  const loadTemplates = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercise_templates')
        .orderBy('timestamp', 'desc')
        .get();

      const templateData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Template[];

      setTemplates(templateData);
      setTemplateModalVisible(true);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load templates');
    }
  };

  const applyTemplate = async (template: Template) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      // Delete existing exercises for the day
      const batch = firestore().batch();
      const existingExercises = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .where('date', '==', selectedDate.toISOString().split('T')[0])
        .get();

      existingExercises.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Add new exercises from template
      template.exercises.forEach(exercise => {
        const newExerciseRef = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('exercises')
          .doc();

        batch.set(newExerciseRef, {
          ...exercise,
          date: selectedDate.toISOString().split('T')[0],
          timestamp: new Date(),
          completedSets: 0
        });
      });

      await batch.commit();
      setTemplateModalVisible(false);
      fetchExercises(selectedDate);
      Alert.alert('Success', 'Template applied successfully');
    } catch (error) {
      console.error('Error applying template:', error);
      Alert.alert('Error', 'Failed to apply template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercise_templates')
        .doc(templateId)
        .delete();

      // Update local state
      const updatedTemplates = templates.filter(template => template.id !== templateId);
      setTemplates(updatedTemplates);
    } catch (error) {
      console.error('Error deleting template:', error);
      Alert.alert('Error', 'Failed to delete template');
    }
  };

  const [isTemplateDetailsVisible, setTemplateDetailsVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleTemplateLongPress = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateDetailsVisible(true);
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      onLongPress={() => {
        setEditingCurrentExercise(item);
        setExerciseEditModalVisible(true);
      }}
      delayLongPress={500}
    >
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
    </TouchableOpacity>
  );

  // Add new state for editing
  const [editingExercise, setEditingExercise] = useState<{ index: number, exercise: Exercise } | null>(null);

  // Add this function to handle exercise updates
  const handleUpdateTemplateExercise = async (index: number, updatedExercise: Exercise) => {
    if (!selectedTemplate) return;

    const updatedExercises = [...selectedTemplate.exercises];
    updatedExercises[index] = updatedExercise;

    setSelectedTemplate({
      ...selectedTemplate,
      exercises: updatedExercises
    });
  };

  // Add this function to save template changes
  const saveTemplateChanges = async () => {
    try {
      const user = auth().currentUser;
      if (!user || !selectedTemplate) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercise_templates')
        .doc(selectedTemplate.id)
        .update({
          exercises: selectedTemplate.exercises
        });

      setTemplateDetailsVisible(false);
      Alert.alert('Success', 'Template updated successfully');
    } catch (error) {
      console.error('Error updating template:', error);
      Alert.alert('Error', 'Failed to update template');
    }
  };

  const [isExerciseEditModalVisible, setExerciseEditModalVisible] = useState(false);
  const [editingCurrentExercise, setEditingCurrentExercise] = useState<Exercise | null>(null);

  const handleUpdateExercise = async () => {
    try {
      if (!editingCurrentExercise) return;

      const user = auth().currentUser;
      if (!user) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .doc(editingCurrentExercise.id)
        .update({
          sets: editingCurrentExercise.sets,
          reps: editingCurrentExercise.reps,
          weight: editingCurrentExercise.weight
        });

      setExerciseEditModalVisible(false);
      fetchExercises(selectedDate);
      Alert.alert('Success', 'Exercise updated successfully');
    } catch (error) {
      console.error('Error updating exercise:', error);
      Alert.alert('Error', 'Failed to update exercise');
    }
  };

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
              size={150}
              width={12}
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

          <View style={styles.templateButtonsContainer}>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => setSaveModalVisible(true)}
            >
              <View style={styles.buttonContent}>
                <FontAwesome5 name="save" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.templateButtonText}>Save Template</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={loadTemplates}
            >
              <View style={styles.buttonContent}>
                <FontAwesome5 name="clipboard-list" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.templateButtonText}>Select Template</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Save Template Modal */}
          <Modal
            visible={isSaveModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSaveModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Save as Template</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter template name"
                  value={templateName}
                  onChangeText={setTemplateName}
                  placeholderTextColor="#666"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setSaveModalVisible(false);
                      setTemplateName('');
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={saveAsTemplate}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Select Template Modal */}
          <Modal
            visible={isTemplateModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setTemplateModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Template</Text>
                <ScrollView style={styles.templateList}>
                  {templates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={styles.templateItem}
                      onPress={() => applyTemplate(template)}
                      onLongPress={() => handleTemplateLongPress(template)}
                      delayLongPress={500}
                    >
                      <View style={styles.templateItemContent}>
                        <View style={styles.templateInfo}>
                          <Text style={styles.templateName}>{template.name}</Text>
                          <Text style={styles.templateExerciseCount}>
                            {template.exercises.length} exercises
                          </Text>
                        </View>
                        <View style={styles.templateActions}>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTemplate(template.id)}
                          >
                            <FontAwesome5 name="trash" size={16} color="#FF0000" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setTemplateModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Template Details Modal */}
          <Modal
            visible={isTemplateDetailsVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setTemplateDetailsVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedTemplate?.name}</Text>
                <ScrollView style={styles.templateDetailsList}>
                  {selectedTemplate?.exercises.map((exercise, index) => (
                    <View key={index} style={styles.templateDetailItem}>
                      <Text style={styles.templateDetailName}>{exercise.name}</Text>
                      <View style={styles.editInputsRow}>
                        <View style={styles.editInputContainer}>
                          <Text style={styles.editInputLabel}>Sets</Text>
                          <TextInput
                            style={styles.editInput}
                            value={String(exercise.sets)}
                            onChangeText={(text) => {
                              const updatedExercises = [...selectedTemplate.exercises];
                              updatedExercises[index] = {
                                ...exercise,
                                sets: parseInt(text) || 0
                              };
                              setSelectedTemplate({
                                ...selectedTemplate,
                                exercises: updatedExercises
                              });
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={styles.editInputContainer}>
                          <Text style={styles.editInputLabel}>Reps</Text>
                          <TextInput
                            style={styles.editInput}
                            value={String(exercise.reps)}
                            onChangeText={(text) => {
                              const updatedExercises = [...selectedTemplate.exercises];
                              updatedExercises[index] = {
                                ...exercise,
                                reps: parseInt(text) || 0
                              };
                              setSelectedTemplate({
                                ...selectedTemplate,
                                exercises: updatedExercises
                              });
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={styles.editInputContainer}>
                          <Text style={styles.editInputLabel}>Weight</Text>
                          <TextInput
                            style={styles.editInput}
                            value={String(exercise.weight)}
                            onChangeText={(text) => {
                              const updatedExercises = [...selectedTemplate.exercises];
                              updatedExercises[index] = {
                                ...exercise,
                                weight: parseFloat(text) || 0
                              };
                              setSelectedTemplate({
                                ...selectedTemplate,
                                exercises: updatedExercises
                              });
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setTemplateDetailsVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={saveTemplateChanges}
                  >
                    <Text style={styles.modalButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Exercise Edit Modal */}
          <Modal
            visible={isExerciseEditModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setExerciseEditModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Exercise</Text>
                <Text style={styles.templateDetailName}>{editingCurrentExercise?.name}</Text>
                <View style={[styles.editInputsRow, { marginBottom: 20 }]}>
                  <View style={styles.editInputContainer}>
                    <Text style={styles.editInputLabel}>Sets</Text>
                    <TextInput
                      style={styles.editInput}
                      value={String(editingCurrentExercise?.sets || '')}
                      onChangeText={(text) => {
                        const newSets = parseInt(text) || 0;
                        if (newSets < (editingCurrentExercise?.completedSets || 0)) {
                          Alert.alert(
                            'Invalid Sets',
                            'New sets value cannot be less than completed sets'
                          );
                          return;
                        }
                        setEditingCurrentExercise(prev =>
                          prev ? { ...prev, sets: newSets } : null
                        );
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editInputContainer}>
                    <Text style={styles.editInputLabel}>Reps</Text>
                    <TextInput
                      style={styles.editInput}
                      value={String(editingCurrentExercise?.reps || '')}
                      onChangeText={(text) => setEditingCurrentExercise(prev =>
                        prev ? { ...prev, reps: parseInt(text) || 0 } : null
                      )}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editInputContainer}>
                    <Text style={styles.editInputLabel}>Weight</Text>
                    <TextInput
                      style={styles.editInput}
                      value={String(editingCurrentExercise?.weight || '')}
                      onChangeText={(text) => setEditingCurrentExercise(prev =>
                        prev ? { ...prev, weight: parseFloat(text) || 0 } : null
                      )}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={[styles.modalButtons, { marginTop: 10 }]}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setExerciseEditModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleUpdateExercise}
                  >
                    <Text style={styles.modalButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
  templateButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  templateButton: {
    backgroundColor: '#7743CE',
    borderRadius: 15,
    padding: 12,
    minWidth: 160,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  templateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#7743CE',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#7743CE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#7743CE',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  templateList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  templateItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  templateItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateInfo: {
    flex: 1,
    marginRight: 10,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7743CE',
    marginBottom: 4,
  },
  templateExerciseCount: {
    fontSize: 14,
    color: '#666',
  },
  templateActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateDetailsList: {
    maxHeight: 400,
    marginBottom: 10,
  },
  templateDetailItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  templateDetailName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7743CE',
    marginBottom: 4,
  },
  templateDetailInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  editExerciseContainer: {
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
  },
  editInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  editInputContainer: {
    flex: 1,
  },
  editInputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  editInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#7743CE',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});