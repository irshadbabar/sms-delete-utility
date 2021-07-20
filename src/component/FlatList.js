/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Alert } from 'react-native';
import ListItem from './ListItem';
import Contacts from 'react-native-contacts';
import * as Progress from 'react-native-progress';
import deleteSMS from './DeleteSMS';

import Toast from 'react-native-root-toast';
import { showToast, defaultSmsPermissionAlert} from '../UtilityFunctions';
import { checkReadContactsPermission, requestContactsPermission } from '../PermissionsRequest';

import {ToastExample,DefaultSmsPermissionModule} from '../NativeModules';

export default class List1 extends Component {
  constructor(props) {
    super(props);
    this.initData = props.data;
    this.state = {
      data: this.initData,
      progress: 0,
      indeterminate: true,
    };
  }

  getNameByAddress = (contactName) => {
    return new Promise((resolve) => {
      Contacts.checkPermission((error, result) => {
        if (error) {
          console.log('Error happended ' + error);
          resolve(contactName);
        } else if (result === 'denied') {
          console.log('denied permission contact read');
          resolve(contactName);
        } else if (result === 'undefined') {
          console.log('undefied permission contact read');
          resolve(contactName);
        } else if (result === 'authorized') {
          Contacts.getContactsByPhoneNumber(contactName, (err, contacts) => {
            if (err) {
              console.log(err);
              resolve(contactName);
            } else if (contacts.length) {
              contactName = contacts[0].givenName;
              //console.log('inside promise fun ' + contactName);
              resolve(contactName);
            } else {
              // if nothing we get
              resolve(contactName);
            }
          });
        }
      });
    });
  };


  updateFloatVisibility(records) {
    if (records) {
      this.props.setFloatVisibility(true);
    }
    else {
      this.props.setFloatVisibility(false);
    }
  }

  resetStateOnChange() {
    this.setState({ progress: 0, indeterminate: true, data: [] });
  }

  updateProgress(total, current) {
    if (current && total) {
      const percentageCompletion = (current / total) * 100;

      if (percentageCompletion === total) {
        this.setState({ progress: 100 });
      } else {
        
       const progress = Math.round(percentageCompletion);
        this.setState({
          progress:  progress,
          indeterminate: false,
        });
        //console.log("calling notifications..");
        //this.props.NotificationService.showDeleteAllProgressNotification(5, progress);
      }
    }
  }

  showToastMessage(numberOfRecord) {
    if (numberOfRecord) {
      showToast(numberOfRecord + ' messages found', Toast.durations.LONG, Toast.positions.CENTER,);
    }
    else {
      showToast('no message found', Toast.durations.LONG, Toast.positions.CENTER,);
    }
  }
  showSwipeLeftRightMessage(numberOfRecord) {
    if (numberOfRecord) {
      showToast('delete message using swipe left or right', Toast.durations.LONG, Toast.positions.BOTTOM, 2000);
      console.log("toast called")
    }
  }




  updateStatesOnPropsChange = async () => {

    this.resetStateOnChange();
    if (!this.props.resetStates) {
      this.showToastMessage(this.props.data.length);
    }
    let arr = this.props.data;
    if(await checkReadContactsPermission()){
      
      for (let i = 0; i < arr.length; i++) {
        if (!isNaN(arr[i].address)) {
          if (arr[i].address.length >= 9) {
            const result = await this.getNameByAddress(arr[i].address);
            arr[i].address = result;
          }
        }
        //console.log("count i "+i+" arr length "+arr.length)
        this.updateProgress(arr.length, i + 1);
        
      }
    }
    else{
      await requestContactsPermission();
      if(await checkReadContactsPermission()){
      
        for (let i = 0; i < arr.length; i++) {
          if (!isNaN(arr[i].address)) {
            if (arr[i].address.length >= 9) {
              const result = await this.getNameByAddress(arr[i].address);
              arr[i].address = result;
            }
          }
          //console.log("count i "+i+" arr length "+arr.length)
          this.updateProgress(arr.length, i + 1);
    
        }
      }
    }
   this.setState({ data: arr });

    this.showSwipeLeftRightMessage(this.props.data.length);
    this.updateFloatVisibility(this.props.data.length);

  }

  async componentDidUpdate(oldProps) {
    //console.log("Calling componentDidUpdate");
    if (oldProps.data.length !== this.props.data.length) {
      this.updateStatesOnPropsChange();
      console.log('List Got By Length Check');

    } else if (oldProps.data !== this.props.data) {
      this.updateStatesOnPropsChange();
      console.log('List Got By Array Check');
    }

  }
  handleDeleteTask = async (itemId) => {
    const result = await deleteSMS(itemId);
    console.log(result);
    if (result) {
      const newData = this.state.data.filter((item) => itemId !== item.id);
      this.setState({ data: newData });
      //showSimpleLongToast("sms got deleted successfully");
    } else {
      const newData = this.state.data.filter((item) => itemId !== item.id);
      this.setState({ data: newData });
      this.setState({ data: this.props.data });
      defaultSmsPermissionAlert(this.handleDeleteTask,itemId)    }

  };


  render() {
    const header = () => {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>List Header</Text>
        </View>
      );
    };

    //this.setState({refresh:!this.state.refresh})
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return (
      <View>
        <FlatList
          //ListHeaderComponent={header}
          extraData={this.state.data}
          data={this.state.data}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={styles.itemSeparator}></View>
          )}
          contentContainerStyle={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
          }}
          renderItem={({ item, index }) => (
            <ListItem
              navigation={this.props.navigation}
              item={item}
              index={index}
              handleDeleteTask={this.handleDeleteTask}
            />
          )}
        />
        <Progress.Circle
          style={[
            styles.progressCircle,
            { display: this.state.progress === 100 ? 'none' : 'flex' }
          ]}
          size={width * 0.6}
          //width={50}
          //indeterminate={this.state.indeterminate}
          color={'green'}
          //unfilledColor={'red'}
          //borderColor={'red'}
          borderWidth={0}
          endAngle={0.8}
          thickness={12}
          showsText={this.state.progress > 0 ? true : false}
          //fill={'yellow'}
          progress={this.state.progress / 100}
          formatText={() => {
            //console.log(this.state.progress);
            return this.state.progress + '%';
          }}
          textStyle={styles.textStyle}
        //allowFontScaling={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
  },
  progressCircle: {
    //padding:Dimensions.get('window').width*0.20,
    margin: Dimensions.get('window').width * 0.2,
  },
  textStyle: {
    fontWeight: 'bold',
    color: 'green',
  },
  header: {
    height: 60,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  itemSeparator: {
    borderBottomWidth: 1,
    // eslint-disable-next-line prettier/prettier
    borderBottomColor: 'grey',
  },
});
