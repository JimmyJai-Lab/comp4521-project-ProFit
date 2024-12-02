import { Text, View, StyleSheet,Button,TouchableOpacity,Image,TextInput,ScrollView, RefreshControl } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AddPost from '@/components/AddPost';
import { useEffect, useState } from 'react';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Post from '@/services/community/Post';
import { router } from 'expo-router';
import AddShownFood from '@/components/AddShownFood';
import FoodItem from '@/services/food/FoodItem';

export default function CommunityScreen() {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [foodItems, setFoodItems] = useState<Array<FoodItem>>();

  const updatePostText = (text: string) => {
    setPostText(text);
  };

  const sendPost = async () => {
    await firestore()
      .collection('community_posts')
      .add({
        content: postText,
        foodItems: foodItems,
        date: new Date(),
        uid: auth().currentUser?.uid,
        username: auth().currentUser?.displayName,
        likes: 0
      })
      .then(() => {
        setPostText('');
      })
      .catch((error) => {
        console.error('Failed to add post:', error);
      });

    await firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('current_community_post')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          doc.ref.delete();
        });
      });
      
    setFoodItems([]);
  };

  const updatePosts = async () => {
    var data;
    try {
      const snapshot = await firestore()
        .collection('community_posts')
        .orderBy('date', 'desc')
        .get();

      data = snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    
    if (data) {
      data = data.map(item => {
        const date = new Date(item.date.seconds * 1000 + item.date.nanoseconds / 1000000);
        return { ...item, date, id: item.id };
      });
      setPosts(data as Array<Post>);
    }
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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('community_posts')
      .onSnapshot(() => {
        updatePosts();
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
  
  return (
    <View>
      {/* User Post */}
      <View style={styles.user}>
        <Image
          source={require("../../assets/images/bur.jpg")}
          style={{ height: 60, width: 60, borderRadius: 30, margin: 5 }}
        />
        <TouchableOpacity style={styles.textbox} disabled>
          <TextInput
            placeholder="Let's share something here!"
            maxLength={500}
            style={{ fontWeight: 200 }}
            value={postText}
            onChangeText={updatePostText}
            multiline={true}
            editable={true}
          ></TextInput>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 15, backgroundColor: "transparent" }}
          onPress={sendPost}
        >
          <Feather name="send" size={35} color="black" />
        </TouchableOpacity>
      </View>
      {/* Added Food item shown place */}
      <ScrollView style={{ maxHeight: 120, marginVertical: 5, minHeight: 20 }}>
        {foodItems ? <AddShownFood foodItems={foodItems} /> : null}
      </ScrollView>

      {/* middle bar */}
      <View style={styles.middlebar}>
        <TouchableOpacity style={styles.middlebutton}>
          <Text
            style={{ textAlign: "center", fontSize: 20, fontWeight: 200 }}
            onPress={() => router.navigate({ pathname: "/comment_addfood" })}
          >
            Add Food Item
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
          return <AddPost key={`post-${index}`} post={post} />;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
  topbar:{
    backgroundColor:'#FAF6E3',
    alignItems:'center',
    flexDirection:'row',
    alignContent:'center',
    alignSelf:'center',
    width:370,
    justifyContent:'center',
    paddingVertical:5,
  },
  topbutton:{
    backgroundColor:'transparent',
    width:30,
    marginHorizontal:10,
  },
  middlebar:{
    marginVertical:5,
    flexDirection:'row',
    justifyContent:'center',
    marginTop:0
  },
  user:{
    backgroundColor:'transparent',
    flexDirection:'row',
    alignItems:'center',
    paddingTop:10
    
  },
  textbox:{
    backgroundColor:'#e7e7e4',
    maxWidth:250,
    width:250,
    height:60,
    borderRadius:10,
    flex:1
  },
  middlebutton:{
    backgroundColor:'#e7e7e4',
    width:170,
    borderRadius:10,
    height:30,
    marginHorizontal:10,
    
  },
  
});