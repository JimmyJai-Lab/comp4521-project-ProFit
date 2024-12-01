import { Text, View, StyleSheet,Button,TouchableOpacity,Image,TextInput,ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AddPost from '@/components/AddPost';
import { useEffect, useState } from 'react';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";


export default function CommunityScreen() {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);

  const updatePostText = (text: string) => {
    setPostText(text);
  };

  const sendPost = () => {
    firestore()
      .collection('community_posts')
      .add({
        content: postText,
        date: new Date(),
        uid: auth().currentUser?.uid,
        username: auth().currentUser?.displayName,
      })
      .then(() => {
        setPostText('');
      })
      .catch((error) => {
        console.error('Failed to add post:', error);
      });

    // firestore()
    //   .collection('users')
    //   .doc(auth().currentUser?.uid)
    //   .collection('my_posts')
    //   .add({
    //     text: postText,
    //     date: new Date(),
    //   })
    //   .then(() => {
    //     setPostText('');
    //   })
    //   .catch((error) => {
    //     console.error('Failed to add post:', error);
    //   });
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('community_posts')
      .orderBy('date', 'desc')
      .onSnapshot(() => {
        console.log('Community posts updated!');
      });

    return () => unsubscribe();
  });

  
  return (
    <View>
      <View style={styles.topbar}>
        <TouchableOpacity style={styles.topbutton}>
          <AntDesign name="search1" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topbutton}>
          <AntDesign name="hearto" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topbutton}>
          <Ionicons name="fast-food-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topbutton}>
          <MaterialIcons name="fitness-center" size={30} color= "black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topbutton}>
          <Entypo name="camera" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topbutton}>
          <Entypo name="location-pin" size={30} color="black" />
        </TouchableOpacity> 
      </View>


      {/* User Post */}
      <View style={styles.user}>
      <Image source={require('../../assets/images/bur.jpg')} style={{height:60,width:60,borderRadius:30,margin:5}}/>
      <TouchableOpacity style={styles.textbox} disabled>
        <TextInput placeholder="Let's share something here!" maxLength={500} style={{fontWeight:200}} value={postText} onChangeText={updatePostText}></TextInput>
      </TouchableOpacity>
      <TouchableOpacity style={{marginLeft:5}} onPress={sendPost}>
        <Feather name="send" size={24} color="black" />
      </TouchableOpacity>
      </View>


      {/* middle bar */}
      <View style={styles.middlebar}>
      
        <TouchableOpacity style={styles.middlebutton}>
          <Text style={{textAlign:'center',fontSize:20,fontWeight:200}}>Poplar</Text>
        </TouchableOpacity>
        
      
        <TouchableOpacity style={styles.middlebutton}>
          <Text style={{textAlign:'center',fontSize:20,fontWeight:200}}>Followers</Text>
        </TouchableOpacity>
      </View>
      {/* Feed Screen */}
      
      <ScrollView style={{height:460,marginVertical:5}}>
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
  },
  user:{
    backgroundColor:'transparent',
    flexDirection:'row',
    alignItems:'center',
    
  },
  textbox:{
    backgroundColor:'#e7e7e4',
    width:250,
    height:60,
    borderRadius:10,
  },
  middlebutton:{
    backgroundColor:'#e7e7e4',
    width:120,
    borderRadius:10,
    height:30,
    marginHorizontal:10,
    
  },
  
});