
package com.searchanddelete;

import android.os.Build;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import android.app.AlertDialog;
import android.content.DialogInterface;

import android.provider.Telephony;
import android.content.Intent;

import android.app.Activity;

import androidx.annotation.RequiresApi;


public class DefaultSmsPermissionModule extends ReactContextBaseJavaModule {

    private static String AppPackageName = "com.searchanddelete";
    private static final int DEFAULT_SMS_APP_REQUEST = 99;
    private static final int IMAGE_PICKER_REQUEST = 4;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
    private static final String E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER";
    private static final String E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND";

    private Promise mPickerPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == DEFAULT_SMS_APP_REQUEST) {
                if (mPickerPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mPickerPromise.resolve("NO");
                    } else if (resultCode == Activity.RESULT_OK) {
                        mPickerPromise.resolve("YES");
                    }
                    mPickerPromise = null;
                }
            }
        }
    };

    public DefaultSmsPermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "DefaultSmsPermissionModule";
    }

    @ReactMethod
    public void showToast(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    private void showAlert(String message,Activity currentActivity){
             AlertDialog alertDialog = new AlertDialog.Builder(currentActivity).create();
             alertDialog.setTitle("Alert");
             alertDialog.setMessage("Alert message to be shown "+message);
             alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                 new DialogInterface.OnClickListener() {
                     public void onClick(DialogInterface dialog, int which) {
                         dialog.dismiss();
                     }
                 });
             alertDialog.show();
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void askForDefaultSmsPermission(final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        AppPackageName =  currentActivity.getPackageName();
        String defaultSmsApp = Telephony.Sms.getDefaultSmsPackage(currentActivity);

        if (!defaultSmsApp.equals(AppPackageName)) {
            // App is not default.
            // Show the "not currently set as the default SMS app" interface
            try {

                Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
                intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, AppPackageName);
                currentActivity.startActivityForResult(intent, DEFAULT_SMS_APP_REQUEST);
            } catch (Exception e) {
                mPickerPromise.reject(E_FAILED_TO_SHOW_PICKER, e);
                mPickerPromise = null;
            }

        }
        mPickerPromise = promise;
    }

    @ReactMethod
    public void pickImage(final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        promise.resolve("How are You boss");
        // Store the promise to resolve/reject when picker returns data
        mPickerPromise = promise;
//
//    try {
//      final Intent galleryIntent = new Intent(Intent.ACTION_PICK);
//
//      galleryIntent.setType("image/*");
//
//      final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");
//
//      currentActivity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST);
//    } catch (Exception e) {
//      mPickerPromise.reject(E_FAILED_TO_SHOW_PICKER, e);
//      mPickerPromise = null;
//    }
    }
}