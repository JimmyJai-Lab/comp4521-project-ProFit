import { useEffect, useState } from 'react';
import { Text, View, StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import { SearchBar } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddFoodItem from '@/components/AddFoodItem';
import { router } from 'expo-router';
import FoodItem from '@/services/food/FoodItem';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function CommunityScreen() {
  //const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [search, setSearch] = useState('');
  const [recentFoods, setRecentFoods] = useState<Array<FoodItem>>([]);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const updateRecentFoods = async () => {
    const snapshot = await firestore()
      .collection("users")
      .doc(auth().currentUser?.uid)
      .collection("recent_foods")
      .orderBy("date", "desc")
      .get();
    const foods = snapshot.docs.map((doc) => doc.data() as FoodItem);
    setRecentFoods(foods);
  }

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser?.uid)
      .collection("food_logs")
      .onSnapshot(() => {
        updateRecentFoods();
      });

    return () => unsubscribe();
  }, []);
    
  return (
    <View>
      {/* Search Bar*/}
      {/* <SearchBar
        placeholder="Search for Previous Foods Here ..."
        onChangeText={updateSearch}
        value={search}
        lightTheme={true}
        inputContainerStyle={{height:10,backgroundColor:'#d1d0d0'}}
        containerStyle={{minHeight:0,height:47}}
        inputStyle={{
          minHeight: 0,
          fontSize:10          
        }}
      /> */}

      {/* Middle Buttons*/}
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        {/* Left Buttons*/}
        <TouchableOpacity style={styles.functionBox}
        onPress={() => router.navigate("/addcustom")}
        >
          <MaterialCommunityIcons
            name="food"
            size={60}
            color="black"
            style={{ flex: 1, alignSelf: "center", paddingLeft: 10 }}
          />
          <Text
            style={{
              fontSize: 18,
              color: "white",
              flex: 1,
              alignSelf: "center",
              fontWeight: "bold"
            }}
          >
            Add Custom Item
          </Text>
        </TouchableOpacity>

        {/* Right Buttons*/}
        <TouchableOpacity
          style={styles.functionBox}
          onPress={() => router.navigate("/addmeal_api")}
        >
          <MaterialIcons
            name="search"
            size={60}
            color="black"
            style={{ flex: 1, alignSelf: "center", paddingLeft: 10 }}
          />
          <Text
            style={{
              fontSize: 18,
              color: "white",
              flex: 1,
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Search Item
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom History*/}
      <Text
        style={{
          fontWeight: 100,
          fontStyle: "italic",
          paddingHorizontal: 10,
          paddingTop: 20,
        }}
      >
        Previous added items
      </Text>
      <ScrollView style={styles.bottomContainer}>
        {recentFoods.map((item, index) => {
          return <AddFoodItem key={`recent-${index}`} item={item} />;
        })}
      </ScrollView>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
  functionBox:{
    backgroundColor:'#fe6d87',
    height:90,
    width:170,
    marginTop:15,
    marginHorizontal:10,
    borderRadius:20,
    flexDirection:'row',
    alignContent:'center',     
  },
  bottomContainer:{
    backgroundColor:'#afbdd6',
    height:500,
    width:350,
    alignSelf:'center',
    borderRadius:20,
  },
});

