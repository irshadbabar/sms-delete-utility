/* eslint-disable prettier/prettier */
import {PermissionsAndroid,Permission} from 'react-native';
//import Constants from "expo-constants";

export const checkReadSmsPermission = async ()=>{

  const result =  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
  return result;

}
export const checkReadContactsPermission = async ()=>{

  const result =  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
  return result;
}

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
      // ,
      // {
      //   title: 'Cool Photo App Camera Permission',
      //   message:
      //     'Cool Photo App needs access to your camera ' +
      //     'so you can take awesome pictures.',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',

      // },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log('You can use the camera');
    } else {
      //console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
export const requestSmsPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS
      // ,
      // {
      //   title: 'Permission for the SMS read,delete and send',
      //   message: 'You will be able to read and delete messages',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',
      // },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log('You can use sms');
    } else {
      //console.log('sms permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
export const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        // ,
        // {
        //   title: 'Permission for the Contacts add read,delete',
        //   message: 'You will be able to add,read,update and delete contacts',
        //   buttonNeutral: 'Ask Me Later',
        //   buttonNegative: 'Cancel',
        //   buttonPositive: 'OK',
        // },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log('You can use contacts');
      } else {
        //console.log('contacts permission denied');
      }
    } catch (err) {
      //console.warn(err);
    }
  };