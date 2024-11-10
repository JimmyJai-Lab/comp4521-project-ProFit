const EXERCISE_BASE_URL = "https://api.api-ninjas.com/v1/exercises";

interface IExerciseSearchService {
  searchExercises: (
    searchQuery: string,
    numToLoad: number
  ) => Promise<Array<Exercise>>;
}