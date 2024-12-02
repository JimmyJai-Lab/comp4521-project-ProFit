// CommentBox.js
import React from "react";
import { StyleSheet, View, Text,TouchableOpacity } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import FoodItem from "@/services/food/FoodItem";

export default function AddShownFood({ foodItems }: { foodItems: Array<FoodItem> }) {
  return ( 
    <View>
      {foodItems.map((foodItem, index) => {
        return (
          <View style={styles.mealcontainer} key={index}>
            <View style={{}}>
              <Text
                style={{
                  marginLeft: 15,
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "#640D5F",
                  width: 130,
                }}
              >
                {foodItem.name}
              </Text>

              <Text
                style={{
                  marginLeft: 15,
                  fontWeight: 300,
                  color: "black",
                }}
              >
                Serving: {foodItem.servingSize} {foodItem.servingSizeUnit}
              </Text>
            </View>

            <View style={styles.rightcontainer}>
              <View style={{ marginLeft: 5 }}>
                <FontAwesome5 name="fire-alt" size={24} color="#D91656" />
              </View>
              <View
                style={{
                  width: 70,
                  height: 25,
                  justifyContent: "center",
                  paddingLeft: 3,
                  backgroundColor: "transparent",
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlignVertical: "center",
                    textAlign: "center",
                    fontSize: 17,
                  }}
                >
                  {foodItem.calories} cal
                </Text>
              </View>
              <TouchableOpacity>
                <View style={styles.confirmbutton}>
                  <Entypo name="cross" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mealcontainer: {
    backgroundColor:'#cfcfce',
    width:330,
    height:"100%",
    flex:1,
    minHeight:60,    
    borderRadius:25,
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:5,      
    marginVertical:5,                    
    alignItems:'center'
  },
  rightcontainer:{
      flexDirection:'row',
      backgroundColor:'#adbbd5',
      borderRadius:20,
      width:110,
      height:50,
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
