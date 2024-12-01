import {View, Text, Image,TouchableOpacity,StyleSheet} from 'react-native'
import * as Progress from 'react-native-progress';
import * as React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Post from '@/services/community/Post';

const AddPost = ({ post }: { post: Post }) => {
    
    return(
        <View style={styles.container}>
            <View style={{}}>
            <Image source={require('../assets/images/bur.jpg')} style={{height:60,width:60,borderRadius:30}}/>
            </View>

            <View style={{marginHorizontal:10}}>
            <View style={styles.userbar}>
            <Text style={{fontSize:18}}>{post.}</Text>
            <View style={{flexDirection:'row',width:80}}>
            <Text style={{fontWeight:200}}>{user.time}</Text>
            <TouchableOpacity style={{marginLeft:30}}>
            <Entypo name="dots-three-horizontal" size={18} color="black" />
            </TouchableOpacity>
            </View>
            </View>
            <Text style={{width:275, maxHeight:500,backgroundColor:'transparent'}}> 
                This is the content area.This is the content area.This is the content area.This is the content area.This is the content area.This is the content area.
            </Text>
            <View style={styles.functionbar}>
            <TouchableOpacity>
            <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.functionbutton}>
            <FontAwesome5 name="comment" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
            <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
            </View>
            <Text style={{fontWeight:200}}>{user.likes} likes</Text>
            </View>
        </View>
    );
  };

  export default AddPost


const styles = StyleSheet.create({
    container: {
        height:150,
        width:350,
        backgroundColor: 'transparent',
        flexDirection:'row',
        alignSelf:'center',
        
      },
    userbar:{
        backgroundColor:'transparent',
        flexDirection:'row',
        width:275,
        justifyContent:'space-between',
        alignItems:'center',
        marginVertical:3,
    },
    functionbar:{
        flexDirection:'row',
        width:150,
        alignItems:'center',
        marginVertical:3,
        justifyContent:'flex-start',
    },
    functionbutton:{
        marginHorizontal:15,
    },
})

