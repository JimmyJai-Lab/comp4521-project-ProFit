import axios from 'axios';

export interface Exercise {
    id: number;
    name: string;
    description: string;
    category: number;
    muscles: number[];
    equipment: number[];
}

class WgerExerciseService {
    private BASE_URL = "https://wger.de/api/v2";

    async searchExercises(searchQuery: string): Promise<Exercise[]> {
        try {
            const response = await axios.get(`${this.BASE_URL}/exercise/search`, {
                params: {
                    term: searchQuery,
                    language: 2 // English
                }
            });

            return response.data.suggestions.map((exercise: any) => ({
                id: exercise.data.id,
                name: exercise.value,
                description: exercise.data.description || '',
                category: exercise.data.category,
                muscles: exercise.data.muscles || [],
                equipment: exercise.data.equipment || []
            }));
        } catch (error) {
            console.error('Error searching exercises:', error);
            return [];
        }
    }

    async getExerciseDetails(id: number): Promise<Exercise | null> {
        try {
            const response = await axios.get(`${this.BASE_URL}/exercise/${id}`);
            return {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                category: response.data.category,
                muscles: response.data.muscles,
                equipment: response.data.equipment
            };
        } catch (error) {
            console.error('Error getting exercise details:', error);
            return null;
        }
    }
}

export const wgerExerciseService = new WgerExerciseService(); 