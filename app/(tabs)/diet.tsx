import { Text, View, StyleSheet, Button,ScrollView,TouchableOpacity,TextInput,Alert,Platform } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useEffect, useState } from 'react';
import NutrientItem from '@/components/NutrientItem';
import { router } from 'expo-router';
import FoodItem from '@/services/food/FoodItem';
import firestore from '@react-native-firebase/firestore';

export default function DietScreen() {
  //const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  // Micro-nutrients state
  const [protein, setProtein] = useState(80); // Example current intake
  const [carbs, setCarbs] = useState(150); // Example current intake
  const [fats, setFats] = useState(60); // Example current intake 
  
  const [calories, setCalories] = useState<number | null>(2500);
  const [inputValue, setInputValue] = useState<string>(''); // Temporary storage for input
  const [currentCalories, setCurrentCalories] = useState<number>(1200);
  const [caloriesLeft, setCaloriesLeft] = useState<number >(0);

  const [meals, setMeals] = useState<Array<FoodItem>>([]);

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

  const updateMeals = async () => {
    console.log("Updating meals...");
    // update from database
    var users;
    try {
      users = await firestore().collection("food_logs").get();
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    console.log(users?.docs);
    
    // updateCaloriesAndNutrients();
  }

  const updateCaloriesAndNutrients = () => {
    const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
    const totalProtein = meals.reduce((acc, meal) => acc + meal.macros.protein, 0);
    const totalCarbs = meals.reduce((acc, meal) => acc + meal.macros.carbs, 0);
    const totalFats = meals.reduce((acc, meal) => acc + meal.macros.fat, 0);
    setCurrentCalories(totalCalories);
    setProtein(totalProtein);
    setCarbs(totalCarbs);
    setFats(totalFats);
  }

  return (
    <View style={styles.container}>
      <CalendarStrip
        calendarAnimation={{type: 'sequence', duration: 30}}
        daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white'}}
        style={{height: 100, paddingTop: 30, paddingBottom: 10}}
        calendarHeaderStyle={{color: 'white',fontSize:10}}
        calendarColor={'#7743CE'}
        dateNumberStyle={{color: 'white',fontSize:10}}
        dateNameStyle={{color: 'white',fontSize:10}}
        highlightDateNumberStyle={{color: 'yellow',fontSize:10}}
        highlightDateNameStyle={{color: 'yellow',fontSize:10}}
        disabledDateNameStyle={{color: 'grey',fontSize:10}}
        disabledDateNumberStyle={{color: 'grey',fontSize:10}}
        iconContainer={{flex: 0.1,fontSize:10}}
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
          <NutrientItem item={{name:'Protein',value:protein,total:150,}} />
          <NutrientItem item={{name:'Carbs',value:carbs,total:100,}} />
          <NutrientItem item={{name:'Fats',value:fats,total:80,}} />
          
          </ScrollView>
        </View>
      </View>

      {/* ADD MEAL PART */}
      <View style={styles.textContainer}>
        <Text style={{color:'#1c438b',fontWeight:'bold',fontSize:20,alignSelf:'center'}}>Today's Meal</Text>
        <View >
          <TouchableOpacity style={styles.button } onPress={() => router.navigate('/addmeal')}>
            <Text style={{fontWeight:'bold',fontSize:15,color: 'white',}}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
      

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <Text style={{fontWeight:200,fontSize: 15,marginBottom: 10,}}>Breakfast</Text>
        {}
        <Text style={{fontWeight:200,fontSize: 15,marginTop: 10,marginBottom: 10,}}>Lunch</Text>

        <Text style={{fontWeight:200,fontSize: 15,marginTop: 10,marginBottom: 10,}}>Dinner</Text>

      </View>
        
      <Button title='fetch' onPress={updateMeals}></Button>
      <Button title='add' onPress={async () => {
        const foodItem = {
          name: 'test',
          calories: 100,
          macros: {
            protein: 10,
            carbs: 20,
            fat: 5,
          },
        };
        await firestore().collection("food_logs").add(foodItem);
      }}></Button>

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