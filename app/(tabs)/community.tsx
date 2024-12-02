import { Text, View, StyleSheet, Button, TouchableOpacity, Image, TextInput, ScrollView, RefreshControl, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AddPost from '@/components/AddPost';
import { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Post from '@/services/community/Post';
import { router } from 'expo-router';
import AddShownFood from '@/components/AddShownFood';
import FoodItem from '@/services/food/FoodItem';
import Modal from 'react-native-modal';

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

export default function CommunityScreen() {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [foodItems, setFoodItems] = useState<Array<FoodItem>>();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [currentPostComment, setCurrentPostComment] = useState('');
  const [filterLikedPosts, setFilterLikedPosts] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [foodModalVisible, setFoodModalVisible] = useState(false);
  const [recentFoods, setRecentFoods] = useState<Array<FoodItem>>([]);

  const updatePostText = (text: string) => {
    setPostText(text);
  };

  const sendPost = async () => {
    try {
      // First fetch the username from Firestore
      const userDoc = await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .get();

      const username = userDoc.data()?.username;

      if (!username) {
        Alert.alert('Error', 'Could not find username');
        return;
      }

      // Create the post with the fetched username
      await firestore()
        .collection('community_posts')
        .add({
          content: postText,
          foodItems: foodItems,
          date: new Date(),
          uid: auth().currentUser?.uid,
          username: username,  // Use the fetched username
          likes: 0,
          comments: []
        });

      // Clear the post text
      setPostText('');

      // Clear current community post collection
      const snapshot = await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('current_community_post')
        .get();

      snapshot.docs.forEach(doc => {
        doc.ref.delete();
      });

      setFoodItems([]);
    } catch (error) {
      console.error('Failed to add post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const updatePosts = async () => {
    console.log("Updating posts");

    var userLikedPosts: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
    try {
      userLikedPosts = await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('liked_posts')
        .get();
    } catch (error) {
      console.error('Error fetching liked posts: ', error);
    }



    var data;
    try {
      const snapshot = await firestore()
        .collection('community_posts')
        .orderBy('date', 'desc')
        .get();

      data = snapshot.docs.map(doc => {
        const docId = doc.id;
        data = doc.data();
        data.id = docId;
        data.date = data.date.toDate();
        data.liked = userLikedPosts?.docs.some(likedPost => likedPost.id === docId && likedPost.data().liked);;
        return data;
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }


    setPosts(data as Array<Post>);

  }

  const updatePostFood = () => {
    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('current_community_post')
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        if (data.length > 0) {
          setFoodItems(data as Array<FoodItem>);
        }
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPosts([]);
    updatePosts().then(() => setRefreshing(false));
  }

  const updateCommentVisible = () => {
    setIsCommentVisible(!isCommentVisible);
  };

  const updateCurrentPostComment = (id: string) => {
    setCurrentPostComment(id);
  };

  const sendComment = async (comment: string) => {
    const postRef = firestore().collection('community_posts').doc(currentPostComment);

    await postRef.update({
      comments: firestore.FieldValue.arrayUnion(comment)
    });

    Alert.alert('Comment added!');

    updateCommentVisible();
  }

  const fetchTemplates = async () => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('exercise_templates')
        .orderBy('timestamp', 'desc')
        .get();

      const templatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Template[];

      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchRecentFoods = async () => {
    try {
      console.log("Fetching custom foods...");
      const snapshot = await firestore()
        .collection("users")
        .doc(auth().currentUser?.uid)
        .collection("custom_foods")
        .get();

      if (snapshot.empty) {
        console.log("No custom foods found");
        setRecentFoods([]);
        return;
      }

      const foods = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Food data:", data);
        return {
          name: data.name,
          calories: data.calories,
          macros: {
            carbs: data.macros.carbs,
            protein: data.macros.protein,
            fat: data.macros.fat
          },
          servingSize: data.servingSize,
          servingSizeUnit: data.servingSizeUnit,
          source: 'custom'
        } as FoodItem;
      });

      console.log("Processed foods:", foods);
      setRecentFoods(foods);
    } catch (error) {
      console.error('Error fetching custom foods:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('community_posts')
      .onSnapshot(() => {
        // updatePosts();
      });

    return () => unsubscribe();
  });

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('current_community_post')
      .onSnapshot(() => {
        updatePostFood();
      });

    return () => unsubscribe();
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    fetchRecentFoods();
  }, []);

  return (
    <View>
      {/* User Post */}
      <View style={styles.userPostContainer}>
        <View style={styles.userHeader}>
          <Image
            source={require("../../assets/images/pngwing.com.png")}
            style={styles.userAvatar}
          />
          <TextInput
            style={styles.postInput}
            placeholder="Share your fitness journey..."
            multiline
            value={postText}
            onChangeText={updatePostText}
          />
        </View>

        {/* Post Actions */}
        <View>
          <View style={styles.shareActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setFoodModalVisible(true)}
            >
              <Ionicons name="fast-food-outline" size={24} color="#7743CE" />
              <Text style={styles.actionButtonText}>Share Food</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { marginLeft: 15 }]}
              onPress={() => setTemplateModalVisible(true)}
            >
              <MaterialIcons name="fitness-center" size={24} color="#7743CE" />
              <Text style={styles.actionButtonText}>Share Template</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.sendButton, { marginTop: 10 }]}
            onPress={sendPost}
          >
            <Feather name="send" size={24} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        {/* Added Food Items */}
        <ScrollView style={styles.foodItemsContainer}>
          {foodItems ? <AddShownFood foodItems={foodItems} /> : null}
        </ScrollView>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterButton, filterLikedPosts && styles.filterButtonActive]}
          onPress={() => setFilterLikedPosts(!filterLikedPosts)}
        >
          <Ionicons
            name={filterLikedPosts ? "heart" : "heart-outline"}
            size={20}
            color={filterLikedPosts ? "#7743CE" : "#666"}
          />
          <Text style={[styles.filterButtonText, filterLikedPosts && styles.filterButtonTextActive]}>
            Liked Posts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feed Screen */}
      <ScrollView
        style={{ marginBottom: 300, height: 500 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post, index) => {
          if (filterLikedPosts && !post.liked) {
            return;
          }
          return (
            <AddPost
              key={`post-${index}`}
              post={post}
              updateCommentVisible={updateCommentVisible}
              updateCurrentPostComment={updateCurrentPostComment}
            />
          );
        })}
      </ScrollView>

      <View>
        <Modal isVisible={isCommentVisible}>
          <View style={{}}>
            <View
              style={{
                width: 200,
                alignSelf: "center",

              }}
            >
              <Button
                title="return"
                onPress={updateCommentVisible}
                color={"#7743CE"}
              ></Button>
            </View>
            {posts
              .find((post) => post.id === currentPostComment)
              ?.comments?.map((comment, index) => {
                return (
                  <Text key={index} style={styles.commentbox}>
                    {comment}
                  </Text>
                );
              })}
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              onSubmitEditing={(e) => sendComment(e.nativeEvent.text)}
            />
          </View>
        </Modal>
      </View>

      <Modal isVisible={templateModalVisible} onBackdropPress={() => setTemplateModalVisible(false)}>
        <View style={styles.templateModal}>
          <Text style={styles.templateModalTitle}>Select Template to Share</Text>
          <ScrollView style={styles.templateList}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateItem}
                onPress={() => {
                  setPostText(postText + `\n\nWorkout Template: ${template.name}\n` +
                    template.exercises.map(ex =>
                      `- ${ex.name}: ${ex.sets} sets × ${ex.reps} reps @ ${ex.weight}kg`
                    ).join('\n')
                  );
                  setTemplateModalVisible(false);
                }}
                onLongPress={() => {
                  Alert.alert(
                    `${template.name} Details`,
                    template.exercises.map(ex =>
                      `${ex.name}\n` +
                      `Sets: ${ex.sets}\n` +
                      `Reps: ${ex.reps}\n` +
                      `Weight: ${ex.weight}kg\n`
                    ).join('\n'),
                    [{ text: 'OK', style: 'default' }]
                  );
                }}
                delayLongPress={500}
              >
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateExerciseCount}>
                  {template.exercises.length} exercises
                </Text>
                <Text style={styles.templateHint}>Long press to view details</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setTemplateModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={foodModalVisible} onBackdropPress={() => setFoodModalVisible(false)}>
        <View style={styles.templateModal}>
          <Text style={styles.templateModalTitle}>Share Custom Food</Text>
          <ScrollView style={styles.templateList}>
            {recentFoods.length > 0 ? (
              recentFoods.map((food) => (
                <TouchableOpacity
                  key={`${food.name}-${food.calories}-${food.servingSize}`}
                  style={styles.templateItem}
                  onPress={() => {
                    firestore()
                      .collection('users')
                      .doc(auth().currentUser?.uid)
                      .collection('current_community_post')
                      .add({
                        ...food,
                        source: 'custom'
                      });
                    setFoodModalVisible(false);
                  }}
                  onLongPress={() => {
                    Alert.alert(
                      `${food.name} Details`,
                      `Calories: ${food.calories}\n` +
                      `Serving Size: ${food.servingSize} ${food.servingSizeUnit}\n` +
                      `Carbs: ${food.macros.carbs}g\n` +
                      `Protein: ${food.macros.protein}g\n` +
                      `Fat: ${food.macros.fat}g`,
                      [{ text: 'OK', style: 'default' }]
                    );
                  }}
                  delayLongPress={500}
                >
                  <Text style={styles.templateName}>{food.name}</Text>
                  <Text style={styles.templateExerciseCount}>
                    {food.calories} calories
                  </Text>
                  <Text style={styles.templateHint}>Long press to view details</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.templateHint, { textAlign: 'center', marginTop: 20 }]}>
                No custom foods available. Create custom foods in the Diet tab first.
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setFoodModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000000",
  },
  topbar: {
    backgroundColor: "#FAF6E3",
    alignItems: "center",
    flexDirection: "row",
    alignContent: "center",
    alignSelf: "center",
    width: 370,
    justifyContent: "center",
    paddingVertical: 5,
  },
  topbutton: {
    backgroundColor: "transparent",
    width: 30,
    marginHorizontal: 10,
  },
  middlebar: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
  },
  user: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  textbox: {
    backgroundColor: "#e7e7e4",
    maxWidth: 250,
    width: 250,
    height: 60,
    borderRadius: 10,
    flex: 1,
  },
  middlebutton: {
    backgroundColor: "#e7e7e4",
    width: 170,
    borderRadius: 10,
    height: 30,
    marginHorizontal: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
    fontSize: 14,
  },
  commentbox: {
    backgroundColor: "#7743CE",
    width: 100,
    color: 'white',
    fontSize: 20,
    borderRadius: 15,
    marginVertical: 5,
    textAlign: 'center',
    fontStyle: 'italic',
    alignSelf: 'center',

  },
  userPostContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userAvatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  postInput: {
    flex: 1,
    minHeight: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    minWidth: 130,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#7743CE',
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#7743CE',
    alignSelf: 'stretch',
  },
  sendButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  foodItemsContainer: {
    maxHeight: 120,
    marginTop: 15,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#F0E6FF',
  },
  filterButtonText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#7743CE',
  },
  templateModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  templateModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7743CE',
    marginBottom: 15,
    textAlign: 'center',
  },
  templateList: {
    maxHeight: 400,
  },
  templateItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
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
  modalCloseButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  shareActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  templateHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4
  },
});