package com.searchanddelete;

import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

import androidx.annotation.RequiresApi;


public class SmsReceiver extends BroadcastReceiver {

    public static final String SMS_URI = "content://sms";

    public static final String ADDRESS = "address";
    public static final String PERSON = "person";
    public static final String DATE = "date";
    public static final String READ = "read";
    public static final String STATUS = "status";
    public static final String TYPE = "type";
    public static final String BODY = "body";
    public static final String SEEN = "seen";

    public static final int MESSAGE_TYPE_INBOX = 1;
    public static final int MESSAGE_TYPE_SENT = 2;

    public static final int MESSAGE_IS_NOT_READ = 0;
    public static final int MESSAGE_IS_READ = 1;

    public static final int MESSAGE_IS_NOT_SEEN = 0;
    public static final int MESSAGE_IS_SEEN = 1;

    public static final String SMS_BUNDLE = "pdus";

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        if (bundle != null) {


            if (intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {


                Object[] pdusObj = (Object[]) bundle.get("pdus");

                SmsMessage[] messages = new SmsMessage[pdusObj.length];

                for (int i = 0; i < messages.length; i++) {
                    String format = bundle.getString("format");
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        messages[i] = SmsMessage.createFromPdu((byte[]) pdusObj[i], format);
                    } else {
                        messages[i] = SmsMessage.createFromPdu((byte[]) pdusObj[i]);
                    }
                }

                for (SmsMessage msg : messages) {
                    Log.i("log", "display msg body  : " + msg.getDisplayMessageBody() + "originating address : " + msg.getDisplayOriginatingAddress() + " get message body : " + msg.getMessageBody());
                    ContentValues values = new ContentValues();
                    values.put(Telephony.Sms.ADDRESS, msg.getDisplayOriginatingAddress());
                    values.put(Telephony.Sms.BODY, msg.getMessageBody());
                    values.put(Telephony.Sms.PROTOCOL, msg.getProtocolIdentifier());
                    values.put(Telephony.Sms.SERVICE_CENTER, msg.getServiceCenterAddress());
                    values.put(Telephony.Sms.STATUS, msg.getStatus());

                    context.getApplicationContext().getContentResolver().insert(Telephony.Sms.Inbox.CONTENT_URI, values);
                    //abortBroadcast();
                }

            }
        } else {
            // do nothing
        }
    }

}
