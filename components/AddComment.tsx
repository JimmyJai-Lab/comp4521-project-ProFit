// CommentBox.js
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Comment from "@/services/community/Comment";

const AddComment = () => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>User Name</Text>
      <Text style={styles.commentText}>HI</Text>
      <Text style={styles.timestamp}>Time</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FEF3E2",
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
  timestamp: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
});

export default AddComment;