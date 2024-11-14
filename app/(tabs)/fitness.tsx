import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import email from './fitness';

export default function FitnessScreen() {
  const [minutes] = React.useState<number>(0);
  const [average_minutes] = React.useState<number>(0);
  const [num_of_sets] = React.useState<number>(0);
  const [volume] = React.useState<number>(0);
  return (
    <View style={styles.container}>

      <CalendarStrip
        calendarAnimation={{type: 'sequence', duration: 30}}
        daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white'}}
        style={{height: 100, paddingTop: 30, paddingBottom: 10}}
        calendarHeaderStyle={{color: 'white'}}
        calendarColor={'#7743CE'}
        dateNumberStyle={{color: 'white'}}
        dateNameStyle={{color: 'white'}}
        highlightDateNumberStyle={{color: 'yellow'}}
        highlightDateNameStyle={{color: 'yellow'}}
        disabledDateNameStyle={{color: 'grey'}}
        disabledDateNumberStyle={{color: 'grey'}}
        iconContainer={{flex: 0.1}}
     />

      <ScrollView>
      <View style={styles.summarycontainer}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 30, fontWeight: 'bold'}}>Summary</Text>
        </View>
        <View style={{paddingLeft: 40}}>
          <Text style={styles.heading}>Duration</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <View>
            <Text style={{paddingHorizontal: 40, fontSize: 25, color: 'white', fontWeight: 'bold'}}>{minutes}</Text>
          </View>
          <View>
            <Text style={styles.text}>mins</Text>
          </View>
          <View>
            <Text style={{paddingHorizontal: 30, fontSize: 25, color: 'white', fontWeight: 'bold'}}>{average_minutes}</Text>
          </View>
          <View>
            <Text style={styles.text}>mins daily average</Text>
          </View>
        </View>
        <View style={{flexDirection:'row'}}>
          <View>
            <View >
              <Text style={[styles.heading, {paddingLeft: 40}]}>Set</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <View>
                <Text style={{paddingHorizontal: 40, fontSize: 25, color: 'white', fontWeight: 'bold'}}>{num_of_sets}</Text>
              </View>
              <View>
                <Text style={styles.text}>sets</Text>
              </View>
            </View>
          </View>
          <View>
            <View >
              <Text style={[styles.heading, {paddingLeft: 40}]}>Volume</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <View>
                <Text style={{paddingHorizontal: 40, fontSize: 25, color: 'white', fontWeight: 'bold'}}>{volume}</Text>
              </View>
              <View>
                <Text style={styles.text}>kgs</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.addingcontainer, {flexDirection: 'row', padding: 20}]}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[styles.heading, {paddingLeft: 20}]}>Today's Exercises</Text>
        </View>
        <View style= {{paddingLeft: 50}}>
              <TouchableOpacity style= {{backgroundColor: '#75E6DA', borderRadius: 20, height: 50, width: 100, alignItems: 'center', justifyContent: 'center'}} onPress={() => alert('You pressed a button.')}>
                <Text style={{fontWeight:'bold',fontSize:20,color: 'black',padding:4}}>Add Set</Text>
              </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  summarycontainer:{
    flex: 1,
    backgroundColor: '#FFC0CB',
    //backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  addingcontainer:{
    flex: 1,
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
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