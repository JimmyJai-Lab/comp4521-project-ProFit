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
  calories: number;
  macros: Macros;
  source: string;
  servingSize: number;
  servingSizeUnit: string;
  amount: number;
  date: Date;

  constructor(
    name: string,
    calories: number,
    macros: Macros,
    source: string,
    servringSize: number,
    servingSizeUnit: string,
    amount: number = 1,
    date: Date = new Date()
  ) {
    this.name = name;
    this.calories = calories;
    this.macros = macros;
    this.source = source;
    this.servingSize = servringSize
    this.servingSizeUnit = servingSizeUnit
    this.amount = amount;
    this.date = date;
  }
}
