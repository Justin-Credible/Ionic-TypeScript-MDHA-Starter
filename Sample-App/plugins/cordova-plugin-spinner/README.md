# Spinner Cordova Plugin

This is a [Cordova](http://cordova.apache.org/) plugin for preventing user interaction using an animated spinner overlay during a blocking operation.

On Android the native `ProgressDialog` is used, while on iOS it uses the [`MBProgressHud` library](https://github.com/jdg/MBProgressHUD).

# Install

To add the plugin to your Cordova project, simply add the plugin from the npm registry:

    cordova plugin add cordova-plugin-spinner

Alternatively, you can install the latest version of the plugin directly from git:

    cordova plugin add https://github.com/Justin-Credible/cordova-plugin-spinner

# Usage

The plugin is available via a global variable named `SpinnerPlugin`. It exposes the following properties and functions.

All functions accept optional success and failure callbacks as their final two arguments, where the failure callback will receive an error string as an argument unless otherwise noted.

A TypeScript definition file for the JavaScript interface is available in the `typings` directory as well as on [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped) via the `tsd` tool.

# Indeterminate Spinner

## Show Spinner ##

Blocks user input using an indeterminate spinner.

Method Signature:

`activityStart(labelText, successCallback, failureCallback)`

Parameters:

* `labelText` (string): The (optional) attribute text to use for the spinner label.

Example Usage:

`SpinnerPlugin.activityStart("Loading...");`

## Hide Spinner ##

Allows user input by hiding the indeterminate spinner.

Method Signature:

`activityStop(successCallback, failureCallback)`

Example Usage:

`SpinnerPlugin.activityStop();`