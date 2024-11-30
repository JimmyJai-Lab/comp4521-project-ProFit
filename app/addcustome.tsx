import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";

const AddCustome = () => {
  const [formData, setFormData] = useState({
    foodName: "",
    userName: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    source: "",
    servings: "",
    unit: "",
    amount: "",
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
    if (!formData.foodName || !formData.userName || !formData.calories) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    // For now, simply log the form data
    console.log("Submitted Data:", formData);

    // Show a success message
    Alert.alert("Success", "Item added successfully!");

    // Reset the form
    setFormData({
      foodName: "",
      userName: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      source: "",
      servings: "",
      unit: "",
      amount: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Custome Item</Text>
      <View style={styles.formcontainer}>
      {/* Food Name Input */}
      <TextInput
        style={styles.topinput}
        placeholder="Food Name"
        value={formData.foodName}
        onChangeText={(value) => handleInputChange("foodName", value)}
      />

      {/* User Name Input */}
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={formData.userName}
        onChangeText={(value) => handleInputChange("userName", value)}
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

      {/* Source Input */}
      <TextInput
        style={styles.input}
        placeholder="Source"
        value={formData.source}
        onChangeText={(value) => handleInputChange("source", value)}
      />

      {/* Servings Input */}
      <TextInput
        style={styles.input}
        placeholder="Servings"
        value={formData.servings}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("servings", value)}
      />

      {/* Unit Input */}
      <TextInput
        style={styles.input}
        placeholder="Unit (e.g., grams, cups)"
        value={formData.unit}
        onChangeText={(value) => handleInputChange("unit", value)}
      />

      {/* Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={formData.amount}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("amount", value)}
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

export default AddCustome;