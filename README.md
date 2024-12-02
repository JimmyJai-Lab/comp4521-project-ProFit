Generate API Key for USDA API here: https://fdc.nal.usda.gov/api-key-signup.html and update config/config.ts:
```ts
export const USDA_FOOD_API_KEY = 'YOUR_API_KEY';
```
or use the key "DEMO_KEY" for limited usage.

Exercise database (excel spreadsheet): https://strengthtoovercome.com/functional-fitness-exercise-database

Reference:
https://github.com/Kennygunderman/state-of-health-tracker

### Exercise Database API

The app uses the Wger Workout Manager API to fetch exercise data. 

#### API Details
- Base URL: https://wger.de/api/v2/
- Documentation: https://wger.de/api/v2/docs/
- Authentication: Not required for basic exercise data
- Rate Limits: No strict limits for basic usage

#### Features Used
- Exercise database with descriptions
- Exercise categories
- Equipment information
- Muscle groups targeted
- Exercise search functionality

#### Example Endpoints
- `/exercise/`: Get list of exercises
- `/exerciseinfo/`: Get detailed exercise information
- `/equipment/`: Get available equipment
- `/muscle/`: Get muscle information