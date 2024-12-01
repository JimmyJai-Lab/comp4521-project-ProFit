import {View, Text, TextInput, Alert} from 'react-native'
import * as Progress from 'react-native-progress';
import { useEffect, useState } from 'react';



const NutrientItem = ({ item }: {item:any}) => {
    const [TotalNutrient, setTargetProtein] = useState<number>(item.total);

    const confirmInput_nutrient = (inputText: string) => {
      const numericValue = parseInt(inputText, 10);
    
      if (!isNaN(numericValue) && numericValue > 0) {
        setTargetProtein(numericValue);       // Set target calories
        // setInputValue('');               // Reset input value to blank
      } else {
        Alert.alert('Invalid Input', 'Please enter a valid number');
      }
    };
    return(
        <View style={{marginVertical:5,}}>
        <View style={{flexDirection:'row'}}>
        <Text style={{color:'white',marginBottom:5,}}>{item.name}: {item.value}g / </Text>
        <TextInput style={{color:'white',marginBottom:5,}}
          onSubmitEditing={(e) => {
            confirmInput_nutrient(e.nativeEvent.text);
          }}
          keyboardType="numeric"
        >
        {TotalNutrient}
        </TextInput>
        <Text style={{color:'white',marginBottom:5,}}>g</Text>
        </View>
        <Progress.Bar
            style={{alignSelf:'center'}}
            progress={item.value/TotalNutrient} // Assuming 100g is the target for protein
            width={145}
            height={10}
            color={'#fff'}
            borderRadius={5}
          /> 
        </View>
    );
  };

  export default NutrientItem


