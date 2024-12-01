import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { useState } from 'react';
import foodSearchService from '@/services/food/FoodSearch';
import FoodItem from '@/services/food/FoodItem';
import AddFoodItem from '@/components/AddFoodItem';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function MealAPI() {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customFoodItems, setCustomFoodItems] = useState<Array<FoodItem>>([]);
  const [commonFoodItems, setCommonFoodItems] = useState<Array<FoodItem>>([]);
  const [brandedFoodItems, setBrandedFoodItems] = useState<Array<FoodItem>>([]);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const searchFood = async (searchQuery: string) => {
    setIsLoading(true);

    var currentUserCustomFoodItems;
    try {
      currentUserCustomFoodItems = await firestore()
        .collection("users")
        .doc(auth().currentUser?.uid)
        .collection("custom_foods")
        .where("name", "==", searchQuery)
        .limit(4)
        .get()
    } catch (error) {
      console.error("Error fetching custom food items: ", error);
    }

    // setCustomFoodItems(snapshot.docs.map((doc) => doc.data() as FoodItem));

    var usersCustomFoodItems;
    try {
      usersCustomFoodItems = await firestore()
        .collection("custom_foods_from_users")
        .where("name", "==", searchQuery)
        .where("source", "!=", auth().currentUser?.displayName)
        .limit(4)
        .get()
    } catch (error) {
      console.error("Error fetching custom food items from users: ", error);
    }

    const customFoodItems = currentUserCustomFoodItems ? currentUserCustomFoodItems.docs.map((doc) => doc.data() as FoodItem) : [];
    const usersCustomFoodItemsData = usersCustomFoodItems ? usersCustomFoodItems.docs.map((doc) => doc.data() as FoodItem) : [];
    setCustomFoodItems(customFoodItems.concat(usersCustomFoodItemsData));


    setCommonFoodItems(await foodSearchService.searchCommonFoods(searchQuery, 8));
    setBrandedFoodItems(await foodSearchService.searchBrandedFoods(searchQuery, 8));
    setIsLoading(false);
  }

  return (
    <View>
      <SearchBar
        placeholder="Search for Previous Foods Here ..."
        onChangeText={updateSearch}
        value={search}
        lightTheme={true}
        inputContainerStyle={{ height: 10, backgroundColor: "#d1d0d0" }}
        containerStyle={{ minHeight: 0, height: 47 }}
        inputStyle={{
          minHeight: 0,
          fontSize: 10,
        }}
        onSubmitEditing={() => searchFood(search)}
      />
      {isLoading ? (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size='large' />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.usercontainer}>
          <Text style={{margin:15,marginBottom:0,fontSize:20,fontStyle:'italic',fontWeight:'bold',color:'#B03052'}}>From users:</Text>
          {customFoodItems.map((item, index) => {
            return <AddFoodItem key={`custom-${index}`} item={item} />;
          })}
          </View>
          <View style={styles.fnddcontainer}>
          <Text style={{margin:15,marginBottom:0,fontSize:20,fontStyle:'italic',fontWeight:'bold',color:'#B03052'}}>From FNDDS (Common food item):</Text>
          {commonFoodItems.map((item, index) => {
            return <AddFoodItem key={`common-${index}`} item={item} />;
          })}
          </View>
          <View style={styles.brandcontainer}>
          <Text style={{margin:15,marginBottom:0,fontSize:20,fontStyle:'italic',fontWeight:'bold',color:'#B03052'}}>Branded:</Text>
          {brandedFoodItems.map((item, index) => {
            return <AddFoodItem key={`branded-${index}`} item={item} />;
          })}
          </View>
        </ScrollView>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
  usercontainer:{
    minHeight:200,
    backgroundColor:'#afbdd6',
    borderRadius:30,
    margin:10,
    flex:1
  },
  fnddcontainer:{
    minHeight:200,
    backgroundColor:'#afbdd6',
    borderRadius:30,
    margin:10,
    flex:1

  },
  brandcontainer:{
    minHeight:200,
    backgroundColor:'#afbdd6',
    borderRadius:30,
    margin:10,
    flex:1,
    marginBottom:60
  },
});