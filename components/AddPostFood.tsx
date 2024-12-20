// CommentBox.js
import { useState } from "react";
import { StyleSheet, View, Text,TouchableOpacity, Alert } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import FoodItem from "@/services/food/FoodItem";
import Modal from "react-native-modal";

const AddPostFood = ({ foodItems } : { foodItems: Array<FoodItem>}) => {
  const [showMarco, setShowMarco] = useState(false);

  return ( 
    <View>
      {foodItems.map((foodItem, index) => {
        return (
          <TouchableOpacity onPress={() => setShowMarco(!showMarco)}>
            <View style={styles.mealcontainer}>
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
              </View>
              <View style={styles.rightcontainer}>
                <View style={{ marginLeft: 5 }}>
                  <FontAwesome5 name="fire-alt" size={15} color="#D91656" />
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
                      fontSize: 15,
                    }}
                  >
                    {foodItem.calories} cal
                  </Text>
                </View>
              </View>
            </View>
            <Modal
              isVisible={showMarco}
              onBackdropPress={() => setShowMarco(!showMarco)}
            >
              <View
                style={{
                  backgroundColor: "#EEEEEE",
                  padding: 20,
                  alignItems: "center",
                  width: 170,
                  alignSelf: "center",
                  borderRadius: 10,
                }}
              >
                <Text style={styles.smallbar}>
                  Crabs: {foodItem.macros.carbs}
                </Text>
                <Text style={styles.smallbar}>
                  Proteins: {foodItem.macros.protein}
                </Text>
                <Text style={styles.smallbar}>Fats: {foodItem.macros.fat}</Text>
              </View>
            </Modal>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mealcontainer: {
    backgroundColor: "#cfcfce",
    width: 270,
    height: 30,
    minHeight: 30,
    borderRadius: 25,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
    marginVertical: 1,
  },
  rightcontainer: {
    flexDirection: "row",
    backgroundColor: "#adbbd5",
    borderRadius: 20,
    width: 115,
    height: 30,
    alignItems: "center",
    marginRight: 50,
  },
  confirmbutton: {
    backgroundColor: "#FFB200",
    borderRadius: 20,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  smallbar: {
    fontSize: 15,
    fontWeight: 300,
    color: "white",
    fontStyle: "italic",
    backgroundColor: "#7743CE",
    borderRadius: 10,
    marginVertical: 5,
    textAlign: "center",
    width: 150,
  },
});

export default AddPostFood;