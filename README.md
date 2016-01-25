Ionic-TypeScript-MDHA-Starter
=============================

This is a sample application that I use as a skeleton when bootstrapping new mobile applications.

It utilizes the [Ionic](http://ionicframework.com/) framework to achieve a user interface that feels like a native application. The Ionic framework in turn utilizes [AngularJS](https://angularjs.org/).

The application is written primarily in [TypeScript](http://www.typescriptlang.org/) which brings object oriented paradigms, type-safety, compile-time checking, and IDE tooling (refactoring! code completion! huzzah!).

Development is done in Visual Studio 2015 using the [Visual Studio Tools for Apache Cordova](https://www.visualstudio.com/en-us/features/cordova-vs.aspx) project (previously known as **M**ulti-**D**evice **H**ybrid **A**pplication).

In-browser development and debugging is possible via the [Apache Ripple](http://ripple.incubator.apache.org/) emulator. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container. Both of these are provided out of the box when using VS2015.

Applications created with this starter project can target iOS, Android, Windows, and Chrome (as an extension).

Screenshots can be found on the project page [here](http://www.justin-credible.net/Projects/Ionic-TypeScript-MDHA-Starter).

> Note: If you are looking for a version of this project that is IDE and platform agnostic, you can check out it's sister project: [Ionic-TypeScript-Starter](https://github.com/Justin-Credible/Ionic-TypeScript-Starter).

## Environment Setup ##

The following external prerequisites are required:

* [Visual Studio 2015 Community](https://www.visualstudio.com/) with Update 1
* Apache Cordova tools for Visual Studio (included with Visual Studio 2015)
* [Node.js](https://nodejs.org/dist/v4.2.2/) 4.2.2

> Note: If you want to run on a emulator or physical device, you'll need your environment setup for iOS or Android development.

### Configure Visual Studio ###

This project uses gulp to build TypeScript, SASS, etc. You'll want to make sure the **Task Runner Explorer** window is visible:

* View > Other Windows > Task Runner Explorer

Next, configure Visual Studio to use the same version of Node that is available via your path:

1. Tools > Options
1. Projects and Solutions
1. External Web Tools
2. Add the path to your node installation to the top of the list (eg `C:\Program Files\nodejs`)

This can be verified by executing `node --version` at a command prompt and comparing the version to the `gulp echo-node-version` task when executed from Visual Studio's task runner explorer. More details are available [here](http://ryanhayes.net/synchronize-node-js-install-version-with-visual-studio-2015/).

### Modify your path ###

All other dependencies are installed in the project directory via `npm`. To use them **you'll need to add `./node_modules/.bin` to your path**. Using the dependencies directly from the project directory reduces dependency hell with globally installed modules and ensures all development is done using the exact same versions of the modules.

The path should be appended via the System > Environment Variables GUI and Visual Studio should be restarted for the changes to take effect.

## Getting Started ##

In addition to installing Visual Studio, the installer will take care of downloading and setting up all the dependencies you need for developing Cordova applications (Node.js, Apache Ant, Oracle JDK 7, the Android SDK, Google Chrome and more).

You can clone the repository to your machine using:

	$ git clone https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter

Once you've installed VS2015, and cloned this repository you should be able to open the solution file:

	Ionic-TypeScript-MDHA-Starter.sln
 
In the solution explorer you'll see a dependencies node with both the node and bower dependencies. If they do not automatically begin restoring, you'll have to right click them manually.

After the dependencies are installed, you can use the various gulp tasks from the Task Runner Explorer or the command line.

## Compilation ##

The following tasks can be used to perform code configuration, library and plugin setup, and TypeScript compilation.

    $ gulp config     # Creates www/js/build-vars.js from config.xml and runtime-config.json values
    $ gulp templates  # Compiles Angluar HTML templates from src/Views/**/*.html to www/js/templates.js
    $ gulp sass       # Compiles SASS from src/Styles/Index.scss to www/css/bundle.css
    $ gulp libs       # Install third Party JS libraries to www/lib as defined in bower.json
    $ gulp tsd        # Install TypeScript definitions as defined in tsd.json
    $ gulp ts         # Compiles TypeScript code as configured by src/tsconfig.json

> Note: You can also just run `gulp` without any arguments which will run all of the above targets.

After you've run the tasks, you can now use the Visual Studio play button to launch the Ripple emulator.

## Running ##

The VS Cordova Tools make it easy to build and run your mobile application for multiple platforms. You can simply choose the build type, platform and action (which can either be to run on the device, run on the device emulator, or run in the Apache Ripple in-browser simulator. This is done via the configuration drop downs on the Visual Studio's standard toolbar.

The project has been written to work well with the Ripple emulator; while in the browser several device only features (toast notifications, clipboard access, dialogs) will be mocked up and replaced with versions that will work on the browser. For example, the Ionic dialogs will be used in the emulator, but the native OS dialogs will be used when running on the device.

This is taken care of via the `ripple-mock-api.js` and `MockApis.ts` files.

When you click the play button (or press F5), the build process will kick off. The VS Cordova Tools will setup a Cordova project and then copy in all of the resources.

If you are using the Ripple emulator a Chrome instance will be started and Visual Studio will attach to it to enable DOM inspection and JavaScript debugging.

## Debugging in Visual Studio ##

While debugging, any changes to files in the `www` directory should cause the Ripple emulator to refresh. You can also force a refresh by building using Build > Build Solution.

You may notice that if you try to open Chrome's F12 Developer Tools while Visual Studio is attached, the Chrome instance may crash. This has gotten much better in recent versions, so you may not encounter this issue, but if you do you can simply detach VS (Debug > Detach All) before opening the Developer Tools in Chrome.

## Building as a Chrome Extension ##

You can use the `chrome` gulp task to create a Chrome extension.

Once built, the extension can be loaded into Chrome using the `chrome://extensions` URL and enabling development mode. The extension payload will be located in a `chrome` directory.

## Testing ##

The `npm test` command can be executed to run the TypeScript linter followed by the unit tests using the Karma test runner.

These operations can be performed independently using the `gulp lint` and `gulp test` tasks.

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

The `index.html` page is the page that is loaded which handles including CSS and JavaScript references. It references `www/js/boot1.js`, which is the first level boot loader. It is responsible for any tasks that need to occur early on before delegating to the second level boot loader.

The bulk of the application code is located in the `src` directory, with sub-directories for directives, services, views, etc.

The second level boot loader is located at `src/Framework/Boot2.ts`. It is responsible for setting up Ionic/Angular and registering the controllers, directives, routes, etc.

The main application logic is located in `src/Application/Application.ts`. This class takes care of handling device events (eg pause, resume) and other application level tasks. Routes are configured via `src/Application/RouteConfig.ts`.

Visual Studio will compile the TypeScript and bundle it all into a single file located at `www/js/bundle.js`.

Third party JavaScript libraries are stored in `www/lib` and are downloaded via the gulp libs task. 

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

It also includes helpers for manipulating strings (`startsWith`, `endsWith`, `format`), creating GUIDs, and working with the clipboard.

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

Copyright © 2015 Justin Unterreiner.

Released under an MIT license; see [LICENSE](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter/blob/master/LICENSE) for more information.
