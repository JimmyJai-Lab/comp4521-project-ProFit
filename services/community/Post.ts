import FoodItem from "../food/FoodItem";

// Add Exercise and Template interfaces
interface Exercise {
    id: string;
    exerciseId: number;
    name: string;
    weight: number;
    sets: number;
    reps: number;
    date: string;
    completedSets: number;
}

interface Template {
    name: string;
    exercises: Exercise[];
    timestamp: Date;
}

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
    templates: Array<Template>;
}