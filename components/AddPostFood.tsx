// CommentBox.js
import React from "react";
import { StyleSheet, View, Text,TouchableOpacity } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';

const AddPostFood = () => {
  return ( 
    <View>
      <View style={styles.mealcontainer}>
                  <View style={{}}>
                    <Text
                      style={{
                        marginLeft: 15,
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "#640D5F",
                        width:130
                      }}
                    >
                      Food NameFood
                    </Text>
                    
                  </View>
                  <View style={styles.rightcontainer}>
                    
                    <View style={{marginLeft:5}}>
                    <FontAwesome5 name="fire-alt" size={15} color="#D91656" />
                    </View>
                    <View
                      style={{
                        width: 70,
                        height: 25,
                        justifyContent: "center",
                        paddingLeft: 3,
                        backgroundColor:'transparent',
                        marginLeft:5
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          textAlignVertical: "center",
                          textAlign: "center",
                          fontSize: 15,
                        }}
                      >
                         9999 cal
                      </Text>
                    </View>
                    
                  </View>
                 
                </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealcontainer: {
    backgroundColor:'#cfcfce',
    width:270,
    height:30,
    minHeight:30,    
    borderRadius:25,
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:5,                         
    alignItems:'center',
    marginVertical:1
  },
  rightcontainer:{
      flexDirection:'row',
      backgroundColor:'#adbbd5',
      borderRadius:20,
      width:115,
      height:30,
      alignItems:'center',
      marginRight:50,     
  },
  confirmbutton:{
    backgroundColor:'#FFB200',
    borderRadius:20,
    width:50,
    height:50,
    alignItems:'center',
    justifyContent:'center',
    marginLeft:10
  },
});

export default AddPostFood;