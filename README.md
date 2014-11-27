Ionic-TypeScript-MDHA-Starter
=============================

This is a sample application that I use as a skeleton when bootstrapping new mobile applications.

It utilizes the [Ionic](http://ionicframework.com/) framework to achieve a user interface that feels like a native application. The Ionic framework in turn utilizes [AngularJS](https://angularjs.org/).

The application is written primarily in [TypeScript](http://www.typescriptlang.org/) which brings object oriented paradigms, type-safety, compile-time checking, and IDE tooling (refactoring! code completion! huzzah!).

Development is done in Visual Studio 2013 using the [Multi-Device Hybrid Application](http://msdn.microsoft.com/en-us/vstudio/dn722381.aspx) (MDHA) project template. This sample was built using the CTP 2.0 version.

In-browser development and debugging is possible via the [Apache Ripple](http://ripple.incubator.apache.org/) emulator. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container. Both of these are provided out of the box when using the MDHA project.

Screenshots can be found on the project page [here](http://www.justin-credible.net/Projects/Ionic-TypeScript-MDHA-Starter).

## Libraries Used ##

The following is a list of JavaScript libraries that are included.

* [Ionic](http://ionicframework.com/) (1.0.0-beta11)
* [AngularJS](https://angularjs.org/) (1.2.17 via the Ionic bundle)
* [lodash](http://lodash.com/) (2.4.1)
* [Moment.js](http://momentjs.com/) (2.7.0)
* [NProgress.js](http://ricostacruz.com/nprogress/) (0.1.6)
* [ngCordova](http://ngcordova.com/) (0.1.2-alpha)
* [URI.js](http://medialize.github.io/URI.js/) (1.13.2)

The following is a list of Cordova plug-ins that are used:

* org.apache.cordova.console (0.2.8)
* org.apache.cordova.device (0.2.9)
* org.apache.cordova.statusbar (0.1.6)
* org.apache.cordova.file (1.2.0)
* org.apache.cordova.dialogs (0.2.8)
* com.jamiestarke.webviewdebug (1.0.8)
* com.verso.cordova.clipboard (0.1.0)
* nl.x-services.plugins.toast (2.0)
* org.pbernasconi.progressIndicator (1.0.0)

## Getting Started ##

First, you'll need to install the [Multi-Device Hybrid Application](http://msdn.microsoft.com/en-us/vstudio/dn722381.aspx) (MDHA) project template/extension. As of this writing, the app works with CTP 2.0 (vs2013mda_0.2.exe).

The installer will take care of downloading and setting up Node.js, Apache Ant, Oracle JDK 7, the Android SDK, Google Chrome and more. An in-depth install guide can be found [here](http://msdn.microsoft.com/en-us/library/dn757054.aspx).

You can clone the repository to your machine using:

	$ git clone https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter

Once you've installed the extension, and cloned this repository you should be able to open the solution file:

	JustinCredible.SampleApp.sln

## Running ##

The MDHA extension makes it easy to build and run your mobile application for multiple platforms. You can simply choose the build type, platform and action (which can either be to run on the device, run on the device emulator, or run in the Apache Ripple in-browser simulator. This is done via the configuration drop downs on the Visual Studio's standard toolbar.

The project has been written to work well with the Ripple emulator; while in the browser several device only features (toast notifications, clipboard access, dialogs) will be mocked up and replaced with versions that will work on the browser. For example, the Ionic dialogs will be used in the emulator, but the native OS dialogs will be used when running on the device.

This is taken care of via the RippleMockApi.js and MockApis.ts files.

When you click the play button (or press F5), the build process will kick off. The MDHA extension will perform TypeScript compilation, setup a Cordova project, and then copy in all of the resources.

If you are using the Ripple emulator a Chrome instance will be started and Visual Studio will attach to it to enable DOM inspection and JavaScript debugging.

## Debugging ##

Personally, I find the VS attachment to the Chrome process takes too long and I also prefer Chrome's debugging tools over those provided in Visual Studio. If you want a faster debug/refresh cycle, you can install the Ripple emulator manually by using npm:

	$ npm install ripple-emulator

When you are ready to debug, instead of clicking run/play/F5, do a regular build (Build > Build Solution or press F6) and then start the Ripple emulator manually:

	$ cd bld\Ripple\Android\Debug
	$ ripple emulate

You'll need to replace "Android" and "Debug" with the proper device and configuration.

This will start the Ripple emulator's web server on port 4400 and open your default browser to:

	http://localhost:4400/?enableripple=cordova-3.0.0

At this point you can run/test/debug and when you make a change you can just do a build again via F6 and then refresh your browser. This allows for much quicker development in my opinion.

## Basic Functionality ##

The application uses a left slide out menu for navigation (which is visible all the time when in tablet mode and only visible on demand on phones).

Four sample views are provided called "categories". These would be the main views for your application. The views can be re-ordered via the "Reorder Categories" menu item. The order is stored as a user preference. Finally, the settings view provides access to user configuration.

The "Cloud Sync" view is used to demonstrate an example directive.

The "Configure PIN" view allows the user to setup a PIN. This PIN will be prompted for when resuming the application after it has been in the background for 10 minutes.

The "Logs" view provides a list of log entries. Logs can be written to device storage or store only in memory. The log entry view allows the user to view the date/time, message, and stack trace (if applicable). They can also optionally copy the data to the device's clipboard or e-mail it.

Log entries are written when there are global JavaScript exceptions or exceptions within an Angular digest cycle. HTTP requests can also be logged, which can optionally include the full request/response body, which is useful for debugging.

The "Development Tools" view houses several options that are useful during development. It is described below.

The "About" view shows the application name, build timestamp, and version number, among other things.

## Development Tools ##

The "Development Tools" view is available via the settings menu and houses several options that are useful during development. It is only available when the build mode is "debug" or if the application is placed into the developer mode. This mode can be activated by tapping the icon on the about screen 10 times.

It can be used to enable the Mock API mode (described below), change the logging mode, test dialogs and/or toast notifications, and get information about the platform.

HTTP progress indicators
mock HTTP requests

## HTTP API Requests ##

A custom HTTP Interceptor is provided via `HttpInterceptor.ts`. It is responsible for several things:

1. Keeps track of outgoing requests
2. Handles showing of the NProgress activity bar at the top of the screen (optional)
3. Handles blocking the UI with a message/spinner (optional)
4. Handles setting HTTP headers (such as authorization token, API, version, content type etc)
5. Handles pre-pending the base API URL to the URL
6. Handles logging HTTP requests
7. Broadcasts events for certain status codes (eg 401, 403, 404) so the application can handle them

The interceptor will respect the flags specified via the `IRequestConfig` interface.

    var httpConfig: Interfaces.IRequestConfig;

    httpConfig = {
        method: "GET",
        url: "~/some-resource/123",
        data: null,
        blocking: true,
        blockingText: "Please Wait..."
    };

    this.$http(httpConfig).then((response: ng.IHttpPromiseCallbackArg<DataTypes.ISomeResource>) => {
        // Got my strongly typed response object!
    });

### Mock APIs / Demo Mode ###

The development tools can be used to enable the "Mock API" mode. In this mode all HTTP API requests will never leave the device and can be configured to return specific values.

This is useful for quick debugging without a backend or testing on devices without setting up a wi-fi connection etc.

The responses for the HTTP requests are defined in the `mockHttpCalls` method in `MockApis.ts`. 

## Project Structure ##

The file layout is mostly self describing via the directory names. All of the application code is located in the `app` directory, with sub-directories for controllers, directives, view models, services, etc.

`Application.ts` is the main file that bootstraps the application. It is responsible for setting up Ionic/Angular and registering the controllers, directives, routes, etc. It also takes care of device level events and handling exceptions.

#### TypeScript ####

One thing that is slightly different from normal Ionic/Angular development is the obvious addition of TypeScript. There are base classes for controllers and directives, and all of the view models, models, services etc are strongly typed.

If you are used to declaring controllers and directives inline and using closures to share data, this will require a bit of adjustment. I've included a sample directive and there are several controllers extending BaseController which can be used as examples.

Injection for controllers is done by setting a public static variable named `$inject`:


    export class MenuController extends BaseController<ViewModels.MenuViewModel> implements IMenuController {
    
		// Specify the things to inject.
    	public static $inject = ["$scope", "$location", "$http", "Utilities"];
    
		// This is where we'll store the injected things.
	    private $location: ng.ILocationService;
	    private $http: ng.IHttpService;
	    private Utilities: Services.Utilities;
    
		// The constructor receives the injected arguments in the same order as the $inject variable.
	    constructor($scope: ng.IScope, $location: ng.ILocationService, $http: ng.IHttpService, Utilities: Services.Utilities) {
		    super($scope, ViewModels.MenuViewModel);
		    
			// Save off a reference to the injected things.
		    this.$location = $location;
		    this.$http = $http;
		    this.Utilities = Utilities;
	    }
	}


### Utilities ###

The `Utilities.ts` file defines a `Utilities` service which provides several convenience methods for checking the device version, build mode (debug vs release), application version numbers.

It also includes helpers for manipulating strings (startsWith, endsWith, format), creating GUIDs, and working with the clipboard.

### UI Helper ###

The `UiHelper.ts` file defines a `UiHelper` service which provides several methods for working with the UI.

Any accessors for native plug-ins will be exposed here (eg toast and progress indicator). Exposing plug-ins via this service makes it easier to write unit tests, as all code will use these accessors instead of global variables like `window.plugins.toast`.

It also provides helpers to show native dialogs via alert/prompt/confirm when running on a device, or via `$ionicPopup` when running in Ripple.

Finally, it provides a `showDialog` helper for working with dialogs.

### File Utilities ###

Cordova's file system API required a few too many callbacks to do simple file I/O, so I created a bunch of helper methods in `FileUtilities.ts`. There are helps to list files and directories, as well as create, delete, and append to files, among others.

### Responsive Design ###

The `devices.css` stylesheet includes several classes that make it easy to hide or show elements based on the device orientation or screen size. For example, `landscape` and `portrait` as well as more specific classes such as `phone-landscape` or `tablet-portrait`.

### Dialogs ###

The `UiHelper`'s `showDialog` method makes it easy to work with dialogs. Internally, it delegates to Ionic's `$ionicModal` service.

All dialogs controllers should extend the BaseDialogController and be opened using the `showDialog` method. Doing so makes the dialog eventing consistent and makes it easier to pass data in and out of dialogs without adding lots of closures in surrounding code.

	/**
	 * ...
	 * V - The type of the view model that this controller will utilize.
	 * D - The type of data object that will be passed in when this dialog is opened.
	 * R - The type of the data object that will be returned when this dialog is closed.
	 */
	export class BaseDialogController<V, D, R> extends BaseController<V>

There are two sample dialogs provided; one for PIN entry and one for re-ordering categories.

## License ##

Copyright © 2014 Justin Unterreiner.

Released under an MIT license; see [LICENSE](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter/blob/master/LICENSE) for more information.
