import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Button, DataTable, List } from 'react-native-paper';
import { ListItem, Icon } from '@rneui/themed';
const age = 18;
const height = 175;
const weight = 70;

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', padding: 10}}>
        <Avatar.Image style = {{}} size={80} source={require('../../assets/images/pngwing.com.png')}/>
        <Text style={{alignSelf: 'center', fontSize: 30, padding: 10}}>John Doe</Text>
        <Button buttonColor = '#CBC3E3' style ={styles.fab} labelStyle={{padding: 10, fontSize: 20, fontWeight: 'bold'}}>
          Edit
        </Button>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', padding: 10}}>
        <View style= {styles.datablock}>
          <Text style={styles.text}>{age}</Text>
          <Text style= {{alignSelf: 'center',fontSize: 15}}>Age</Text>
        </View>

        <View style= {styles.datablock}>
          <Text style={styles.text}>{height} cm</Text>
          <Text style= {{alignSelf: 'center',fontSize: 15}}>Height</Text> 
        </View>

        <View style= {styles.datablock}>
          <Text style={styles.text}>{weight} kg</Text>
          <Text style= {{alignSelf: 'center',fontSize: 15}}>Weight</Text>
        </View>
      </View>
      <TouchableOpacity>
        <List.Item
          title="Personal Data"
          left={props => <List.Icon {...props} icon="account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <List.Item
          title="Achievement"
          left={props => <List.Icon {...props} icon="progress-star" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <List.Item
          title="Workout Progress"
          left={props => <List.Icon {...props} icon="chart-box-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <List.Item
          title="Setting"
          left={props => <List.Icon {...props} icon="account-settings-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </TouchableOpacity>
    {/* <ListItem>
    <Icon name="inbox" type="material-community" color="grey" />
    <ListItem.Content>
        <ListItem.Title>Inbox</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
    <ListItem>
      <Icon name="trash-can-outline" type="material-community" color="grey" />
      <ListItem.Content>
        <ListItem.Title>Trash</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem> */}
      <TouchableOpacity style= {{backgroundColor: '#75E6DA', borderRadius: 20, height: 50, width: 100, alignSelf: 'center',alignItems: 'center', justifyContent: 'center'}} onPress={() => router.replace('/')}>
        <Text style={{fontWeight:'bold',fontSize:20,color: 'black',padding:4}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#000000',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000000',
  },
  fab: {
    margin: 16,
    alignSelf: 'center',
    fontSize: 20,
  },
  datablock:{
    backgroundColor: '#CBC3E3', 
    borderRadius: 10, 
    margin: 10,
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
});