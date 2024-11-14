import { Text, View, StyleSheet, Button,ScrollView,TouchableOpacity,TextInput,Alert,Platform } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import {useNavigation,ParamListBase} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Progress from 'react-native-progress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import React, { useState } from 'react';
import NutrientItem from '@/components/NutrientItem';





export default function DietScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  // Micro-nutrients state
  const [protein, setProtein] = useState(80); // Example current intake
  const [carbs, setCarbs] = useState(150); // Example current intake
  const [fats, setFats] = useState(60); // Example current intake 
  
  const [calories, setCalories] = useState<number | null>(2500);
  const [inputValue, setInputValue] = useState<string>(''); // Temporary storage for input
  const [currentCalories] = useState<number>(1200);
  const [caloriesLeft, setCaloriesLeft] = useState<number >(0);

  const confirmInput = () => {
    const numericValue = parseInt(inputValue, 10);

    if (!isNaN(numericValue) && numericValue > 0) {
      setCalories(numericValue);       // Set target calories
      setInputValue('');               // Reset input value to blank

      // Calculate how many calories are left
      const remainingCalories = numericValue - currentCalories;
      setCaloriesLeft(remainingCalories);  // Store the difference
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number');
    }
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        calendarAnimation={{type: 'sequence', duration: 30}}
        daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white'}}
        style={{height: 100, paddingTop: 30, paddingBottom: 10}}
        calendarHeaderStyle={{color: 'white'}}
        calendarColor={'#7743CE'}
        dateNumberStyle={{color: 'white'}}
        dateNameStyle={{color: 'white'}}
        highlightDateNumberStyle={{color: 'yellow'}}
        highlightDateNameStyle={{color: 'yellow'}}
        disabledDateNameStyle={{color: 'grey'}}
        disabledDateNumberStyle={{color: 'grey'}}
        iconContainer={{flex: 0.1}}
     />
     
     {/* Middle part with two containers */}
     <ScrollView nestedScrollEnabled = {true}>
     <View style={styles.middleContainer}>
        {/* Left Container */}
        <View style={styles.leftContainer}>
          <View>
            <View style={{flexDirection:'row',alignSelf:'center'}}>
              <TouchableOpacity style={styles.smallbutton } >
                <TextInput 
                style={{fontWeight:'bold',color: 'white',paddingBottom:2}} 
                keyboardType='number-pad' 
                placeholder={"Cals"}
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
                maxLength={5}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallbutton } onPress={confirmInput}>
                <Text style={{fontWeight:'bold',fontSize:15,color: 'white',padding:4}} >Set</Text>
              </TouchableOpacity>

              

              
            </View>

            <Text style={{alignItems:'center',alignSelf:'center',fontSize:19,paddingTop:5,paddingBottom:10,color:'#f1f0f0',fontWeight:'bold'}}>
              Today's Calories</Text>

            {/* Progress bar for calories */}
            <AnimatedCircularProgress
              style={{alignSelf:'center'}}              
              size={120}
              width={15}
              fill={50}
              tintColor="#4B4376"
              backgroundColor="#E8BCB9">
              {
                (fill) => (
                  <>
                  <Text style={{fontWeight:'bold',fontSize:20,color:'white'}}>{currentCalories}</Text>
                  <Text style={{fontWeight:'bold',fontSize:20,color:'white'}}>/</Text>
                  <Text style={{fontWeight:'bold',fontSize:20,color:'white'}}>{calories}</Text>
                  </>
                )
              }
            </AnimatedCircularProgress>

            <Text style={{fontWeight:'bold',fontSize:12,color:'white',fontStyle: 'italic'}}>You have ...</Text>
            <Text style={{alignSelf:'center',color:'white',fontWeight:'bold'}}> {caloriesLeft > 0 
              ? `${caloriesLeft} calories left!` 
              : `${Math.abs(caloriesLeft)} calories exceed!`}</Text>
            
          </View>
          
        </View>
        <View style={styles.smallContainer}>

        </View>

        {/* Right Container */}
        
        <View style={styles.rightContainer}>
         <ScrollView nestedScrollEnabled = {true}>
          <Text style={{alignSelf:'center',fontSize:18,fontWeight:'bold',color:'white'}}>Micro-Nutrients</Text>
          <NutrientItem item={{name:'Protein',value:20,total:150,}} />
          <NutrientItem item={{name:'Carbs',value:80,total:100,}} />
          <NutrientItem item={{name:'Fats',value:35,total:80,}} />
          <NutrientItem item={{name:'Protein',value:20,total:150,}} />
          <NutrientItem item={{name:'Carbs',value:80,total:100,}} />
          <NutrientItem item={{name:'Fats',value:35,total:80,}} />
          
          </ScrollView>
        </View>
      </View>

      {/* ADD MEAL PART */}
      <View style={styles.textContainer}>
            <Text style={{color:'#1c438b',fontWeight:'bold',fontSize:20,alignSelf:'center'}}>Today's Meal</Text>
            <View >
              <TouchableOpacity style={styles.button } onPress={() => navigation.navigate('addmeal')}>
                <Text style={{fontWeight:'bold',fontSize:15,color: 'white',}}>Add Meal</Text>
              </TouchableOpacity>
            </View>
      </View>

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <Text style={{fontWeight:200,fontSize: 15,marginBottom: 10,}}>Breakfast</Text>
        <Text>Test</Text>
        
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text style={{fontWeight:200,fontSize: 15,marginTop: 10,marginBottom: 10,}}>Lunch</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text style={{fontWeight:200,fontSize: 15,marginTop: 10,marginBottom: 10,}}>Dinner</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </View>


      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#fff',
  },
  button:{
    backgroundColor:'#ffc332',
    borderRadius:15,
    paddingHorizontal:15,
    alignContent:'center',
    alignSelf:'center',
    alignItems:'center',    
    verticalAlign:'middle',
  },
  smallbutton:{
    backgroundColor:'#ffc332',
    borderRadius:15,
    paddingHorizontal:15,
    alignContent:'center',
    alignSelf:'center',
    alignItems:'center',    
    verticalAlign:'middle',
    marginHorizontal:3,
    fontSize:1
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop:10,
        
  },
  leftContainer: {
    backgroundColor:"#fe6d87",
    flex: 1,
    borderRadius: 35,
    height: 250, width: 200,
    padding:10,
    alignItems:'center',
    
  },
  rightContainer: {
    backgroundColor:"#05d09f",
    borderRadius: 35,
    flex: 1,
    height: 250, width: 200,
    padding:10,
    
    
  },
  smallContainer:{
    height: 250, width: 10,
  },
  textContainer:{
    width: 340,
    justifyContent: 'space-between',
    alignSelf:'center',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'transparent',
    padding:10,

  },
  bottomContainer:{
    backgroundColor:"#EEEEEE",
    borderRadius: 25,
    flex: 1,
    width: 340,
    alignSelf:'center',
    padding:10,
  },
  nutrientEle:{
    marginVertical:5,
  },
  
});