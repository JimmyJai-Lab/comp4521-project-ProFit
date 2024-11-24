import {useNavigation,ParamListBase} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import React, { useState } from 'react';
import { Text, View, StyleSheet,TouchableOpacity,ScrollView,Image} from 'react-native';
import { SearchBar } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { withDecay } from 'react-native-reanimated';
import AddFoodItem from '@/components/AddFoodItem';
import { router } from 'expo-router';


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

export default function CommunityScreen() {
  //const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    
    return (
      <View>
        {/* Search Bar*/}
        <App></App>

        {/* Middle Buttons*/}
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          {/* Left Buttons*/}
          <TouchableOpacity style={styles.functionBox}>
            <MaterialCommunityIcons
              name="line-scan"
              size={60}
              color="black"
              style={{ flex: 1, alignSelf: "center", paddingLeft: 10 }}
            />
            <Text
              style={{
                fontSize: 25,
                color: "white",
                flex: 1,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Scan
            </Text>
          </TouchableOpacity>

          {/* Right Buttons*/}
          <TouchableOpacity
            style={styles.functionBox}
            onPress={() => router.navigate("/addmeal_api")}
          >
            <MaterialIcons
              name="assignment-add"
              size={60}
              color="black"
              style={{ flex: 1, alignSelf: "center", paddingLeft: 10 }}
            />
            <Text
              style={{
                fontSize: 25,
                color: "white",
                flex: 1,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom History*/}
        <Text
          style={{
            fontWeight: 100,
            fontStyle: "italic",
            paddingHorizontal: 10,
            paddingTop: 20,
          }}
        >
          Previous added items
        </Text>
        <ScrollView style={styles.bottomContainer}>
          <Text>Test</Text>
          <AddFoodItem
            item={{ name: "Burger", source: "Someone", calories: 78, macros: { protein: 10, fat: 10, carbs: 10 }, servings: 1 }}
          />
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#000000',
    },
    functionBox:{
      backgroundColor:'#fe6d87',
      height:90,
      width:150,
      marginTop:15,
      marginHorizontal:10,
      borderRadius:20,
      flexDirection:'row',
      alignContent:'center',     
    },
    bottomContainer:{
      backgroundColor:'#d9e3fb',
      height:500,
      width:340,
      alignSelf:'center',
      borderRadius:20,
    },
  });