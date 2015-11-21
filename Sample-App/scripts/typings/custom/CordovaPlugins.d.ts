﻿
/**
 * This file contains definitions for additional Cordova plug-ins.
 */

/**
 * Describes the PhoneGap Toast Plugin.
 * 
 * https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
 */
interface ICordovaToastPlugin {

    /**
     * Shows a toast message with the specified duration and position.
     * 
     * @param message The text for the toast message.
     * @param duration How long the toast should be visible ('short' or 'long').
     * @param position Where the toast should show ('top', 'center', or 'bottom').
     */
    show(message: string, duration: string, position: string): void;

    /**
     * Shows a toast message with the specified duration and position.
     * 
     * @param message The text for the toast message.
     * @param duration How long the toast should be visible ('short' or 'long').
     * @param position Where the toast should show ('top', 'center', or 'bottom').
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    show(message: string, duration: string, position: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a long duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     */
    showLongBottom(message: string);

    /**
     * Shows a toast message with a long duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showLongBottom(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a long duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     */
    showLongCenter(message: string);

    /**
     * Shows a toast message with a long duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showLongCenter(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a long duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     */
    showLongTop(message: string);

    /**
     * Shows a toast message with a long duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showLongTop(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a short duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     */
    showShortBottom(message: string);

    /**
     * Shows a toast message with a short duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showShortBottom(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;


    /**
     * Shows a toast message with a sort duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     */
    showShortCenter(message: string);

    /**
     * Shows a toast message with a short duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showShortCenter(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a short duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     */
    showShortTop(message: string);

    /**
     * Shows a toast message with a short duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showShortTop(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;
}

/**
 * Describes the clipboard plugin.
 * 
 * https://github.com/VersoSolutions/CordovaClipboard
 */
interface ICordovaClipboardPlugin {

    /**
     * Places the given text onto the user's clipboard.
     * 
     * @param text The text to copy to the clipboard.
     */
    copy(text: string): void;

    /**
     * Places the given text onto the user's clipboard.
     * 
     * @param text The text to copy to the clipboard.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    copy(text: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Retrieves the current text from the user's clipboard.
     * 
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     * @returns The text that is currently on the clipboard.
     */
    paste(successCallback: (text: string) => void, errorCallback: (error: Error) => void): void;
}

/**
 * Describes the Crashlytics plugin.
 * 
 * https://github.com/smistry-toushay/cordova-crashlytics-plugin
 */
interface ICordovaCrashlyticsPlugin {

    /**
     * Sends an exception (non fatal) to the Crashlytics backend.
     */
    logException(exception: string): void;

    /**
     * Sends a standard log message (non fatal) to the Crashlytics backend.
     */
    log(message: string): void;

    /**
     * Sets a custom key/value pair for logging to Crashlytics backend.
     */
    setBool(key: string, value: boolean): void;

    /**
     * Sets a custom key/value pair for logging to Crashlytics backend.
     */
    setDouble(key: string, value: number): void;

    /**
     * Sets a custom key/value pair for logging to Crashlytics backend.
     */
    setFloat(key: string, value: number): void;

    /**
     * Sets a custom key/value pair for logging to Crashlytics backend.
     */
    setInt(key: string, value: number): void;

    /**
     * Sets a custom key/value pair for logging to Crashlytics backend.
     */
    setLong(key: string, value: number): void;

    /**
     * Sets a custom key/value pair for logging to Crashlytics backend.
     */
    setString(key: string, value: string): void;

    /**
     * Sets the user's email address for logging to Crashlytics backend.
     */
    setUserEmail(email: string): void;

    /**
     * Sets the user's identifier for logging to Crashlytics backend.
     */
    setUserIdentifier(userId: string): void;

    /**
     * Sets the user's name for logging to Crashlytics backend.
     */
    setUserName(userName: string): void;

    /**
     * Used to simulate a native platform crash (useful for testing Crashlytics logging).
     */
    simulateCrash(): void;
}
