import FoodItem from "../food/FoodItem";

export default interface Post {
    id: string;
    content: string;
    date: Date;
    uid: string;
    username: string;
    likes: number;
    comments: Array<String>;
    foodItems: Array<FoodItem>;
    liked: boolean;
}