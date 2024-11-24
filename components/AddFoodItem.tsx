import {View, Text, Image,TouchableOpacity,StyleSheet} from 'react-native'
import FoodItem from '@/services/food/FoodItem';
import { useState } from 'react';


const AddFoodItem = ({ item }: {item : FoodItem}) => {
    const [amount] = useState<number>(1);

    return(
			<View style={styles.container}>
			
				<Image source={require('../assets/images/bur.jpg')} style={{height:100,width:100,borderRadius:20,margin:5}}/>
				
				<View style={{width:100,backgroundColor:'transparent',height:100}}>
				<Text style={{fontSize:20, color:'#1c438b',fontWeight:'bold',marginBottom:5}}>{item.name}</Text>
				<Text style={{fontWeight:300,marginVertical:5}}>From USDA</Text>
				<Text style={{fontWeight:'bold',fontSize:20,color:'#1c438b',marginVertical:5}}>{item.calories} Cals</Text>
				</View>

				<View style={{backgroundColor:'transparent',width:100,marginLeft:5}}>
				<View style={{alignSelf:'center',flexDirection:'row',width:100,backgroundColor:'#ffc332',marginHorizontal:0,borderRadius:10,alignItems:'center',marginBottom:10}}>
				<TouchableOpacity style={{marginHorizontal:5, backgroundColor:'#ffedc1',borderRadius:10,width:50,marginVertical:5,alignItems:'center',flex:1,}}> 
					<Text style={{color:'#1c438b',fontSize:20,textAlignVertical:'center',textAlign:'center',alignSelf:'center',marginBottom:2}}>+</Text>
				</TouchableOpacity>

				<Text style={{marginHorizontal:5, borderRadius:10,width:50,margin:5,flex:1,textAlign:'center'}}>{amount}</Text>

				<TouchableOpacity style={{marginHorizontal:5, backgroundColor:'#ffedc1',borderRadius:10,width:50,marginVertical:5,alignItems:'center',flex:1,alignContent:'center'}}>
					<Text style={{color:'#1c438b',fontSize:20,textAlignVertical:'center',textAlign:'center'}}>-</Text>
				</TouchableOpacity>
				</View>

				{/* Add button */}
				<TouchableOpacity
					onPress={() => {
						// update the database
					}}
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

