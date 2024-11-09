import FoodSearchService from "@/services/foodapi";
import FoodItem from "@/services/FoodItem";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

export default function Index() {
  const [searchText, setSearchText] = useState("");
  const [foodItems, setFoodItems] = useState<Array<FoodItem>>([]);

  // FoodSearchService.searchBrandedFoods()
  const fetchFoodItems = async () => {
    const foodItems = await FoodSearchService.searchBrandedFoods(searchText, 10);
    setFoodItems(foodItems);
  }

  return (
    <ScrollView>
      <TextInput placeholder="Search food" onChangeText={setSearchText} />
      <Button title="fetch food items" onPress={fetchFoodItems} />
      {Array.isArray(foodItems) && foodItems.map((foodItem: FoodItem) => {
        return (
          <View>
            <Text>Name: {foodItem.name}</Text>
            <Text>Servings: {foodItem.servings}</Text>
            <Text>Calories: {foodItem.calories}</Text>
            <Text>Carbs: {foodItem.macros.carbs}</Text>
            <Text>Fat: {foodItem.macros.fat}</Text>
            <Text>Protein: {foodItem.macros.protein}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
