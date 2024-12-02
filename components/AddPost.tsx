import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import * as Progress from 'react-native-progress';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Post from '@/services/community/Post';
import { router } from 'expo-router';
import AddPostFood from './AddPostFood';
import { useEffect, useState } from 'react';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import AddShownFood from './AddShownFood';
import Modal from "react-native-modal";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
  name: string;
  exercises: Exercise[];
  timestamp: Date;
}

const AddPost = ({ post, updateCommentVisible, updateCurrentPostComment }: { post: Post, updateCommentVisible: () => void, updateCurrentPostComment: (id: string) => void }) => {
  const [like, setLike] = useState(false);

  const likePost = async (liked: boolean) => {
    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('liked_posts')
        .doc(post.id)
        .set({
          liked: liked
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLike(post.liked);
  }, []);


  return (
    <View style={styles.container}>
      <View style={{}}>
        <Image
          source={require("../assets/images/pngwing.com.png")}
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            marginLeft: 5,
            marginTop: 15,
          }}
        />
      </View>

      <View style={{ marginHorizontal: 10 }}>
        <View style={styles.userbar}>
          <Text style={{ fontSize: 18 }}>{post.username}</Text>
          <View
            style={{
              width: 120,
              backgroundColor: "transparent",
              alignItems: "flex-end",
            }}
          >
            <Text style={{ fontWeight: 200 }}>
              {new Date(post.date).toDateString()}
            </Text>
          </View>
        </View>
        <Text
          style={{
            width: 250,
            backgroundColor: "transparent",
            maxHeight: 500,
          }}
        >
          {post.content}
        </Text>
        {/* Cutome Food item showing part */}
        <View>
          <View
            style={{
              backgroundColor: "transparent",
              alignSelf: "flex-start",
            }}
          >
            {post.foodItems
              ? post.foodItems.map((foodItem) => (
                <AddPostFood foodItems={post.foodItems} />
              ))
              : null}
          </View>
        </View>

        {/* Template showing part */}
        <View>
          <View
            style={{
              backgroundColor: "transparent",
              alignSelf: "flex-start",
            }}
          >
            {post.templates && post.templates.length > 0 ? (
              post.templates.map((template: Template, index: number) => (
                <View key={index} style={styles.templateContainer}>
                  <View style={styles.templateHeader}>
                    <View style={styles.templateTitleContainer}>
                      <MaterialIcons name="fitness-center" size={24} color="#7743CE" />
                      <Text style={styles.templateTitle}>{template.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={async () => {
                        try {
                          const user = auth().currentUser;
                          if (!user) {
                            Alert.alert('Error', 'You must be logged in');
                            return;
                          }

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
                      }}
                    >
                      <MaterialIcons name="save-alt" size={24} color="#7743CE" />
                    </TouchableOpacity>
                  </View>
                  {template.exercises.map((exercise: Exercise, exerciseIndex: number) => (
                    <View key={exerciseIndex} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                      </Text>
                    </View>
                  ))}
                </View>
              ))
            ) : null}
          </View>
        </View>

        <View style={styles.functionbar}>
          <TouchableOpacity onPress={async (e) => {
            const newLikeStatus = !like;
            setLike(newLikeStatus);
            await likePost(newLikeStatus);
          }}>
            <AntDesign
              name="hearto"
              size={24}
              color={like ? "red" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.functionbutton}
            // onPress={() => router.navigate("/comment_page")}
            onPress={() => {
              updateCommentVisible();
              updateCurrentPostComment(post.id);
              console.log(post.id)
            }}
          >
            <FontAwesome5 name="comment" size={24} color="black" />
          </TouchableOpacity>
          {/* <Modal isVisible={true}>
              <View style={{ flex: 1 }}>
                <Text>I am the modal content!</Text>
              </View>
            </Modal> */}

        </View>
        <Text style={{ fontWeight: 200 }}>{0} likes</Text>
      </View>
    </View>
  );
};

export default AddPost


const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    maxHeight: 700,
    width: 350,
    backgroundColor: '#FEF3E2',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 5
  },
  userbar: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    width: 270,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  functionbar: {
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    marginVertical: 3,
    justifyContent: 'flex-start',
  },
  functionbutton: {
    marginHorizontal: 15,
  },
  fooditem: {
    marginVertical: 10, // Adds spacing around the entire container
    flexDirection: "column",
  },
  templateContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    width: 270,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#7743CE',
  },
  exerciseItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    marginVertical: 3,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  templateTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#F0E6FF',
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
})

