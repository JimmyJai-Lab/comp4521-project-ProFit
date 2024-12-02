import { Text, View, StyleSheet, Button, ScrollView, TouchableOpacity, TextInput, Alert, Platform, SafeAreaView } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useEffect, useState } from 'react';
import NutrientItem from '@/components/NutrientItem';
import { router } from 'expo-router';
import FoodItem from '@/services/food/FoodItem';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function DietScreen() {
  const [protein, setProtein] = useState(80); // Example current intake
  const [carbs, setCarbs] = useState(150); // Example current intake
  const [fats, setFats] = useState(60); // Example current intake 

  const [targetCalories, setTargetCalories] = useState<number>(2500);
  const [currentCalories, setCurrentCalories] = useState<number>(1200);

  const [meals, setMeals] = useState<Array<FoodItem>>([]);
  const [mealsCache, setMealsCache] = useState<Map<string, FoodItem[]>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ));

  const confirmInput = (inputText: string) => {
    const numericValue = parseInt(inputText, 10);

    if (!isNaN(numericValue) && numericValue > 0) {
      setTargetCalories(numericValue);
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number');
    }
  };


  const updateMeals = async () => {
    console.log("Updating meals...");
    console.log("Selected date: ", selectedDate);

    if (mealsCache.has(selectedDate.toISOString())) {
      console.log("Using cache...");
      setMeals(mealsCache.get(selectedDate.toISOString()) as FoodItem[]);
      return;
    }

    console.log("Fetching from database...");
    // update from database
    var data;
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('food_logs')
        .where('date', '>=', selectedDate)
        .where('date', '<', new Date(selectedDate.getTime() + 86400000))
        .get();

      data = snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.log("Error getting documents: ", error);
    }

    if (data) {
      data = data.map(item => {
        const date = new Date(item.date.seconds * 1000 + item.date.nanoseconds / 1000000);
        return { ...item, date };
      });
      setMeals(data as FoodItem[]);

      setMealsCache(new Map(mealsCache.set(selectedDate.toISOString(), data as FoodItem[])));
    }
  }
  const updateCaloriesAndNutrients = () => {
    const totalCalories = meals.reduce((acc, meal) => acc + (meal.calories * (meal.amount ?? 1)), 0);
    const totalProtein = meals.reduce((acc, meal) => acc + (meal.macros.protein * (meal.amount ?? 1)), 0);
    const totalCarbs = meals.reduce((acc, meal) => acc + (meal.macros.carbs * (meal.amount ?? 1)), 0);
    const totalFats = meals.reduce((acc, meal) => acc + (meal.macros.fat * (meal.amount ?? 1)), 0);
    setCurrentCalories(totalCalories);
    setProtein(totalProtein);
    setCarbs(totalCarbs);
    setFats(totalFats);
  }

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('food_logs')
      .onSnapshot(() => {
        updateMeals();
      });

    return () => unsubscribe();
  }, [auth().currentUser?.uid]);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (!user) {
        setMealsCache(new Map());
        setMeals([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    updateMeals();
  }, []);

  useEffect(() => {
    updateCaloriesAndNutrients();
  }, [meals]);

  useEffect(() => {
    updateMeals();
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 30 }}
          daySelectionAnimation={{
            type: "border",
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: "white",
          }}
          style={{ height: 80, paddingTop: 5, paddingBottom: 5 }}
          calendarHeaderStyle={{ color: "white", fontSize: 15 }}
          calendarColor={"#7743CE"}
          dateNumberStyle={{ color: "white", fontSize: 10 }}
          dateNameStyle={{ color: "white", fontSize: 10 }}
          highlightDateNumberStyle={{ color: "yellow", fontSize: 10 }}
          highlightDateNameStyle={{ color: "yellow", fontSize: 10 }}
          disabledDateNameStyle={{ color: "grey", fontSize: 10 }}
          disabledDateNumberStyle={{ color: "grey", fontSize: 10 }}
          iconContainer={{ flex: 0.1, fontSize: 10 }}
          selectedDate={new Date()}
          onDateSelected={(date) => {
            const adjustedDate = new Date(
              date.toDate().getTime() - 12 * 60 * 60 * 1000
            );
            setSelectedDate(adjustedDate);
          }}
        />

        {/* Middle part with two containers */}
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.middleContainer}>
            {/* Left Container */}
            <View style={styles.leftContainer}>
              <View>
                <Text
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    fontSize: 19,
                    paddingTop: 5,
                    paddingBottom: 10,
                    color: "#f1f0f0",
                    fontWeight: "bold",
                  }}
                >
                  Today's Calories
                </Text>

                {/* Progress bar for calories */}
                <AnimatedCircularProgress
                  style={{ alignSelf: "center" }}
                  size={120}
                  width={15}
                  fill={(currentCalories / targetCalories) * 100}
                  tintColor={
                    currentCalories < targetCalories ? "#4B4376" : "#D91656"
                  }
                  backgroundColor="#E8BCB9"
                  rotation={0}
                >
                  {(fill) => (
                    <>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          color: "white",
                        }}
                      >
                        {currentCalories}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          color: "white",
                        }}
                      >
                        /
                      </Text>
                      <TextInput
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          color: "white",
                        }}
                        onSubmitEditing={(e) => {
                          confirmInput(e.nativeEvent.text);
                        }}
                        keyboardType="numeric"
                      >
                        {targetCalories}
                      </TextInput>
                    </>
                  )}
                </AnimatedCircularProgress>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    color: "white",
                    fontStyle: "italic",
                    paddingTop: 10,
                  }}
                >
                  You have ...
                </Text>
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {targetCalories - currentCalories > 0
                    ? `${targetCalories - currentCalories} calories left!`
                    : `${Math.abs(
                      currentCalories - targetCalories
                    )} calories exceed!`}
                </Text>
              </View>
            </View>
            <View style={styles.smallContainer}></View>

            {/* Right Container */}

            <View style={styles.rightContainer}>
              <ScrollView nestedScrollEnabled={true}>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Micro-Nutrients
                </Text>
                <NutrientItem
                  item={{
                    name: "Protein",
                    value: protein.toFixed(1),
                    total: 60,
                  }}
                />
                <NutrientItem
                  item={{ name: "Carbs", value: carbs.toFixed(1), total: 250 }}
                />
                <NutrientItem
                  item={{ name: "Fats", value: fats.toFixed(1), total: 60 }}
                />
              </ScrollView>
            </View>
          </View>

          {/* ADD MEAL PART */}
          <View style={styles.textContainer}>
            <Text
              style={{
                color: "#1c438b",
                fontWeight: "bold",
                fontSize: 20,
                alignSelf: "center",
              }}
            >
              Today's Meal
            </Text>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.navigate("/addmeal")}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, color: "white" }}
                >
                  Add Meal
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* breakfast Container */}
          <View style={styles.bottomContainer}>
            <Text style={{ fontWeight: 200, fontSize: 15, fontStyle: "italic" }}>
              Breakfast
            </Text>
            {meals
              .filter((meal) => meal.time == "Breakfast")
              .map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 0,

                    backgroundColor: "transparent",
                    borderRadius: 10,
                  }}
                >
                  <View style={styles.mealcontainer}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: "bold",
                          fontSize: 15,
                          color: "#640D5F",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: 300,
                          color: "black",
                          backgroundColor: "transparent",
                          width: 180,
                        }}
                      >
                        From: {item.source}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: 300,
                          color: "black",
                        }}
                      >
                        Serving: {item.servingSize.toFixed(1)} {item.servingSizeUnit} * {item.amount}
                      </Text>
                    </View>
                    <View style={styles.rightcontainer}>
                      <FontAwesome5 name="fire-alt" size={24} color="#D91656" />
                      <View
                        style={{
                          width: 70,
                          height: 25,
                          justifyContent: "center",
                          paddingLeft: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlignVertical: "center",
                            textAlign: "center",
                            fontSize: 17,
                          }}
                        >
                          {item.calories * item.amount} cal
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

            <Text style={{ fontWeight: 200, fontSize: 15, fontStyle: "italic" }}>
              Lunch
            </Text>
            {meals
              .filter((meal) => meal.time == "Lunch")
              .map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 0,

                    backgroundColor: "transparent",
                    borderRadius: 10,
                  }}
                >
                  <View style={styles.mealcontainer}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: "bold",
                          fontSize: 15,
                          color: "#640D5F",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: 300,
                          color: "black",
                          backgroundColor: "transparent",
                          width: 180,
                        }}
                      >
                        From: {item.source}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: 300,
                          color: "black",
                        }}
                      >
                        Serving: {item.servingSize.toFixed(1)} {item.servingSizeUnit} * {item.amount}
                      </Text>
                    </View>
                    <View style={styles.rightcontainer}>
                      <FontAwesome5 name="fire-alt" size={24} color="#D91656" />
                      <View
                        style={{
                          width: 70,
                          height: 25,
                          justifyContent: "center",
                          paddingLeft: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlignVertical: "center",
                            textAlign: "center",
                            fontSize: 17,
                          }}
                        >
                          {item.calories * item.amount} cal
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

            <Text style={{ fontWeight: 200, fontSize: 15, fontStyle: "italic" }}>
              Dinner
            </Text>
            {meals
              .filter((meal) => meal.time == "Dinner")
              .map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 0,

                    backgroundColor: "transparent",
                    borderRadius: 10,
                  }}
                >
                  <View style={styles.mealcontainer}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: "bold",
                          fontSize: 15,
                          color: "#640D5F",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: 300,
                          color: "black",
                          backgroundColor: "transparent",
                          width: 180,
                        }}
                      >
                        From: {item.source}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontWeight: 300,
                          color: "black",
                        }}
                      >
                        Serving: {item.servingSize.toFixed(1)} {item.servingSizeUnit} * {item.amount}
                      </Text>
                    </View>
                    <View style={styles.rightcontainer}>
                      <FontAwesome5 name="fire-alt" size={24} color="#D91656" />
                      <View
                        style={{
                          width: 70,
                          height: 25,
                          justifyContent: "center",
                          paddingLeft: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlignVertical: "center",
                            textAlign: "center",
                            fontSize: 17,
                          }}
                        >
                          {item.calories * item.amount} cal
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#ffc332',
    borderRadius: 15,
    paddingHorizontal: 15,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
  },
  smallbutton: {
    backgroundColor: '#ffc332',
    borderRadius: 15,
    paddingHorizontal: 15,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
    marginHorizontal: 3,
    fontSize: 1
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,

  },
  leftContainer: {
    backgroundColor: "#fe6d87",
    flex: 1,
    borderRadius: 35,
    height: 250, width: 200,
    padding: 10,
    alignItems: 'center',

  },
  rightContainer: {
    backgroundColor: "#05d09f",
    borderRadius: 35,
    flex: 1,
    height: 250, width: 200,
    padding: 10,


  },
  smallContainer: {
    height: 250, width: 10,
  },
  textContainer: {
    width: 340,
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 10,

  },
  bottomContainer: {
    backgroundColor: "#EEEEEE",
    borderRadius: 25,
    flex: 1,
    width: 340,
    alignSelf: 'center',
    padding: 10,
  },
  nutrientEle: {
    marginVertical: 5,
  },
  mealcontainer: {
    backgroundColor: '#cfcfce',
    width: 325,
    height: "100%",
    flex: 1,
    borderRadius: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginVertical: 5,
    alignItems: 'center'
  },
  rightcontainer: {
    flexDirection: 'row',
    backgroundColor: '#adbbd5',
    borderRadius: 20,
    width: 110,
    height: 50,
    paddingLeft: 10,
    alignItems: 'center',

  },
  safeArea: {
    flex: 1,
    backgroundColor: '#7743CE', // Same as calendarColor
  },
});