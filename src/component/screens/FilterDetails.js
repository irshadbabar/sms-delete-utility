/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  Switch,
  Dimensions,
  Picker
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import DefaultPreference from 'react-native-default-preference';
import {getDateFormat} from '../../UtilityFunctions';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCaseSensitiveEnabled: false,
      searchCriteria:'',
      startDate:new Date("1973-01-01"),
      endDate:new Date(),
    }
    const keys = new Array('isCaseSensitiveEnabled','searchCriteria','startDate','endDate');
    DefaultPreference.getMultiple(keys).then(this.setDefaults);
  }
  setSearchCriteria = (value) => {
    this.setState({searchCriteria:value})
    DefaultPreference.set('searchCriteria',value).then(function() {
      console.log('search criteria is set');
      })
  }

  toggleSwitch = () => {
    this.setState({isCaseSensitiveEnabled : !this.state.isCaseSensitiveEnabled});
    DefaultPreference.set('isCaseSensitiveEnabled', "" + !this.state.isCaseSensitiveEnabled).then(function() {
    console.log('case is set');
    })
  }

  setStartDate = (date) =>{
    DefaultPreference.set('startDate',date).then(function() {
      console.log('start date is set');
      });
    this.setState({startDate:date});
  }

  setEndDate = (date) =>{
    DefaultPreference.set('endDate',date).then(function() {
      console.log('end date is set');
      });
    this.setState({endDate:date});
  }
  setDefaults = (values) =>{

    console.log("values.length = "+values.length);

    if(values && values.length == 4){

      console.log("values = "+values);
      this.setState(
        {
          isCaseSensitiveEnabled : (values[0] === 'true'),
          searchCriteria:values[1],
          startDate:new Date(values[2]),
          endDate:new Date(values[3]),
        });
    }
  }

  resetStates = ()=>{
    this.setState(
      {
        isCaseSensitiveEnabled: false,
        searchCriteria:'',
        startDate:new Date("1970-01-01"),
        endDate:new Date(),
      });
  }
  resetPreferences = () =>{

    const defaultValues = {
      isCaseSensitiveEnabled: ""+false,
      searchCriteria:'',
      startDate: Date("1970-01-01").toString(),
      endDate: Date().toString(),
    }
    DefaultPreference.setMultiple(defaultValues).then(function(){
      console.log("Reset to defaults is done");
    })

  }
  restoreDefaults = ()=>{
    this.resetStates();
    this.resetPreferences();
  }
  
  render() {
    return (
  <View style={styles.container}>

    <View style={styles.subContainer}>
      <Text >Case sensitive</Text>
      <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.toggleSwitch}
              value={this.state.isCaseSensitiveEnabled}
          />
    </View>
    <View style={[styles.subContainer]}>
      <Text>Search From</Text>
        <Picker
        style={styles.picker}
        selectedValue={this.state.searchCriteria}
        onValueChange={(itemValue, itemIndex) =>
        this.setSearchCriteria(itemValue)
        }>
        <Picker.Item label="Inbox" value="inbox" />
        <Picker.Item label="Sent" value="sent" />
        <Picker.Item label="Draft" value="draft" />
        <Picker.Item label="Outbox" value="outbox" />
        <Picker.Item label="Failed" value="failed" />
        <Picker.Item label="Queued" value="queued" />
        <Picker.Item label="All" value="" />
      </Picker>
     </View>     
    <View style={styles.subContainer}>
      <Text >Start Date</Text>
      <DatePicker
        style={styles.date}
        date={this.state.startDate}
        mode="date"
        placeholder="select date"
        format="MMM D, YYYY"
        minDate="1971-01-01"
        //maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setStartDate(date)}}
      />
    </View>
    <View style={styles.subContainer}>
      <Text >End Date</Text>
      <DatePicker
        style={styles.date}
        date={this.state.endDate}
        mode="date"
        placeholder="select date"
        format="MMM D, YYYY"
        minDate="1970-01-01"
        //maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setEndDate(date)}}
      />
    </View>
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.restoreDefaults()}>
          <Text style={styles.loginText}>Reset to Defaults</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    //backgroundColor: '#DCDCDC',
    backgroundColor: '#ffc',
    //backgroundColor: '#0000',
    //backgroundColor: '#E6E6FA',

  },
  subContainer: {
    flexDirection:'row',
    alignItems:'center',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  switch:{
    marginLeft:screenWidth/2
  },
  picker:{
    flex:.6,
    marginLeft:screenWidth/3+15,
  },
  date:{
    width: 150,
    marginLeft:screenWidth/4 +22
  },
  loginText: {
    color: 'white',
  },
});
