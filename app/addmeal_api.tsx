import { Text, View, StyleSheet } from 'react-native';
import AddFoodItem from '@/components/AddFoodItem';
import { SearchBar } from '@rneui/themed';
import React, { useState } from 'react';

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
        placeholder="Search for Previous Foods Here ..."
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

export default function MealAPI() {
  return (
    <View >
      <App></App>
      <AddFoodItem item={{name:'Burger',source:'Someone',cal:78,}} />  
      <AddFoodItem item={{name:'Burger',source:'Someone',cal:78,}} />  
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