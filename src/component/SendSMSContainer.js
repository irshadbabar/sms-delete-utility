import React, {Component} from 'react';
import Scan from './scan';
import SmsAndroid from 'react-native-get-sms-android';

class SendSMSContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  // Function to send message
  sendSMS = () => {
    //console.log('sendSMS');
    // alert('clicked');
    SmsAndroid.autoSend(
      '+923046455665', //phoneNumber
      'Hello Brother how are you', //message
      (fail) => {
        //console.log('Failed with this error: ' + fail);
      },
      (success) => {
        //console.log('SMS sent successfully');
      },
    );
  };

  // Function to read particular message from inbox with id
  getSMS = () => {
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
      //bodyRegex: '(.*)ggggG(.*)', // content regex to match
      bodyRegex: '(.*)how are you(.*)', // content regex to match
      // the next 5 filters should NOT be used together, they are OR-ed so pick one
      //read: 0, // 0 for unread SMS, 1 for SMS already read
      //_id: 1234, // specify the msg id
      //thread_id: 12, // specify the conversation thread_id
      //address: '+923024919979', // sender's phone number
      //body: 'ggggg', // content to match
      // the next 2 filters can be used for pagination
      indexFrom: 0, // start from index 0
      maxCount: 2000, // count of SMS to return each time
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        //console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        //console.log('Count: ', count);
        //console.log('List: ', smsList);
        var arr = JSON.parse(smsList);

        arr.forEach(function (object) {
          //console.log('Object: ' + object);
          //console.log('-->' + object.date);
          //console.log('-->' + object.body);
          //alert('your message with selected id is --->' + object.body);
        });
        //alert('your message with selected id is --->' + Date.now().toString());
      },
    );
  };

  // Function to delete particular message from inbox with id
  deleteSMS = () => {
    //console.log('deleteSMS');
    SmsAndroid.delete(
      30582,
      (fail) => {
        //console.log('Failed with this error: ' + fail);
      },
      (success) => {
        //console.log('SMS deleted successfully');
      },
    );
  };

  render() {
    return (
      <Scan
        sendSMS={this.sendSMS}
        getSMS={this.getSMS}
        deleteSMS={this.deleteSMS}
      />
    );
  }
}

export default SendSMSContainer;
