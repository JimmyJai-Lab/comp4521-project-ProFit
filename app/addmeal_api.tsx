import { ScrollView, View, StyleSheet } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { useState } from 'react';
import foodSearchService from '@/services/food/FoodSearch';
import FoodItem from '@/services/food/FoodItem';
import AddFoodItem from '@/components/AddFoodItem';

export default function MealAPI() {
  const [search, setSearch] = useState('');
  const [foodItems, setFoodItems] = useState<Array<FoodItem>>([]);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const searchFood = async (searchQuery: string) => {
    const foodItems = await foodSearchService.searchBrandedFoods(searchQuery, 10);
    setFoodItems(foodItems);
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
      <ScrollView>
        {foodItems.map((item, index) => (
          <AddFoodItem key={index} item={item} />
        ))}
      </ScrollView>
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