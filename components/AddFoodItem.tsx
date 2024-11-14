import {View, Text, Image,TouchableOpacity} from 'react-native'
import * as Progress from 'react-native-progress';


const AddFoodItem = ({ item }: {item:any}) => {
    return(
        <View>
        <Image source={require('../assets/images/bur.jpg')} style={{height:100,width:100,borderRadius:20}}/>
        <Text>{item.name}</Text>
        <Text>{item.source}</Text>
        <Text>{item.cal}</Text>
        <TouchableOpacity> 
            <Text>+</Text>
        </TouchableOpacity>
        <Text>1</Text>
        <TouchableOpacity>
            <Text>-</Text>
        </TouchableOpacity>
        <TouchableOpacity> 
            <Text>Add</Text>
        </TouchableOpacity>
        </View>
    );
  };

  export default AddFoodItem


