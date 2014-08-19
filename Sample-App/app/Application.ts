
module JustinCredible.SampleApp.Application {

    //#region Variables

    /**
     * The root Angular application module.
     */
    var ngModule: ng.IModule;

    //#endregion


    // Bootstrap the application!
    main();



    /**
     * This is the main entry point for the application. It is used to setup Angular and
     * configure its controllers, services, etc.
     */
    function main() {
        var versionInfo: DataTypes.IVersionInfo;

        // Set the default error handler for all uncaught exceptions.
        window.onerror = window_onerror;

        versionInfo = {
            applicationName: "Sample App",
            websiteUrl: "http://www.justin-credible.net",
            githubUrl: "https://github.com/Justin-Credible",
            majorVersion: window.buildVars.majorVersion,
            minorVersion: window.buildVars.minorVersion,
            releaseVersion: window.buildVars.releaseVersion,
            revisionVersion: window.buildVars.revisionVersion,
            versionString: window.buildVars.majorVersion + "." + window.buildVars.minorVersion + "." + window.buildVars.releaseVersion + "." + window.buildVars.revisionVersion,
            buildTimestamp: window.buildVars.buildTimestamp
        };

        // Define the top level Angular module for the application.
        ngModule = angular.module("JustinCredible.SampleApp.Application", ["ui.router", "ionic", "ngMockE2E"]);

        // Define our constants.
        ngModule.constant("isRipple", !!(window.parent && window.parent.ripple));
        ngModule.constant("isDebug", window.buildVars.debug);
        ngModule.constant("versionInfo", versionInfo);
        ngModule.constant("apiVersion", "1.0");

        // Define each of the services.
        ngModule.service("Utilities", Services.Utilities);
        ngModule.service("FileUtilities", Services.FileUtilities);
        ngModule.service("Logger", Services.Logger);
        ngModule.service("Preferences", Services.Preferences);
        ngModule.service("MockApis", Services.MockApis);
        ngModule.factory("HttpInterceptor", Services.HttpInterceptor.getFactory());
        ngModule.service("UiHelper", Services.UiHelper);

        // Define each of the directives.
        //ngModule.directive("chart", getDirectiveFactoryFunction(Directives.ChartDirective));

        // Define each of the controllers.
        ngModule.controller("MenuController", Controllers.MenuController);
        ngModule.controller("SettingsController", Controllers.SettingsController);
        ngModule.controller("ReorderCategoriesController", Controllers.ReorderCategoriesController);
        ngModule.controller("LogsController", Controllers.LogsController);
        ngModule.controller("LogEntryController", Controllers.LogEntryController);
        ngModule.controller("DeveloperController", Controllers.DeveloperController);
        ngModule.controller("AboutController", Controllers.AboutController);
        ngModule.controller("PinEntryController", Controllers.PinEntryController);
        ngModule.controller("ConfigurePinController", Controllers.ConfigurePinController);

        // Specify the initialize/run and configuration functions.
        ngModule.run(angular_initialize);
        ngModule.config(angular_configure);
    }

    //#region Helpers

