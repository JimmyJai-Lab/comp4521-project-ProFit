import {View, Text, Image,TouchableOpacity,StyleSheet } from 'react-native'
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

const AddPost = ({ post, updateCommentVisible, updateCurrentPostComment }: { post: Post, updateCommentVisible: () => void, updateCurrentPostComment: (id: string) => void  }) => {
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
            source={require("../assets/images/bur.jpg")}
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
        minHeight:100,
        maxHeight:700,
        width:350,
        backgroundColor: '#FEF3E2',
        flexDirection:'row',
        alignSelf:'center',
        marginVertical:5
      },
    userbar:{
        backgroundColor:'transparent',
        flexDirection:'row',
        width:270,
        justifyContent:'space-between',
        alignItems:'center',
        marginVertical:3,
    },
    functionbar:{
        flexDirection:'row',
        width:100,
        alignItems:'center',
        marginVertical:3,
        justifyContent:'flex-start',
    },
    functionbutton:{
        marginHorizontal:15,
    },
    fooditem: {
        marginVertical: 10, // Adds spacing around the entire container
        flexDirection: "column",
    },
})

