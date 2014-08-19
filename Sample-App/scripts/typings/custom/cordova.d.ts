
/**
 * This file contains Cordova specific APIs that do not yet have typings in the
 * DefinitelyTyped repository (typings/cordova.d.ts).
 */

/**
 * Extensions to the main Cordova interface located in cordova.d.ts.
 */
interface Cordova {
    /**
     * Includes several paths that can be utilized with the requestLocalFileSystemURL API.
     */
    file: ICordovaFile;
}

/**
* The StatusBar object provides some functions to customize the iOS and Android StatusBar.
* 
* http://plugins.cordova.io/#/package/org.apache.cordova.statusbar
*/
interface ICordovaStatusBar {

    /**
     * On iOS 7, make the statusbar overlay or not overlay the WebView.
     * For example, set to false to make the statusbar appear like iOS 6.
     * 
     * Set the style and background color to suit using the other functions.
     * 
     * Supported Platforms: iOS
     */
    overlaysWebView: (overlay: boolean) => void;

    /**
     * Use the default statusbar (dark text, for light backgrounds).
     * 
     * Supported Platforms:
     *  • iOS
     *  • Windows Phone 7
     *  • Windows Phone 8
     */
    styleDefault: () => void;

    /**
     * Use the lightContent statusbar (light text, for dark backgrounds).
     * 
     * Supported Platforms:
     *  • iOS
     *  • Windows Phone 7
     *  • Windows Phone 8
     */
    styleLightContent: () => void;

    /**
     * Use the blackTranslucent statusbar (light text, for dark backgrounds).
     * 
     * Supported Platforms:
     *  • iOS
     *  • Windows Phone 7
     *  • Windows Phone 8
     */
    styleBlackTranslucent: () => void;

    /**
     * Use the blackOpaque statusbar (light text, for dark backgrounds).
     * 
     * Supported Platforms:
     *  • iOS
     *  • Windows Phone 7
     *  • Windows Phone 8
     */
    styleBlackOpaque: () => void;

    /**
     * On iOS 7, when you set StatusBar.statusBarOverlaysWebView to false, you
     * can set the background color of the statusbar by color name.
     * 
     * Supported color names are:
     * black, darkGray, lightGray, white, gray, red, green, blue, cyan, yellow,
     * magenta, orange, purple, brown, clear
     * 
     * Supported Platforms:
     *  • iOS
     *  • Windows Phone 7
     *  • Windows Phone 8
     * 
     * @param colorName The name of the color to use.
     */
    backgroundColorByName: (colorName: string) => void;

    /**
     * Sets the background color of the statusbar by a hex string.
     * CSS shorthand properties are also supported.
     * 
     * On iOS 7, when you set StatusBar.statusBarOverlaysWebView to false, you
     * can set the background color of the statusbar by a hex string (#RRGGBB).
     * 
     * On WP7 and WP8 you can also specify values as #AARRGGBB, where AA is an alpha value.
     * 
     * Supported Platforms:
     *  • iOS
     *  • Windows Phone 7
     *  • Windows Phone 8
     * 
     * @param colorHexCode The hexidecimal value of the color to sue.
     */
    backgroundColorByHexString: (colorHexCode: string) => void;

    /**
     * Hide the statusbar.
     * 
     * Supported Platforms:
     *  • iOS
     *  • Android
     *  • Windows Phone 7
     *  • Windows Phone 8
     */
    hide: () => void;

    /**
     * Shows the statusbar.
     * 
     * Supported Platforms:
     *  • iOS
     *  • Android
     *  • Windows Phone 7
     *  • Windows Phone 8
     */
    show: () => void;

    /**
     * Read this property to see if the statusbar is visible or not.
     * 
     * Supported Platforms:
     *  • iOS
     *  • Android
     *  • Windows Phone 7
     *  • Windows Phone 8
     * 
     * @returns True if the statusbar is visible, false otherwise.
     */
    isVisible: () => boolean;
}

/**
 * Describes the cordova.file property that is exposed via the
 * org.apache.cordova.file@1.2.0 plugin in fileSystemPaths.js file.
 * 
 * https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md
 */
interface ICordovaFile {
    /**
     * Read-only directory where the application is installed.
     */
    applicationDirectory: string;

    /**
     * Root of app's private writable storage
     */
    applicationStorageDirectory: string;

    /**
     * Where to put app-specific data files.
     */
    dataDirectory: string;

    /**
     * Cached files that should survive app restarts.
     * Apps should not rely on the OS to delete files in here.
     */
    cacheDirectory: string;

    /**
     * Android: the application space on external storage.
     */
    externalApplicationStorageDirectory: string;

    /**
     * Android: Where to put app-specific data files on external storage.
     */
    externalDataDirectory: string;

    /**
     * Android: the application cache on external storage.
     */
    externalCacheDirectory: string;

    /**
     * Android: the external storage (SD card) root.
     */
    externalRootDirectory: string;

    /**
     * iOS: Temp directory that the OS can clear at will.
     */
    tempDirectory: string;
    
    /**
     * iOS: Holds app-specific files that should be synced (e.g. to iCloud).
     */
    syncedDataDirectory: string;

    /**
     * iOS: Files private to the app, but that are meaningful to other applications (e.g. Office files).
     */
    documentsDirectory: string;
}

interface FileError {
    code: number;
}