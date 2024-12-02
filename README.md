## How to build?
1. `npm install`
2. Update app.json
3. Set up firebase with google services files
4. `npx expo prebuild --clean` (good luck)
5. `npx expo run:ios` or `npx expo run:android` (good luck)

Tutorial: https://youtu.be/BsOik6ycGqk?si=ZLln-J4Qlf7B86r2 (setup & configuration, firebase project setup)

## APIs
Generate API Key for USDA API here: https://fdc.nal.usda.gov/api-key-signup.html and update config/config.ts:
```ts
export const USDA_FOOD_API_KEY = 'YOUR_API_KEY';
```
or use the key "DEMO_KEY" for limited usage.


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