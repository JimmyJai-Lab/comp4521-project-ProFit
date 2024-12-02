// CommentBox.js
import React from "react";
import { StyleSheet, View, Text,TouchableOpacity,Alert,Modal, FlatList,TextInput } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import FoodItem from "@/services/food/FoodItem";
import { router } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddCustomFood({ foodItem }: { foodItem: FoodItem }) {
  const updateCurrentPost = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('current_community_post')
        .add({
          ...foodItem
        })
    } catch (error) {
      console.log(error);
    }

    router.navigate("/(tabs)/community");
  };

  return ( 
    <View style={styles.container}>
		
			<View style={{width:150,backgroundColor:'transparent',height:"100%",margin:5,paddingLeft:5}}>
        <Text style={{fontSize:20,color:'#640D5F',fontWeight:'bold',margin:0}}>{foodItem.name}</Text>
        <Text style={{fontWeight:'bold',fontSize:20,color:'#640D5F',marginVertical:5}}>{foodItem.calories} Cals</Text>
        <Text style={{fontWeight:300,fontSize:15,color:'#640D5F',fontStyle:'italic',marginVertical:5}}>ServingSize: {foodItem.servingSize} {foodItem.servingSizeUnit}</Text>
			</View>

			<View>
        <Text>Nutrition</Text>
        <Text>{foodItem.macros.carbs}</Text>
        <Text>{foodItem.macros.protein}</Text>
        <Text>{foodItem.macros.fat}</Text>
      </View>

			<View style={{backgroundColor:'transparent',width:150,height:90,margin:10,alignSelf:'center'}}>
        <View style={{flexDirection:'row',backgroundColor:'transparent',alignItems:'center',alignSelf:'flex-end',paddingTop:10}}>     
        <TouchableOpacity onPress={updateCurrentPost}>
          <View style={{backgroundColor:'#ffc332',borderRadius:10,width:40,marginRight:30}}>
          <AntDesign name="check" size={24} color="white" style={{fontWeight:'bold',marginLeft:8}}/>
          </View>
        </TouchableOpacity>
        </View>
			</View>

		</View>
  );
};

const styles = StyleSheet.create({
  container: {
      height:"100%",
      width:360,
      backgroundColor: '#e2ebfb',
      flex:1,
      margin:10,
      borderRadius:15,
  flexDirection:'row',
  alignSelf:'center',
  justifyContent:'center',
    },
  selector: {
  width: 100, // Small width
  height: 30, // Small height
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  marginRight:10
  },
  selectedText: {
  fontSize: 14,
  color: "#000",
  },
  modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdown: {
  width: 150,
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 10,
  elevation: 5, // Shadow for Android
  shadowColor: "#000", // Shadow for iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  },
  option: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
  },
  optionText: {
  fontSize: 14,
  color: "#000",
  },

})
