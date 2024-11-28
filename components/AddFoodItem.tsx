import {View, Text, Image,TouchableOpacity,StyleSheet, Alert} from 'react-native'
import FoodItem from '@/services/food/FoodItem';
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';


const AddFoodItem = ({ item }: {item : FoodItem}) => {
    const [amount, setAmount] = useState<number>(1);

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

			<View style={{width:100,backgroundColor:'transparent',height:100}}>
			<Text style={{fontSize:20, color:'#1c438b',fontWeight:'bold',marginBottom:5}}>{item.name}</Text>
			<Text style={{fontWeight:300,marginVertical:5}}>From {item.source}</Text>
			<Text style={{fontWeight:'bold',fontSize:20,color:'#1c438b',marginVertical:5}}>{item.calories} Cals</Text>
			</View>

			<View style={{width:100,backgroundColor:'transparent',height:100}}>
				<Text>ServingSize: {item.servingSize}</Text>
				<Text>ServingSizeUnit: {item.servingSizeUnit}</Text>
			</View>

			<View style={{backgroundColor:'transparent',width:100,marginLeft:5}}>
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
				<Text style={{color:'#1c438b',fontSize:20,textAlignVertical:'center',textAlign:'center'}}>-</Text>
			</TouchableOpacity>
			</View>

			{/* Add button */}
			<TouchableOpacity
				onPress={updateDatabase}
			>
				<View style={{backgroundColor:'#ffc332',alignContent:'center',borderRadius:10,width:50,alignSelf:'center',marginTop:10}}>
				<Text style={{color:'white',fontSize:20,textAlignVertical:'center',textAlign:'center'}}>Add</Text>
				</View>
			</TouchableOpacity>
			</View>

		</View>
    );
  };

  export default AddFoodItem


const styles = StyleSheet.create({
    container: {
        height:120,
        width:330,
        backgroundColor: 'white',
        margin:10,
        borderRadius:15,
        alignItems:'center',
        flexDirection:'row',
        alignSelf:'center'
      },

})

