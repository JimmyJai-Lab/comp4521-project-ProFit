import axios from "axios";
import FoodItem, { Macros } from "./FoodItem";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const USDA_FOOD_API_KEY = "DEMO_KEY";

interface IFoodSearchService {
  searchBrandedFoods: (
    searchQuery: string,
    numToLoad: number,
    // onFetched: (foods: FoodItem[]) => void
  ) => Promise<Array<FoodItem>>;
}

class FoodSearchService {

  async searchBrandedFoods(
    searchQuery: string,
    numToLoad: number,
    // onFetched: (foods: any) => void
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

    const res = await axios.request(options);
    console.log(res.data.foods[0].fdcId);
    console.log(res.data.foods[1].fdcId);

    console.log(res.data.foods[0].description);
    console.log(res.data.foods[0].servingSize);
    console.log(res.data.foods[0].foodNutrients[0].value);
    console.log(res.data.foods[0].foodNutrients[1].value);
    console.log(res.data.foods[0].foodNutrients[2].value);
    console.log(res.data.foods[0].foodNutrients[3].value);
    console.log(res.data.foods[0].foodNutrients[0].nutrientName);
    console.log(res.data.foods[0].foodNutrients[1].nutrientName);
    console.log(res.data.foods[0].foodNutrients[2].nutrientName);
    console.log(res.data.foods[0].foodNutrients[3].nutrientName);

    const foodItems = res.data.foods.map((food: any) => {
        return new FoodItem(
            food.description,
            food.servingSize,
            food.foodNutrients[0].value,
            new Macros(
                food.foodNutrients[0].value,
                food.foodNutrients[1].value,
                food.foodNutrients[2].value
            )
        );
    });


    
    return foodItems;
  }
}

const foodSearchService = new FoodSearchService() as IFoodSearchService;
export default foodSearchService;