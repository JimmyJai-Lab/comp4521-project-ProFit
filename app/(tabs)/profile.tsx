import { Text, View, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Button, DataTable, List } from 'react-native-paper';
import { ListItem, Icon } from '@rneui/themed';
import accountService from '@/services/auth/AccountService';
import auth from '@react-native-firebase/auth';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { BarChart, LineChart } from 'react-native-chart-kit';

interface UserData {
  username: string;
  age: number;
  height: number;
  weight: number;
}

interface WorkoutData {
  date: string;
  volume: number;
}

interface DietData {
  date: string;
  calories: number;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editData, setEditData] = useState<UserData | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [dietData, setDietData] = useState<DietData[]>([]);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (userDoc.exists) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchWorkoutHistory = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('exercises')
        .where('date', '>=', threeMonthsAgo.toISOString().split('T')[0])
        .get();

      const workouts = snapshot.docs.map(doc => ({
        date: doc.data().date,
        volume: (doc.data().completedSets || 0) * (doc.data().reps || 0) * (doc.data().weight || 0)
      }));

      const groupedData = workouts.reduce((acc, curr) => {
        const existingDate = acc.find(item => item.date === curr.date);
        if (existingDate) {
          existingDate.volume += curr.volume;
        } else {
          acc.push({ date: curr.date, volume: curr.volume });
        }
        return acc;
      }, [] as WorkoutData[]);

      groupedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setWorkoutData(groupedData);
    } catch (error) {
      console.error('Error fetching workout history:', error);
    }
  };

  const fetchDietHistory = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('food_logs')
        .where('date', '>=', threeMonthsAgo)
        .get();

      const meals = snapshot.docs.map(doc => ({
        date: new Date(doc.data().date.seconds * 1000).toISOString().split('T')[0],
        calories: doc.data().calories * (doc.data().amount || 1)
      }));

      const groupedData = meals.reduce((acc, curr) => {
        const existingDate = acc.find(item => item.date === curr.date);
        if (existingDate) {
          existingDate.calories += curr.calories;
        } else {
          acc.push({ date: curr.date, calories: curr.calories });
        }
        return acc;
      }, [] as DietData[]);

      groupedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setDietData(groupedData);
    } catch (error) {
      console.error('Error fetching diet history:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchWorkoutHistory();
    fetchDietHistory();
  }, []);

  const handleLogout = async () => {
    try {
      await accountService.logOutUser();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  }

  const handleEditPress = () => {
    setEditData(userData);
    setIsEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      const user = auth().currentUser;
      if (!user || !editData) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          age: editData.age,
          height: editData.height,
          weight: editData.weight,
        });

      setUserData(editData);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={80}
              source={require('../../assets/images/pngwing.com.png')}
              style={styles.avatar}
            />
            <Text style={styles.username}>
              {userData?.username || 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.age || '-'}</Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.height || '-'}</Text>
            <Text style={styles.statLabel}>Height (cm)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.weight || '-'}</Text>
            <Text style={styles.statLabel}>Weight (kg)</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <View style={styles.progressSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Workout Progress</Text>
              <List.Icon icon="chart-box-outline" color="#7743CE" />
            </View>
            {workoutData.length > 0 && (
              <View style={styles.chartContainer}>
                <BarChart
                  data={{
                    labels: workoutData.slice(-7).map(d => d.date.slice(5)),
                    datasets: [{
                      data: workoutData.slice(-7).map(d => d.volume)
                    }]
                  }}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(119, 67, 206, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
              </View>
            )}
          </View>
          <View style={styles.progressSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Diet Record</Text>
              <List.Icon icon="food-apple" color="#7743CE" />
            </View>
            {dietData.length > 0 && (
              <View style={styles.chartContainer}>
                <LineChart
                  data={{
                    labels: dietData.slice(-7).map(d => d.date.slice(5)),
                    datasets: [{
                      data: dietData.slice(-7).map(d => d.calories)
                    }]
                  }}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=" cal"
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(119, 67, 206, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#7743CE"
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
              </View>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Age"
              value={editData?.age?.toString()}
              onChangeText={(text) => setEditData(prev =>
                prev ? { ...prev, age: parseInt(text) || 0 } : null
              )}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Height (cm)"
              value={editData?.height?.toString()}
              onChangeText={(text) => setEditData(prev =>
                prev ? { ...prev, height: parseInt(text) || 0 } : null
              )}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Weight (kg)"
              value={editData?.weight?.toString()}
              onChangeText={(text) => setEditData(prev =>
                prev ? { ...prev, weight: parseInt(text) || 0 } : null
              )}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#7743CE',
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7743CE',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingHorizontal: 15,
    flex: 1,
  },
  menuItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 30,
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#7743CE',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chartContainer: {
    padding: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  progressSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});