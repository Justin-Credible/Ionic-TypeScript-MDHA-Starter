"use strict";

var exec = require("cordova/exec");

/**
 * The Cordova plugin ID for this plugin.
 */
var PLUGIN_ID = "SpinnerPlugin";

/**
 * The plugin which will be exported and exposed in the global scope.
 */
var SpinnerPlugin = {};

/**
 * Blocks user input using an indeterminate spinner.
 * 
 * An optional label can be shown below the spinner.
 * 
 * @param [string] labelText - The optional value to show in a label.
 * @param [function] successCallback - The success callback for this asynchronous function.
 * @param [function] failureCallback - The failure callback for this asynchronous function; receives an error string.
 */
SpinnerPlugin.activityStart = function activityStart(labelText, successCallback, failureCallback) {

	// Ensure that only string values are passed in.
	if (labelText !== null && typeof(labelText) !== "string") {
		labelText = "Please Wait...";
	}

	exec(successCallback, failureCallback, PLUGIN_ID, "activityStart", labelText ? [labelText] : []);
};

/**
 * Allows user input by hiding the indeterminate spinner.
 * 
 * @param [function] successCallback - The success callback for this asynchronous function.
 * @param [function] failureCallback - The failure callback for this asynchronous function; receives an error string.
 */
SpinnerPlugin.activityStop = function activityStop(successCallback, failureCallback) {
	exec(successCallback, failureCallback, PLUGIN_ID, "activityStop", []);
};

module.exports = SpinnerPlugin;
