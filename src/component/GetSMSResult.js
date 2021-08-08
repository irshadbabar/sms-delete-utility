import SmsAndroid from 'react-native-get-sms-android';

//import SMSData from './Data';

let SMSData = [];

const  getSMS = (searchedText,callback) => {
  
  let filter = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
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
    bodyRegex: '((?i)(?s).*'+ searchedText+'.*)', // ignore case and multi-line match
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
        //console.log('Object: ' + object);
        //console.log('-->' + object.date);
        //console.log('-->' + object.body);
        //console.log('-->' + object.address);


        SMSData.push({
          id: object._id,
          date: object.date,
          read: object.read,
          status: object.status,
          body: object.body,
          seen: object.seen,
          address: object.address,
        });
        //console.log(SMSData)
        //alert(SMSData.length)
        //alert('your message with selected id is --->' + object.body);
      });
      //console.log("callback executed");
      callback(SMSData);
      //alert(SMSData.length.toString());
      //return SMSData;
      //alert('your message with selected id is --->' + Date.now().toString());
    },
  );
  //alert(SMSData.length.toString());
  //console.log("getSMS executed");
  //return SMSData;
};

export default getSMS;
