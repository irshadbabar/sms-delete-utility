import SmsAndroid from 'react-native-get-sms-android';

const deleteSMS = (id) => {
  return new Promise((resolve) => {
    console.log('inside delete sms');
    SmsAndroid.delete(
      id,
      (fail) => {
        console.log('Failed with this error: ' + fail);
        resolve(false)
      },
      (success) => {
        console.log('SMS deleted successfully '+success);
        resolve(true);
      },
    );
  });
};
export default deleteSMS;