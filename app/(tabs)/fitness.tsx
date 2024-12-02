import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import * as React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { FlashList } from "@shopify/flash-list";
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import email from './fitness';
import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
interface Exercises {
  id: number;
  name: string;
  weight: number;
  set: number;
  rep: number;
  image: URL;
  checked: boolean;
}


export default function FitnessScreen() {
  const [minutes] = React.useState<number>(0);
  const [average_minutes] = React.useState<number>(0);
  const [num_of_sets] = React.useState<number>(0);
  const [volume] = React.useState<number>(0);
  const DATA = [
    {
      id: 0,
      name: "chest press",
      weight: 40,
      set: 4,
      rep: 10,
      image: require("../../assets/images/chest press.webp"),
      checked: false,
    },
    {
      id: 1,
      name: "shoulder press",
      weight: 20,
      set: 4,
      rep: 8,
      image: require("../../assets/images/shoulder press.jpg"),
      checked: false,
    },
    {
      id: 2,
      name: "lateral raise",
      weight: 10,
      set: 4,
      rep: 8,
      image: require("../../assets/images/lateral raise.webp"),
      checked: false,
    },
    {
      id: 3,
      name: "chest butterfly",
      weight: 30,
      set: 4,
      rep: 10,
      image: require("../../assets/images/chest butterfly.webp"),
      checked: false,
    },
  ];
  const [isChecked, setChecked] = React.useState(DATA);

  const handleChange = (id: any) => {
    //alert(Object.values(isChecked[id]));
    let temp = isChecked.map((product) => {
      if (id === product.id) {
        return { ...product, checked: !product.checked };
      }
      return product;
    });
    setChecked(temp);
  };
  // const Item = ({data}: {data: Exercises}) => (
  //   <View
  //   style={{
  //     backgroundColor: '#eeeeee',
  //     borderRadius: 10,
  //     padding: 20,
  //     marginVertical: 8,
  //     marginHorizontal: 16,
  //   }}>
  //     <Text style={{fontSize: 24}}>{data.name}</Text>
  //   </View>
  // )
  const renderItem = ({ item }: { item: Exercises }) => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
      }}>
        <Image
          source={item.image}
          style={{
            height: 60,
            width: 60,
            borderRadius: 5
          }}
        />
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: "#808080" }}>Weight: {String(item.weight)} kg</Text>
          </View>
          <Text style={{ color: "#808080", marginTop: 5 }}>
            Volume: {String(item.set)} sets x {String(item.rep)} reps
          </Text>
        </View>
        <Checkbox
          style={{ margin: 10 }}
          value={isChecked[item.id].checked}
          onValueChange={() => { handleChange(item.id); }}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <CalendarStrip
        calendarAnimation={{ type: 'sequence', duration: 30 }}
        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
        style={{ height: 80, paddingTop: 20, paddingBottom: 10 }}
        calendarHeaderStyle={{ color: 'white', fontSize: 10 }}
        calendarColor={'#7743CE'}
        dateNumberStyle={{ color: 'white', fontSize: 10 }}
        dateNameStyle={{ color: 'white', fontSize: 10 }}
        highlightDateNumberStyle={{ color: 'yellow', fontSize: 10 }}
        highlightDateNameStyle={{ color: 'yellow', fontSize: 10 }}
        disabledDateNameStyle={{ color: 'grey', fontSize: 10 }}
        disabledDateNumberStyle={{ color: 'grey', fontSize: 10 }}
        iconContainer={{ flex: 0.1, fontSize: 10 }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summarycontainer}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Summary</Text>
          </View>
          <View style={{ paddingLeft: 40 }}>
            <Text style={styles.heading}>Duration</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={{ paddingHorizontal: 40, fontSize: 25, color: 'white', fontWeight: 'bold' }}>{minutes}</Text>
            </View>
            <View>
              <Text style={styles.text}>mins</Text>
            </View>
            <View>
              <Text style={{ paddingHorizontal: 30, fontSize: 25, color: 'white', fontWeight: 'bold' }}>{average_minutes}</Text>
            </View>
            <View>
              <Text style={styles.text}>mins daily average</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <View >
                <Text style={[styles.heading, { paddingLeft: 40 }]}>Set</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text style={{ paddingHorizontal: 40, fontSize: 25, color: 'white', fontWeight: 'bold' }}>{num_of_sets}</Text>
                </View>
                <View>
                  <Text style={styles.text}>sets</Text>
                </View>
              </View>
            </View>
            <View>
              <View >
                <Text style={[styles.heading, { paddingLeft: 40 }]}>Volume</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text style={{ paddingHorizontal: 40, fontSize: 25, color: 'white', fontWeight: 'bold' }}>{volume}</Text>
                </View>
                <View>
                  <Text style={styles.text}>kgs</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.addingcontainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <Text style={styles.heading}>Today's Exercises</Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#75E6DA',
                borderRadius: 20,
                padding: 10,
                minWidth: 100,
                alignItems: 'center'
              }}
              onPress={() => router.navigate('/addexercise_api')}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>Add Set</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.exercisecontainer}>
          <FlashList
            data={DATA}
            renderItem={renderItem}
            estimatedItemSize={100}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  summarycontainer: {
    backgroundColor: '#FFC0CB',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  addingcontainer: {
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  exercisecontainer: {
    backgroundColor: '#E7DDFF',
    borderRadius: 10,
    margin: 10,
    minHeight: 200,
    marginBottom: 20,
  },
  text: {
    color: '#000000',
    fontSize: 20,
  },
  heading: {
    color: '#000000',
    fontSize: 25,
    fontWeight: 'bold',
  },
});