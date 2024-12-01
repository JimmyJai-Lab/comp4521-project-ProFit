import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import FoodItem from "@/services/food/FoodItem";
const AddCustom = () => {
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    servingSize: "",
    servingSizeUnit: "",
  });

  // Handle form field changes
  const handleInputChange = (field:any, value:any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle submit button click
  const handleSubmit = () => {
    // Validate form data before submission
    if (!formData.name || !formData.calories) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const foodItem = {
      name: formData.name,
      calories: parseFloat(formData.calories),
      macros: {
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
      },
      servingSize: parseFloat(formData.servingSize),
      servingSizeUnit: formData.servingSizeUnit,
      source: auth().currentUser?.displayName
    };

    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('custom_foods')
      .add({...foodItem})
      .then(() => {
        Alert.alert("Success", "Item added successfully!");
      })
      .catch((error) => {
        console.error("Error adding custom food: ", error);
      });

    firestore()
      .collection('custom_foods_from_users')
      .add({...foodItem})
      .catch((error) => {
        console.error("Error adding custom food to community: ", error);
      });

    // Reset the form
    setFormData({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      servingSize: "",
      servingSizeUnit: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Custom Item</Text>
      <View style={styles.formcontainer}>
      {/* Food Name Input */}
      <TextInput
        style={styles.topinput}
        placeholder="Food Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      {/* Calories Input */}
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={formData.calories}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("calories", value)}
      />

      {/* Protein Input */}
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        value={formData.protein}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("protein", value)}
      />

      {/* Carbohydrates Input */}
      <TextInput
        style={styles.input}
        placeholder="Carbohydrates (g)"
        value={formData.carbs}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("carbs", value)}
      />

      {/* Fat Input */}
      <TextInput
        style={styles.input}
        placeholder="Fat (g)"
        value={formData.fat}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("fat", value)}
      />

      {/* Servings Input */}
      <TextInput
        style={styles.input}
        placeholder="Servings"
        value={formData.servingSize}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("servingSize", value)}
      />

      {/* Unit Input */}
      <TextInput
        style={styles.input}
        placeholder="Unit (e.g., grams, cups)"
        value={formData.servingSizeUnit}
        onChangeText={(value) => handleInputChange("servingSizeUnit", value)}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  formcontainer:{
    backgroundColor:'#afbdd6',
    borderRadius:10,
    width:350,
    
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: 330,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginHorizontal:10,
    marginVertical:5
  },
  topinput: {
    width: 330,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginHorizontal:10,
    marginTop:10,
    marginBottom:5
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    width:100,
    height:50,
    alignSelf:'center',
    marginBottom:10
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default AddCustom;