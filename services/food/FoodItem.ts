export class Macros {
  protein: number;
  fat: number;
  carbs: number;

  constructor(protein: number, fat: number, carbs: number) {
    this.protein = protein;
    this.fat = fat;
    this.carbs = carbs;
  }
}

export default class FoodItem {
  name: string;
  servings: number;
  calories: number;
  macros: Macros;
  source: string;

  constructor(
    name: string,
    servings: number,
    calories: number,
    macros: Macros
  ) {
    this.name = name;
    this.servings = servings;
    this.calories = calories;
    this.macros = macros;
    this.source = "USDA";
  }
}
