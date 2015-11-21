package net.justincredible;

import android.app.AlertDialog;
import android.app.ProgressDialog;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public final class SpinnerPlugin extends CordovaPlugin {

    private ProgressDialog spinnerDialog = null;

    @Override
    public synchronized boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {

        if (action == null) {
            return false;
        }

        if (action.equals("activityStart")) {

            try {
                this.activityStart(args, callbackContext);
            }
            catch (Exception exception) {
                callbackContext.error("SpinnerPlugin uncaught exception: " + exception.getMessage());
            }

            return true;
        }
        else if (action.equals("activityStop")) {

            try {
                this.activityStop(callbackContext);
            }
            catch (Exception exception) {
                callbackContext.error("SpinnerPlugin uncaught exception: " + exception.getMessage());
            }

            return true;
        }
        else {
            // The given action was not handled above.
            return false;
        }
    }

    private synchronized void activityStart(final JSONArray args, final CallbackContext callbackContext) throws JSONException {

        // Ensure there is always a label for display.
        final String message = args.length() == 1 ? args.getString(0) : "Please Wait...";

        // Ensure any previous dialogs are closed first.
        if (this.spinnerDialog != null) {
            this.spinnerDialog.dismiss();
            this.spinnerDialog = null;
        }

        // Use a more modern looking dialog if the platform supports it.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
            this.spinnerDialog = new ProgressDialog(this.cordova.getActivity(), AlertDialog.THEME_DEVICE_DEFAULT_LIGHT);
        }
        else {
            this.spinnerDialog = new ProgressDialog(this.cordova.getActivity());
        }

        this.spinnerDialog.setMessage(message);
        this.spinnerDialog.setIndeterminate(true);
        this.spinnerDialog.setCancelable(false);
        this.spinnerDialog.show();

        callbackContext.success();
    }

    private synchronized void activityStop(final CallbackContext callbackContext) throws JSONException {

        // Hide the dialog and null out the reference.
        if (this.spinnerDialog != null) {
            this.spinnerDialog.dismiss();
            this.spinnerDialog = null;
        }

        callbackContext.success();
    }
}
