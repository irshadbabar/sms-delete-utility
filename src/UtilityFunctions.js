import Toast from 'react-native-root-toast';
import {  Alert } from 'react-native';
import {DefaultSmsPermissionModule} from './NativeModules';
export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Example --> Wed, Aug 15, 2020
export const getDateFormat = (jsonDateTime) => {
  const dateTime = new Date(jsonDateTime);
  const day =
    dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
    return (
    dateTime.toString().split(' ')[0] +
    ', ' +
    monthNames[dateTime.getMonth()] +
    ' ' +
    day +
    ' ' +
    dateTime.getFullYear()
  );
};
// Example --> 08:20 AM
export const getTimeAMPMFormat = (jsonDateTime) => {
  const date = new Date(jsonDateTime);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours; // appending zero in the start if hours less than 10
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};

export const showToast = (message, duration=Toast.durations.SHORT, position=Toast.positions.BOTTOM, delay=500) => {
  // Add a Toast on screen.
  Toast.show(message, {
    duration: duration,
    position: position,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: delay,
    onShow: () => {
      //console.log("onShow")
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
      //console.log("onShown")
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
      //console.log("onHid")
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
      //console.log("onHidden")
    },
  });
};

export const showSimpleLongToast = (message) => {
  // Add a Toast on screen.
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
      //console.log("onShow")
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
      //console.log("onShown")
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
      //console.log("onHid")
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
      //console.log("onHidden")
    },
  });
};

export const showSimpleShortToast = (message) => {
  // Add a Toast on screen.
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
      //console.log("onShow")
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
      //console.log("onShown")
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
      //console.log("onHid")
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
      //console.log("onHidden")
    },
  });
};

export const defaultSmsPermissionAlert = (successHandler, ...argument) =>{

  
  Alert.alert(
    "Permission SMS",
    "You have to make your application default to delete sms",
    [
      {
        text: "Cancel",
        onPress: () => showToast('permission not granted'),
        style: "cancel"
      },
      { text: "OK", onPress: async() => {
        const response  = await DefaultSmsPermissionModule.askForDefaultSmsPermission();
        if(response.toUpperCase() === "YES"){
          console.log('Yes Response');
          if(argument[0]){
            successHandler(argument[0]);
          }else{
            successHandler();
          }
          
        }
        else if(response.toUpperCase() === "NO"){
          console.log('No Response');
        }
      } }
    ],
    { cancelable: false }
  );
  };