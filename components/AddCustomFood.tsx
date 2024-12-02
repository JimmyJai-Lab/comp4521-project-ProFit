// CommentBox.js
import React from "react";
import { StyleSheet, View, Text,TouchableOpacity,Alert,Modal, FlatList,TextInput } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

const AddCustomFood = () => {

  const [amount, setAmount] = useState<number>(1);
	
	const [selectedOption, setSelectedOption] = useState("");
  	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const options = ["Breakfast", "Lunch", "Dinner"];
	
	const handleOptionSelect = (option: React.SetStateAction<string>) => {
		setSelectedOption(option); // Update the selected option
		setIsDropdownVisible(false); // Close the dropdown
  	};

  const confirmInput = (inputNumber: string) => {
		const number = parseFloat(inputNumber);
		if (number < 0) {
			Alert.alert('Please enter a valid number');
		}
		else {
			setAmount(number);
		}
	}

  return ( 
    <View style={styles.container}>
		
			{/* <Image source={require('../assets/images/bur.jpg')} style={{height:100,width:100,borderRadius:20,margin:5}}/> */}

			<View style={{width:150,backgroundColor:'transparent',height:"100%",margin:5,paddingLeft:5}}>
			
			<Text style={{fontSize:20,color:'#640D5F',fontWeight:'bold',margin:0}}>{}Food Name</Text>
			<Text style={{fontWeight:'bold',fontSize:20,color:'#640D5F',marginVertical:5}}>{} Cals</Text>
			<Text style={{fontWeight:300,fontSize:15,color:'#640D5F',fontStyle:'italic',marginVertical:5}}>ServingSize: {} {}</Text>
			</View>

			

			<View style={{backgroundColor:'transparent',width:150,height:90,margin:10,alignSelf:'center'}}>
			<View style={{alignSelf:'flex-end',flexDirection:'row',width:100,backgroundColor:'#ffc332',marginHorizontal:0,borderRadius:10,alignItems:'center',marginBottom:10}}>
			<TouchableOpacity style={{marginHorizontal:5, backgroundColor:'#ffedc1',borderRadius:10,width:50,marginVertical:5,alignItems:'center',flex:1,}} onPress={() => {
				setAmount(amount + 1);
			}}> 
				<Text style={{color:'#1c438b',fontSize:20,textAlignVertical:'center',textAlign:'center',alignSelf:'center',marginBottom:2}}>+</Text>
			</TouchableOpacity>

			<TextInput style={{marginHorizontal:5, borderRadius:10,width:50,margin:5,flex:1,textAlign:'center'}} keyboardType='numeric' onSubmitEditing={(e) => confirmInput(e.nativeEvent.text)}>{amount}</TextInput>

			<TouchableOpacity style={{marginHorizontal:5, backgroundColor:'#ffedc1',borderRadius:10,width:50,marginVertical:5,alignItems:'center',flex:1,alignContent:'center'}} onPress={() => {
				if (amount > 1) {
					setAmount(amount - 1);
				}
			}}>
				<Text style={{color:'#1c438b',fontSize:20,textAlign:'center'}}>-</Text>
			</TouchableOpacity>
			</View>

			
			

			{/* Add button */}
			<View style={{flexDirection:'row',backgroundColor:'transparent',alignItems:'center',alignSelf:'flex-end',paddingTop:10}}>


				
			<TouchableOpacity>
				<View style={{backgroundColor:'#ffc332',borderRadius:10,width:40,marginRight:30}}>
				<AntDesign name="check" size={24} color="white" style={{fontWeight:'bold',marginLeft:8}}/>
				</View>
			</TouchableOpacity>

			</View>
			
			</View>

		</View>
  );
};

const styles = StyleSheet.create({
  container: {
      height:"100%",
      width:360,
      backgroundColor: '#e2ebfb',
      flex:1,
      margin:10,
      borderRadius:15,
  flexDirection:'row',
  alignSelf:'center',
  justifyContent:'center',
    },
  selector: {
  width: 100, // Small width
  height: 30, // Small height
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  marginRight:10
  },
  selectedText: {
  fontSize: 14,
  color: "#000",
  },
  modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdown: {
  width: 150,
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 10,
  elevation: 5, // Shadow for Android
  shadowColor: "#000", // Shadow for iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  },
  option: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
  },
  optionText: {
  fontSize: 14,
  color: "#000",
  },

})

export default AddCustomFood;