/* eslint-disable prettier/prettier */
/* eslint-disable space-infix-ops */
import SmsAndroid from 'react-native-get-sms-android';

import DefaultPreference from 'react-native-default-preference';
//import SMSData from './Data';

let SMSData = [];
let gSearchedText;
let callBack;

const setDefaultsValues = (values) =>{
  searchSMS(setFilter(values));
}

const setFilter = (values) =>{
  
  let caseSensitiveEnabled = true;
  let searchCriteria = '';
  let startDate = new Date("1970-01-01").toString();
  let endDate = new Date().toString()

  if(values && values.length>0){
    caseSensitiveEnabled = (values[0] === 'true'); // string to bool conversion
    searchCriteria = values[1];
    startDate = values[2];
    endDate = values[3];
  }
  
  let defaultRegex = '((?i)(?s).*'+ gSearchedText+'.*)';
  if(caseSensitiveEnabled){
    defaultRegex = '((?s).*'+ gSearchedText+'.*)';
    console.log("case is enabled ");
  }

  console.log("startDate", startDate);
  console.log("endDate", endDate);

  
  let filter = {
    box: searchCriteria,
    //box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
    /**
     *  the next 3 filters can work together, they are AND-ed
     *
     *  minDate, maxDate filters work like this:
     *    - If and only if you set a maxDate, it's like executing this SQL query:
     *    "SELECT * from messages WHERE (other filters) AND date <= maxDate"
     *    - Same for minDate but with "date >= minDate"
     */

    //minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
    //maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
    minDate: Date.parse(startDate),
    maxDate:Date.parse(endDate),
    bodyRegex: defaultRegex, // ignore case and multi-line match
    //bodyRegex: '((?s).*'+ searchedText+'.*)', // match multi-lines
    //bodyRegex: '((?i).*'+ searchedText+'.*)', // ignore case
    // the next 5 filters should NOT be used together, they are OR-ed so pick one
    //read: 0, // 0 for unread SMS, 1 for SMS already read, 0 considered for default case
    //_id: 1234, // specify the msg id
    //thread_id: 12, // specify the conversation thread_id
    //address: '+923024919979', // sender's phone number
    //body: searchedText, // content to match
    // the next 2 filters can be used for pagination
    indexFrom: 0, // start from index 0
    maxCount: 1000, // count of SMS to return each time
  };

  return filter;
}


const searchSMS = (filter)=>{
  SmsAndroid.list(
    JSON.stringify(filter),
    (fail) => {
      console.log('Failed with this error: ' + fail);
    },
    (count, smsList) => {
      console.log('Count: ', count);
      //console.log('List: ', smsList);
      var arr = JSON.parse(smsList);
      SMSData =[];
      arr.forEach(function (object) {
        SMSData.push({
          id: object._id,
          date: object.date,
          read: object.read,
          status: object.status,
          body: object.body,
          seen: object.seen,
          address: object.address,
        });
      });
      callBack(SMSData);
    },
  );
}
const  getSMS = (searchedText,callback) => {

  gSearchedText = searchedText;
  callBack = callback;

  const keys = new Array('isCaseSensitiveEnabled','searchCriteria','startDate','endDate');

  DefaultPreference.getMultiple(keys).then(setDefaultsValues);
};

export default getSMS;
