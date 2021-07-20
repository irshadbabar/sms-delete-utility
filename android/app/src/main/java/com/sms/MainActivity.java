package com.sms;
import com.facebook.react.ReactActivity;

import com.react.SmsPackage;
import com.tkporter.sendsms.SendSMSPackage;

import android.content.SharedPreferences;
import android.os.Build;
import android.provider.Telephony;
import android.content.Intent;


import android.app.Activity;
import android.os.Bundle;


import android.app.AlertDialog;
import android.content.DialogInterface;

import androidx.annotation.RequiresApi;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */

    private static String defaultSmsAppName;
    Intent smsServiceIntent;
    public static final String PREFS_NAME = "MyPrefsFile";
    public static final String AndroidDefaultAppNameString = "AndroidDefaultAppNameString";
    public static final String AndroidDefaultAppNameBoolean = "AndroidDefaultAppNameBoolean";
    public static String myPackageName = "";

    @Override
    protected String getMainComponentName() {
        return "sms";
    }


    @Override
    public void onResume() {
        super.onResume();
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void startActivity() {

        myPackageName = getApplicationContext().getPackageName();
        if (!Telephony.Sms.getDefaultSmsPackage(this).equals(myPackageName)) {
            // App is not default.
            // Show the "not currently set as the default SMS app" interface

            defaultSmsAppName = Telephony.Sms.getDefaultSmsPackage(this);
            Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
            intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, myPackageName);
            startActivity(intent);

        } else {

        }
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        smsServiceIntent = new Intent(MainActivity.this, HeadlessSmsSendService.class);




        // Restore preferences
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        if (settings.getBoolean(AndroidDefaultAppNameBoolean, false)) {
            defaultSmsAppName = settings.getString(AndroidDefaultAppNameString, "none");//none will never be copied
        } else {
            defaultSmsAppName = Telephony.Sms.getDefaultSmsPackage(this);
            //settings = getSharedPreferences(PREFS_NAME, 0);
            SharedPreferences.Editor editor = settings.edit();
            editor.putBoolean(AndroidDefaultAppNameBoolean, true);
            editor.putString(AndroidDefaultAppNameString, defaultSmsAppName);

            // Commit the edits!
            editor.commit();
        }


    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private void revokeSmsDefaultPermission(){
        // Restore preferences
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        if (settings.getBoolean(AndroidDefaultAppNameBoolean, false)) {
            defaultSmsAppName = settings.getString(AndroidDefaultAppNameString, "none");//none will never be copied

            if (!Telephony.Sms.getDefaultSmsPackage(this).equals(defaultSmsAppName) && !Telephony.Sms.getDefaultSmsPackage(this).equals(myPackageName)) {
                // App is not default.
                // Show the "not currently set as the default SMS app" interface
                Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
                intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, defaultSmsAppName);
                startActivity(intent);
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onBackPressed() {
        super.onBackPressed();
        revokeSmsDefaultPermission();
    }
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onDestroy() {
        super.onDestroy();
        MainActivity.this.startService(smsServiceIntent); // so we will start the service once app is closed and there will be no twice sms received problem.
        revokeSmsDefaultPermission();
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //probably some other stuff here
        SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);


    }
}