    /**
     * Used to create a function that returns a data structure describing an Angular directive
     * from one of our own classes implementing IDirective. It handles creating the 
     * 
     * @param Directive A class reference (not instance) to a directive class that implements Directives.IDirective.
     */
    function getDirectiveFactoryFunction(Directive: Directives.IDirectiveClass): () => ng.IDirective {
        var descriptor: ng.IDirective = {};

        /*tslint:disable no-string-literals*/

        // Here we set the options for the Angular directive descriptor object.
        // We get these values from the static fields on the class reference.
        descriptor.restrict = Directive["restrict"];
        descriptor.template = Directive["template"];
        descriptor.replace = Directive["replace"];
        descriptor.transclude = Directive["transclude"];
        descriptor.scope = Directive["scope"];

        /*tslint:disable no-string-literals*/

        // Here we define the link function that Angular invokes when it is linking the
        // directive to the element.
        descriptor.link = (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void => {

            // New up the instance of our directive class.
            var instance = <Directives.IDirective>new Directive(scope, instanceElement, instanceAttributes, controller, transclude);

            // Delegate to the render method.
            instance.render();
        };

        // Finally, return a function that returns this Angular directive descriptor object.
        return function () { return descriptor; };
    }

    //#endregion

    //#region Platform Configuration

    /**
     * The main initialize/run function for Angular; fired once the AngularJs framework is done loading.
     */
    function angular_initialize($rootScope: ng.IScope, $ionicPlatform: Ionic.IPlatform, $ionicPopup: any, Utilities: Services.Utilities, UiHelper: Services.UiHelper, Preferences: Services.Preferences, MockApis: Services.MockApis): void {

        // Once AngularJs has loaded we'll wait for the Ionic platform's ready event.
        // This event will be fired once the device ready event fires via Cordova.
        $ionicPlatform.ready(function () {
            ionicPlatform_ready($rootScope, $ionicPlatform, $ionicPopup, UiHelper, Preferences);
        });

        // Mock up APIs for the various platforms. This allows us to "polyfill" functionality
        // that isn't available on all platforms.

        if (Utilities.isRipple) {
            setTimeout(function () { MockApis.mockForRippleEmulator(); }, 1000);

            // If we are in the Ripple emulator, Cordova will never fire it's ready event which
            // means Ionic will never fire it's platform ready. We'll do it here manually.
            ionicPlatform_ready($rootScope, $ionicPlatform, $ionicPopup, UiHelper, Preferences);
        }

        if (Utilities.isAndroid) {
            setTimeout(function () { MockApis.mockForAndroid(); }, 1000);
        }

        // Mock up or allow HTTP responses.
        MockApis.mockHttpCalls(Preferences.enableMockHttpCalls);
    };

    /**
     * Fired once the Ionic framework determines that the device is ready.
     * 
     * Note that this will not fire in the Ripple emulator because it relies
     * on the Codrova device ready event.
     */
    function ionicPlatform_ready($rootScope: ng.IScope, $ionicPlatform: Ionic.IPlatform, $ionicPopup: any, UiHelper: Services.UiHelper, Preferences: Services.Preferences): void {

        // This makes the status bar not overlay the webview, but unfortunately
        // doesn't free up the tall space on top of the ionic header element.
        //window.StatusBar.styleLightContent();
        //window.StatusBar.overlaysWebView(false);

        // Subscribe to device events.
        document.addEventListener("pause", _.bind(device_pause, null, Preferences));
        document.addEventListener("resume", _.bind(device_resume, null, UiHelper, Preferences));
        document.addEventListener("menubutton", _.bind(device_menuButton, null, $rootScope));

        // Now that the platform is ready, we'll delegate to the resume event.
        // We do this so the same code that fires on resume also fires when the
        // application is started for the first time.
        device_resume(UiHelper, Preferences);
    }

    /**
     * Function that is used to configure AngularJs.
     */
    function angular_configure($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $provide: ng.auto.IProvideService, $httpProvider: ng.IHttpProvider): void {

        // Intercept the default Angular exception handler.
        $provide.decorator("$exceptionHandler", function ($delegate: ng.IExceptionHandlerService) {
            return function (exception, cause) {
                // Delegate to our custom handler.
                angular_exceptionHandler(exception, cause);

                // Delegate to the default/base Angular behavior.
                $delegate(exception, cause);
            };
        });

        // Register our custom interceptor with the HTTP provider so we can hook into AJAX request events.
        $httpProvider.interceptors.push("HttpInterceptor");

        // Setup all of the client side routes and their controllers and views.
        setupAngularRoutes($stateProvider, $urlRouterProvider);

        // If mock API calls are enabled, then we'll add a random delay for all HTTP requests to simulate
        // network latency so we can see the spinners and loading bars. Useful for demo purposes.
        if (localStorage.getItem("ENABLE_MOCK_HTTP_CALLS") === "true") {
            JustinCredible.SampleApp.Services.MockApis.setupMockHttpDelay($provide);
        }
    };

    /**
     * Used to define all of the client-side routes for the application.
     * This maps routes to the controller/view that should be used.
     */
    function setupAngularRoutes($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        // Setup an abstract state for the tabs directive.
        $stateProvider.state("app", {
            url: "/app",
            abstract: true,
            templateUrl: "templates/Menu.html",
            controller: "MenuController"
        });

        // Define each of the states for each of the tabs; each tab has its own navigation history stack.

        $stateProvider.state("app.empty", {
            url: "/empty",
            views: {
                "menuContent": {
                    templateUrl: "templates/Empty.html"
                }
            }
        });

        $stateProvider.state("app.settings", {
            url: "/settings",
            views: {
                "menuContent": {
                    templateUrl: "templates/Settings.html",
                    controller: "SettingsController"
                }
            }
        });

        $stateProvider.state("app.configure-pin", {
            url: "/configure-pin",
            views: {
                "menuContent": {
                    templateUrl: "templates/ConfigurePin.html",
                    controller: "ConfigurePinController"
                }
            }
        });

        $stateProvider.state("app.developer", {
            url: "/developer",
            views: {
                "menuContent": {
                    templateUrl: "templates/Developer.html",
                    controller: "DeveloperController"
                }
            }
        });

        $stateProvider.state("app.logs", {
            url: "/logs",
            views: {
                "menuContent": {
                    templateUrl: "templates/Logs.html",
                    controller: "LogsController"
                }
            }
        });

        $stateProvider.state("app.logEntry", {
            url: "/logEntry/:id",
            views: {
                "menuContent": {
                    templateUrl: "templates/LogEntry.html",
                    controller: "LogEntryController"
                }
            }
        });

        $stateProvider.state("app.about", {
            url: "/about",
            views: {
                "menuContent": {
                    templateUrl: "templates/About.html",
                    controller: "AboutController"
                }
            }
        });

        // If none of the above states are matched, use the empty route.
        $urlRouterProvider.otherwise("/app/empty");
    }

    //#endregion

    //#region Event Handlers

    /**
     * Fired when the OS decides to minimize or pause the application. This usually
     * occurs when the user presses the device's home button or switches applications.
     */
    function device_pause(Preferences: Services.Preferences) {
        // Store the current date/time. This will be used to determine if we need to
        // show the PIN lock screen the next time the application is resumed.
        Preferences.lastPausedAt = moment();
    }

    /**
     * Fired when the OS restores an application to the foreground. This usually occurs
     * when the user launches an app that is already open or uses the OS task manager
     * to switch back to the application.
     */
    function device_resume(UiHelper: Services.UiHelper, Preferences: Services.Preferences) {
        // Potentially display the PIN screen.
        UiHelper.showPinEntryAfterResume();
    }

    /**
     * Fired when the menu hard (or soft) key is pressed on the device (eg Android menu key).
     * This isn't used for iOS devices because they do not have a menu button key.
     */
    function device_menuButton($rootScope: ng.IScope) {
        // Broadcast this event to all child scopes. This allows controllers for individual
        // views to handle this event and show a contextual menu etc.
        $rootScope.$broadcast("menubutton");
    }

    /**
     * Fired when an unhandled JavaScript exception occurs outside of Angular.
     */
    function window_onerror(message: any, uri: string, lineNumber: number, columnNumber?: number) {
        var Logger: Services.Logger;

        console.error("Unhandled JS Exception", message, uri, lineNumber, columnNumber);

        if (window.plugins && window.plugins.toast) {
            window.plugins.toast.showLongBottom("An error has occurred; please try again.");
        }

        if (window.ProgressIndicator) {
            window.ProgressIndicator.hide();
        }

        try {
        Logger = angular.element(document.body).injector().get("Logger");
        Logger.logWindowError(message, uri, lineNumber, columnNumber);
        }
        catch (ex) {
        }
    }

    /**
     * Fired when an exception occurs within Angular.
     * 
     * This includes uncaught exceptions in ng-click methods for example.
     */
    function angular_exceptionHandler(exception: Error, cause: string) {
        var message = exception.message,
            Logger: Services.Logger;

        if (!cause) {
            cause = "[Unknown]";
        }

        console.error("AngularJS Exception", exception, cause);

        if (window.plugins && window.plugins.toast) {
            window.plugins.toast.showLongBottom("An error has occurred; please try again.");
        }

        if (window.ProgressIndicator) {
            window.ProgressIndicator.hide();
        }

        try {
        Logger = angular.element(document.body).injector().get("Logger");
        Logger.logError("Angular exception caused by " + cause, exception);
        }
        catch (ex) {
        }
    };

    //#endregion
}