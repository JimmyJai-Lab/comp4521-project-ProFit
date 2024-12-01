import { ScrollView, View, StyleSheet, Text } from 'react-native';
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

    const snapshot = await firestore()
      .collection("users")
      .doc(auth().currentUser?.uid)
      .collection("custom_foods")
      .where("name", "==", searchQuery)
      .get()

    setCustomFoodItems(snapshot.docs.map((doc) => doc.data() as FoodItem));


    setCommonFoodItems(await foodSearchService.searchCommonFoods(searchQuery, 5));
    setBrandedFoodItems(await foodSearchService.searchBrandedFoods(searchQuery, 5));
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
        <Text style={styles.text}>Loading...</Text>
      ) : (
        <ScrollView>
          <Text style={styles.text}>Users':</Text>
          {customFoodItems.map((item, index) => {
            return <AddFoodItem key={`custom-${index}`} item={item} />;
          })}
          <Text style={styles.text}>FNDDS (Common food item):</Text>
          {commonFoodItems.map((item, index) => {
            return <AddFoodItem key={`common-${index}`} item={item} />;
          })}
          <Text style={styles.text}>Branded:</Text>
          {brandedFoodItems.map((item, index) => {
            return <AddFoodItem key={`branded-${index}`} item={item} />;
          })}
        </ScrollView>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
});