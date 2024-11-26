import {View, Text, Image,TouchableOpacity,StyleSheet} from 'react-native'
import * as Progress from 'react-native-progress';
import * as React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const AddTodayMeal = ({ food }: {food:any}) => {
    return(
        <View style={styles.container}>
        <View style={{alignItems:'center'}}>
        <Text style={{marginLeft:5,fontWeight:300}}>{food.name}</Text>
        <Text style={{marginLeft:25,fontWeight:200}}>serving: {food.num}</Text>
        </View>
        <View style={styles.rightcontainer}>
        <View style={{marginHorizontal:5}}>
        <FontAwesome5 name="fire-alt" size={24} color="#fecb48" />
        </View>
        <Text style={{textAlignVertical:'center',color:'white',fontWeight:'bold'}}>{food.cals} cal</Text>
        </View>
        </View>
    );
  };

  export default AddTodayMeal


  const styles = StyleSheet.create({
    container: {
        
        backgroundColor:'#cfcfce',
        width:325,
        height:50,
        borderRadius:25,
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:5,      
        marginVertical:5,
                        
      },
    rightcontainer:{
        flexDirection:'row',
        backgroundColor:'#a6a7c1',
        borderRadius:20,
        width:80,
        height:40,
        alignItems:'center',
        verticalAlign:'middle',
        alignContent:'center',
        alignSelf:'center',
                

    },
    
})

