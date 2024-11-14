import {View, Text} from 'react-native'
import * as Progress from 'react-native-progress';


const NutrientItem = ({ item }: {item:any}) => {
    return(
        <View style={{marginVertical:5,}}>
        <Text style={{color:'white',marginBottom:5,}}>{item.name}: {item.value}g</Text>
        <Progress.Bar
            style={{alignSelf:'center'}}
            progress={item.value / item.total} // Assuming 100g is the target for protein
            width={145}
            height={10}
            color={'#fff'}
            borderRadius={5}
          />
        </View>
    );
  };

  export default NutrientItem


