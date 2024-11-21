import {View, Text, Image,TouchableOpacity,StyleSheet} from 'react-native'
import { TextInput } from "react-native-paper";
import DATA from '../app/(tabs)/fitness';
import * as Progress from 'react-native-progress';
import * as React from 'react';

const AddExercise = ({ item }: {item:any}) => {
    const [rep, setRep] = React.useState('');
    const [set, setSet] = React.useState('');
    const [weight, setWeight] = React.useState('');
    return(
        <View style={styles.container}>
        
        <Image source={item.image} style={{height:80,width:80,borderRadius:20,margin:5}}/>
        
        <View style={{width:80,backgroundColor:'transparent',height:100}}>
            <Text style={{fontSize:20, color:'#1c438b',fontWeight:'bold', paddingTop: 10}}>{item.name}</Text>
        {/* <Text style={{fontWeight:'bold',fontSize:20,color:'#1c438b',marginVertical:5}}>{item.cal} Cals</Text> */}
        </View>

        <View style={{backgroundColor:'transparent',width:180,marginLeft:5}}>
        <View style={{alignSelf:'center',flexDirection:'row',width:180}}>
            <TextInput
                mode='outlined'
                label="Rep"
                value={rep}
                onChangeText={setRep}
                style={{flex: 1}}
            />
            <TextInput
                mode='outlined'
                label="Set"
                value={set}
                onChangeText={setSet}
                style={{flex: 1}}
            />
            <TextInput
                mode='outlined'
                label="Kg"
                value={weight}
                onChangeText={setWeight}
                style={{flex: 1}}
            />
        </View>

        <TouchableOpacity style= {{backgroundColor: '#75E6DA', borderRadius: 20, height: 40, width: 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}} 
            onPress={() => {
                console.log("testing")
            }}
        >
            <Text style={{fontWeight:'bold',fontSize:20,color: 'black',padding:4}}>Add</Text>
        </TouchableOpacity>
        </View>

        </View>
    );
  };

  export default AddExercise


const styles = StyleSheet.create({
    container: {
        height:120,
        width:360,
        backgroundColor: 'white',
        margin:10,
        borderRadius:15,
        alignItems:'center',
        flexDirection:'row',
        alignSelf:'center'
      },

})

