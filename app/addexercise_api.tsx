import { Text, View, StyleSheet, ScrollView } from 'react-native';
import AddExercise from '@/components/AddExercise';
import { SearchBar } from '@rneui/themed';
import { TextInput } from "react-native-paper";
import React, { useState } from 'react';
const DATA = [
  {
    id: 0,
    name: "chest press",
    weight: 40,
    set: 4,
    rep: 10,
    image: require("../assets/images/chest press.webp"),
    checked: false,
  },
  {
    id: 1,
    name: "shoulder press",
    weight: 20,
    set: 4,
    rep: 8,
    image: require("../assets/images/shoulder press.jpg"),
    checked: false,
  },
  {
    id: 2,
    name: "lateral raise",
    weight: 10,
    set: 4,
    rep: 8,
    image: require("../assets/images/lateral raise.webp"),
    checked: false,
  },
  {
    id: 3,
    name: "chest butterfly",
    weight: 30,
    set: 4,
    rep: 10, 
    image: require("../assets/images/chest butterfly.webp"),
    checked: false,
  },
];
export class App extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search: any) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        placeholder="Search for Exercises Here ..."
        onChangeText={this.updateSearch}
        value={search}
        lightTheme={true}
        inputContainerStyle={{height:10,backgroundColor:'#d1d0d0'}}
        containerStyle={{minHeight:0,height:47}}
        inputStyle={{
          minHeight: 0,
          fontSize:10          
        }}
      />
    );
  }
}

export default function ExerciseAPI() {
  return (
    <View >
      <App></App>
      <ScrollView>
        <AddExercise item={DATA[0]}/>  
        <AddExercise item={DATA[1]}/>
        <AddExercise item={DATA[2]}/>  
        <AddExercise item={DATA[3]}/>     
      </ScrollView>    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
});