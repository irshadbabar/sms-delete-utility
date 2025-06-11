/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { TextInput, StyleSheet, View,Alert,AppState,Text,Button,Dimensions} from 'react-native';

import { RootSiblingParent } from 'react-native-root-siblings';
import List from './component/FlatList';
import FilterDetails from './component/screens/FilterDetails';
import FAB from './component/FAB';
import {
  requestSmsPermission,
  requestContactsPermission,
  checkReadSmsPermission,
} from './PermissionsRequest';

import Icon from 'react-native-vector-icons/Ionicons';
import getSMS from './component/GetSMSResult';
import deleteSMS from './component/DeleteSMS';
import NotificationService from './PushNotifications/NotificationService';
import {showToast,defaultSmsPermissionAlert} from './UtilityFunctions';

import BackgroundService from 'react-native-background-actions';

import Toast from 'react-native-root-toast';

import SmsRetriever from 'react-native-sms-retriever';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DefaultPreference from 'react-native-default-preference';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.myTextInput = React.createRef();
    this.state = {
      text: '',
      smsData: [],
      floatVisibility: false,
      resetStates: false,
    };
    this.NotificationService = new NotificationService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
    this.requestRequirePermissions();
    //DefaultPreference.clearAll();
    this.setDefaultPreferences();

  }

  setDefaultPreferences = ()=>{
    
    const keys = new Array('isCaseSensitiveEnabled','searchCriteria','startDate','endDate');
    DefaultPreference.getMultiple(keys).then(function(values){
      //console.log("values.length : ",values.length)
      
      const notEmptyItems = values.filter((item)=>{
        if(item !== null && typeof(item) !== 'undefined'){
         return true; 
        }
      });


      //console.log("notEmptyItems length = "+notEmptyItems.length +" " + notEmptyItems);
      if(notEmptyItems.length == 4){
        //console.log("all values are set");
      }
      else if(notEmptyItems.length == 0){

        const defaultValues = {
          isCaseSensitiveEnabled: ""+false,
          searchCriteria:'',
          startDate: new Date("1971-01-01").toDateString(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toDateString(),
        }

        DefaultPreference.setMultiple(defaultValues).then(function(){
          //console.log("default values are set");
        })
      }
      else{
        if(!values[0]){
          DefaultPreference.set('isCaseSensitiveEnabled',""+false).then(function(){
            //console.log("default value is set for Case")
          })
        }
        if(!values[1]){
          DefaultPreference.set('searchCriteria','').then(function(){
            //console.log("default value is set for searchCriteria")
          })
        }
        if(!values[2]){
          DefaultPreference.set('startDate',new Date("1971-01-01").toDateString()).then(function(){
            //console.log("default value is set for start Date");
          })
        }
        if(!values[3]){
          DefaultPreference.set('endDate',new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()).then(function(){
            //console.log("default value is set for End Date")
          })
        }

      }
      })
    }
// Get the SMS message (second gif)
_onSmsListenerPressed = async () => {
  try {
    const registered = await SmsRetriever.startSmsRetriever();
    if (registered) {
      SmsRetriever.addSmsListener(event => {
        //console.log(event.message);
        SmsRetriever.removeSmsListener();
      }); 
    }
  } catch (error) {
    //console.log(JSON.stringify(error));
  }
};

  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        100
      )
    );
  }
  
  backgroundDeleteService = async (taskDataArguments) => {
    // Example of an infinite loop task
    
    const { array } = taskDataArguments;
 
      if(BackgroundService.isRunning()){
        //Alert.alert("Background service is running");  
        //we are starting from one because we have deleted first one already
        //console.log("we are starting from one because we have deleted first one already")
        for(let i = 1;i<array.length;i++){
          //this.NotificationService.showDeleteAllProgressNotification(5,i);
          await deleteSMS(array[i].id);

          await this.updateProgress(array.length,i);
         
          //const data = await this.performTimeConsumingTask();
          console.log("i  =  "+i );
          //console.log("App state :"+AppState.currentState);  
        }
        
        const deleteMessageDetails =  "\n"+ array.length + " Messages deleted successfully";

        this.NotificationService.showDeleteAllProgressNotification("Delete Update",deleteMessageDetails);
        
        //await BackgroundService.stop();
      }else{
        //Alert.alert("Background service is not running");
        //console.log("Background service is not working");
      }
  };
  
  
  updateProgress =  async (total, current) => {

    return new Promise(async (resolve) => {
      if (current && total) {
        const percentageCompletion = (current / total) * 100;
    
        if (percentageCompletion === total) {
          
        } else {
         const progress = Math.round(percentageCompletion);
         
          if(AppState.currentState === "active"){
            await BackgroundService.updateNotification({progressBar:{max:100,value:progress},taskDesc: 'Deleting All Messages '+ progress + "%"}); // Only Android, iOS will ignore this call
            resolve(true);
          }
         
        }
      }
    });


  }
  requestRequirePermissions = async () => {

    await requestContactsPermission();
    await requestSmsPermission();
  }
  setFloatVisibility = (visibility) => {
    this.setState({ floatVisibility: visibility });
  }

  callback = (DataList) => {

    this.setState({ smsData: DataList, resetStates: false });
  };

  onClick = () => {

    if (Boolean(this.state.text)) {
      showToast('Started searching...',Toast.durations.SHORT, Toast.positions.TOP, 0);
    }
    this.onClickSearch();
  }

  onClickFilter = () => {
    this.props.navigation.navigate('FilterDetails', {
      item: "Irshad"
    });
  }

  onClickSearch = async () => {
    
    if (Boolean(this.state.text)) {
      if (await checkReadSmsPermission()) {
        //console.log("Here I am " + this.state.text)
        getSMS(this.state.text, this.callback);
      } else {
        await requestSmsPermission();
        if (await checkReadSmsPermission()) {
          //console.log("Here I am " + this.state.text);
          getSMS(this.state.text, this.callback);
        } 
        //console.log("Executed already " + this.state.text);
      }

    }
  };
  onChangeText = (searchedText) => {
    this.setState({ text: searchedText });
  };

  componentDidUpdate() {
  }

  componentDidMount() {
  }
  resetStates() {
    this.setState({ text: '', smsData: [], floatVisibility: false, resetStates: true })
    this.myTextInput.current.clear();
  }
  clearAll = () => {
    this.resetStates();
  }


  
  deleteAll = async()=> {
    if(this.state.smsData.length){
      //first will try to delete first message if successfull then will delete all the messages
      const status = await deleteSMS(this.state.smsData[0].id)
      //const status = true;
      //Alert.alert("First Delete Sms Status " + status);
      console.log("First Delete Sms Status " + status);
      if(status){

        const arr = [...this.state.smsData];
        const options = {
          taskName: 'Delete Service',
          taskTitle: 'Delete',
          taskDesc: 'Deleting All Messages',
          taskIcon: {
              name: 'sms_icon',
              type: 'mipmap',
          },
          //color: '#ff00ff',
          color:'red',
          //linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
          parameters: {
              array : arr,
          },
          progressBar:{
            max:100,
            value:0,
            indeterminate:false,
          }

      };

      console.log('starting the service');
      //Alert.alert('starting the service');
      await BackgroundService.start(this.backgroundDeleteService, options);

     
      this.clearAll();
      //showToast('All deleted successfully ');
      //console.log('All deleted successfully ');
      }
      else
      {
        defaultSmsPermissionAlert(this.deleteAll);
      }
    }
  }


  render() {
    return (
      <RootSiblingParent>
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 80,
              backgroundColor: '#c45653',
              //backgroundColor: '#0992ed',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical:15,
              flexDirection:'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 50,
                width: Dimensions.get('window').width*.90,
                backgroundColor: 'white',
                borderRadius: 15,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                ref={this.myTextInput}
                onChangeText={(searchedText) => this.onChangeText(searchedText)}
                placeholder="Search messages to delete"
                style={{ fontSize: 18 }}
                onSubmitEditing={this.onClick}
              />
              <Icon
                onPress={this.onClick}
                name="ios-search-outline"
                style={{ fontSize: 28 }}
              />
            </View>
            <Icon
                onPress={this.onClickFilter}
                name="ios-filter"
                style={{ fontSize: 28, color:'white' }}
              />

          </View>

          <List NotificationService={this.NotificationService} data={this.state.smsData} setFloatVisibility={this.setFloatVisibility} resetStates={this.state.resetStates} navigation={this.props.navigation} />
          <FAB visible={this.state.floatVisibility} clearAll={this.clearAll} deleteAll={this.deleteAll}/>

        </View>
      </RootSiblingParent>
    );
  }

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
  }

  onNotif(notif) {
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 40,
    padding: 16,
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  rightArrow: {
    position: "absolute",
    //backgroundColor: "#0078fe",
    backgroundColor: "#dedede",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },
  
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20
  
  },
  
  /*Arrow head for recevied messages*/
  leftArrow: {
      position: "absolute",
      backgroundColor: "#dedede",
      //backgroundColor:"red",
      width: 20,
      height: 25,
      bottom: 0,
      borderBottomRightRadius: 25,
      left: -10
  },
  
  leftArrowOverlap: {
      position: "absolute",
      backgroundColor: "#eeeeee",
      //backgroundColor:"green",
      width: 20,
      height: 35,
      bottom: -6,
      borderBottomRightRadius: 18,
      left: -20
  
  },

});

const Stack = createStackNavigator();
function MessageDetails({ route, navigation }) {
   /* 2. Get the param */
   const { item } = route.params;
   return (
    <View style={{
      //backgroundColor: "#0078fe",
      backgroundColor: "#dedede",
      padding:10,
      marginLeft: '10%',
      borderRadius: 5,
      //marginBottom: 15,
      marginTop: 15,
      marginRight: "10%",
      maxWidth: '80%',
      alignSelf: 'center',
      //maxWidth: 500,
      
      borderRadius: 20,
    }} key={item.id}>

      
      <Text style={{ fontSize: 16, color: "#000", }} key={item.id}>{item.body}</Text>

        <View style={styles.rightArrow}></View>
        
        <View style={styles.rightArrowOverlap}></View>
      
      
      
</View>
   );
}




function Screen() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Default" screenOptions={{}}>
        <Stack.Screen name="Default" component={App} options ={{headerShown:false}} />
        <Stack.Screen name="MessageDetails" options = {{ title: 'Message Details' }} component={MessageDetails} />
        <Stack.Screen name="FilterDetails"  options = {{ title: 'Filter Options' }} component={FilterDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Screen;