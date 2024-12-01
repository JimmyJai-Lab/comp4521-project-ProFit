import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import AddCustomFood from "@/components/AddCustomFood";


const CommentsPage = () => {
  // Sample data for comments
  

  return (
    <View>
    <ScrollView style={{backgroundColor:'#e7e7e4',margin:10,borderRadius:10,minHeight:50}}>
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
      <AddCustomFood />
        
        
        

    </ScrollView>
    
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  commentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commentContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Shadow for Android
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#007bff",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CommentsPage;