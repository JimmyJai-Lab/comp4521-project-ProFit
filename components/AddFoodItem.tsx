import {View, Text, Image,TouchableOpacity,StyleSheet, Alert,Platform,Modal, FlatList,ScrollView} from 'react-native'
import FoodItem from '@/services/food/FoodItem';
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from "@react-native-picker/picker";


const AddFoodItem = ({ item }: {item : FoodItem}) => {
    const [amount, setAmount] = useState<number>(1);
	
	const [selectedOption, setSelectedOption] = useState("");
  	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const options = ["Breakfast", "Lunch", "Dinner"];
	
	const handleOptionSelect = (option: React.SetStateAction<string>) => {
    setSelectedOption(option); // Update the selected option
    setIsDropdownVisible(false); // Close the dropdown
  	};
	
	const updateDatabase = async () => {
		// update the database
		try {
			const food = {
				name: item.name,
				calories: item.calories,
				macros: item.macros,
				source: item.source,
				servingSize: item.servingSize,
				servingSizeUnit: item.servingSizeUnit,
				amount: amount,
				date: new Date(),
			};

			await firestore()
				.collection('users')
				.doc(auth().currentUser?.uid)
				.collection('food_logs')
				.add(food);	

			const recentFoodsRef = firestore()
				.collection('users')
				.doc(auth().currentUser?.uid)
				.collection('recent_foods');

			const existingFoodSnapshot = await recentFoodsRef
				.where('name', '==', item.name)
				.where('macros', '==', item.macros)
				.where('servingSize', '==', item.servingSize)
				.get();

			if (existingFoodSnapshot.empty) {
				await recentFoodsRef.add(food);

				const snapshot = await recentFoodsRef.orderBy('date', 'desc').get();
				const recentFoods = snapshot.docs;

				if (recentFoods.length > 10) {
					const oldestFood = recentFoods[recentFoods.length - 1];
					await recentFoodsRef.doc(oldestFood.id).delete();
				}
			}

		} catch (error) {
			console.error('Failed to add food item:', error);
		}
		Alert.alert('Food item added!');
		router.navigate('/(tabs)/diet');
	};

    return(
		<View style={styles.container}>
		
			{/* <Image source={require('../assets/images/bur.jpg')} style={{height:100,width:100,borderRadius:20,margin:5}}/> */}

			<View style={{width:150,backgroundColor:'transparent',height:"100%",margin:5,paddingLeft:5}}>
			
			<Text style={{fontSize:20,color:'#640D5F',fontWeight:'bold'}}>{item.name}</Text>
			<Text style={{fontWeight:300,color:'#640D5F',fontStyle:'italic'}}>From {item.source}</Text>
			<Text style={{fontWeight:'bold',fontSize:20,color:'#640D5F'}}>{item.calories} Cals</Text>
			<Text style={{fontWeight:300,fontSize:15,color:'#640D5F',fontStyle:'italic'}}>ServingSize: {item.servingSize} {item.servingSizeUnit}</Text>
			</View>

			

			<View style={{backgroundColor:'transparent',width:150,height:90,margin:10,alignSelf:'center'}}>
			<View style={{alignSelf:'center',flexDirection:'row',width:100,backgroundColor:'#ffc332',marginHorizontal:0,borderRadius:10,alignItems:'center',marginBottom:10}}>
			<TouchableOpacity style={{marginHorizontal:5, backgroundColor:'#ffedc1',borderRadius:10,width:50,marginVertical:5,alignItems:'center',flex:1,}} onPress={() => {
				setAmount(amount + 1);
			}}> 
				<Text style={{color:'#1c438b',fontSize:20,textAlignVertical:'center',textAlign:'center',alignSelf:'center',marginBottom:2}}>+</Text>
			</TouchableOpacity>

			<Text style={{marginHorizontal:5, borderRadius:10,width:50,margin:5,flex:1,textAlign:'center'}}>{amount}</Text>

			<TouchableOpacity style={{marginHorizontal:5, backgroundColor:'#ffedc1',borderRadius:10,width:50,marginVertical:5,alignItems:'center',flex:1,alignContent:'center'}} onPress={() => {
				if (amount > 1) {
					setAmount(amount - 1);
				}
			}}>
				<Text style={{color:'#1c438b',fontSize:20,textAlign:'center'}}>-</Text>
			</TouchableOpacity>
			</View>

			

			{/* Wrap Picker in a View */}
			
			

			{/* Add button */}
			<View style={{flexDirection:'row',backgroundColor:'transparent',alignItems:'center',alignSelf:'center',paddingTop:10}}>

			<TouchableOpacity
				style={styles.selector}
				onPress={() => setIsDropdownVisible(true)}
			>
				<Text style={styles.selectedText}>
				{selectedOption || "Time"}
				</Text>
			</TouchableOpacity>

			{/* Dropdown Modal */}
			<Modal
				visible={isDropdownVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setIsDropdownVisible(false)}
			>
				<View style={styles.modalOverlay}>
				<View style={styles.dropdown}>
					<FlatList
					data={options}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity
						style={styles.option}
						onPress={() => handleOptionSelect(item)}
						>
						<Text style={styles.optionText}>{item}</Text>
						</TouchableOpacity>
					)}
					/>
				</View>
				</View>
			</Modal>	
			<TouchableOpacity
				onPress={updateDatabase}
			>
				<View style={{backgroundColor:'#ffc332',borderRadius:10,width:30}}>
				<AntDesign name="check" size={24} color="white" style={{fontWeight:'bold',marginLeft:3}}/>
				</View>
			</TouchableOpacity>

			</View>
			
			</View>

		</View>
		
    );
  };

  export default AddFoodItem


const styles = StyleSheet.create({
    container: {
        height:"100%",
        width:330,
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

