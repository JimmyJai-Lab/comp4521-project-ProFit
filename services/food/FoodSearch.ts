import axios from "axios";
import FoodItem, { Macros } from "./FoodItem";
import { USDA_FOOD_API_KEY } from "../../config/config";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

interface IFoodSearchService {
  searchBrandedFoods: (
    searchQuery: string,
    numToLoad: number
  ) => Promise<Array<FoodItem>>;
  searchCommonFoods: (
    searchQuery: string,
    numToLoad: number
  ) => Promise<Array<FoodItem>>;
}

class FoodSearchService {
  async searchBrandedFoods(
    searchQuery: string,
    numToLoad: number
  ): Promise<Array<FoodItem>> {
    const options = {
      method: "GET",
      url: `${USDA_BASE_URL}/foods/search`,
      params: {
        query: searchQuery,
        dataType: "Branded",
        pageSize: numToLoad,
        pageNumber: 1,
        sortBy: "dataType.keyword",
        sortOrder: "asc",
        api_key: USDA_FOOD_API_KEY,
      },
    };

    try {
      const res = await axios.request(options);
      const foodItems = res.data.foods.map((food: any) => {
        return new FoodItem(
          food.description,
          food.foodNutrients[3].value,
          new Macros(
            food.foodNutrients[0].value,
            food.foodNutrients[1].value,
            food.foodNutrients[2].value
          ),
          food.dataType,
          food.servingSize,
          food.servingSizeUnit
        );
      });
  
      return foodItems;
    } catch (error) {
      console.error("Failed to fetch branded foods:", error);
      return [];
    }
  }

  async searchCommonFoods(
    searchQuery: string,
    numToLoad: number
  ): Promise<Array<FoodItem>> {
    const options = {
      method: "GET",
      url: `${USDA_BASE_URL}/foods/search`,
      params: {
        query: searchQuery,
        dataType: "Survey (FNDDS)",
        pageSize: numToLoad,
        pageNumber: 1,
        sortBy: "dataType.keyword",
        sortOrder: "asc",
        api_key: USDA_FOOD_API_KEY,
      },
    };

    try {
    const res = await axios.request(options);
    const foodItems = res.data.foods.map((food: any) => {
      const description = food.description || "Unknown";
      const calories = food.foodNutrients?.[3]?.value || 0;
      const protein = food.foodNutrients?.[0]?.value || 0;
      const fat = food.foodNutrients?.[1]?.value || 0;
      const carbs = food.foodNutrients?.[2]?.value || 0;
      const dataType = food.dataType || "Unknown";
      const servingSize = 100;
      const servingSizeUnit = "g";

      return new FoodItem(
        description,
        calories,
        new Macros(protein, fat, carbs),
        dataType,
        servingSize,
        servingSizeUnit
      );
    });

    return foodItems;
    } catch (error) {
      console.error("Failed to fetch common foods:", error);
      return [];
    }
  }
}

const foodSearchService = new FoodSearchService() as IFoodSearchService;
export default foodSearchService;
