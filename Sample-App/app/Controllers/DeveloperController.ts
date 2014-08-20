module JustinCredible.SampleApp.Controllers {

    export interface IDeveloperController {
        viewModel: ViewModels.DeveloperViewModel;
    }

    export class DeveloperController extends BaseController<ViewModels.DeveloperViewModel> implements IDeveloperController {

        public static $inject = ["$scope", "$http", "Utilities", "UiHelper", "FileUtilities", "Logger", "Preferences", "MockApis"];

        private $http: ng.IHttpService;
        private Utilities: Services.Utilities;
        private UiHelper: Services.UiHelper;
        private FileUtilities: Services.FileUtilities;
        private Logger: Services.Logger;
        private Preferences: Services.Preferences;
        private MockApis: Services.MockApis;

        constructor($scope: ng.IScope, $http: ng.IHttpService, Utilities: Services.Utilities, UiHelper: Services.UiHelper, FileUtilities: Services.FileUtilities, Logger: Services.Logger, Preferences: Services.Preferences, MockApis: Services.MockApis) {
            super($scope, ViewModels.DeveloperViewModel);

            this.$http = $http;
            this.Utilities = Utilities;
            this.UiHelper = UiHelper;
            this.FileUtilities = FileUtilities;
            this.Logger = Logger;
            this.Preferences = Preferences;
            this.MockApis = MockApis;

            this.viewModel.mockApiRequests = this.Preferences.enableMockHttpCalls;

            this.viewModel.devicePlatform = device.platform;
            this.viewModel.loggingToLocalStorage = this.Logger.getLogToLocalStorage() + "";
            this.viewModel.defaultStoragePathId = this.FileUtilities.getDefaultRootPathId();
            this.viewModel.defaultStoragePath = this.FileUtilities.getDefaultRootPath();
        }

        //#region Private Helper Methods

        private alertFileIoError(error: any) {
            if (error) {
                if (error.code) {
                    this.UiHelper.alert(error.code);
                }
                else if (error.message) {
                    this.UiHelper.alert(error.message);
                }
                else {
                    this.UiHelper.alert(error);
                }
            }
        }

        //#endregion

        //#region Controller Methods

        public mockApiRequests_change() {
            var message: string;

            this.Preferences.enableMockHttpCalls = this.viewModel.mockApiRequests;

            message = "The application needs to be reloaded for changes to take effect. Reload now?";

            this.UiHelper.confirm(message, "Confirm Reload").then((result: string) => {
                if (result === "Yes") {
                    document.location.href = "index.html";
                }
            });
        }

        public setLoggingMode_click() {
            var message: string;

            message = "Enable exception logging to local storage? Current setting is " + this.Logger.getLogToLocalStorage();

            this.UiHelper.confirm(message).then((result: string) => {
                var enable = result === "Yes";

                this.viewModel.loggingToLocalStorage = enable + "";
                this.Logger.setLogToLocalStorage(enable);

                if (enable) {
                    this.UiHelper.alert("Logs will be written to local storage.");
                }
                else {
                    this.UiHelper.alert("Logs will not be written to local storage; they will be stored in-memory only.");
                }
            });
        }

        public setHttpLoggingMode_click() {
            var message: string;

            message = "Enable logging of all HTTP requests (even non-errors)? Current setting is " + this.Preferences.enableFullHttpLogging;

            this.UiHelper.confirm(message).then((result: string) => {
                var enable = result === "Yes";

                this.Preferences.enableFullHttpLogging = enable;

                if (enable) {
                    this.UiHelper.alert("ALL HTTP requests and responses will be logged.");
                }
                else {
                    this.UiHelper.alert("Only HTTP errors will be logged.");
                }
            });
        }

        public addModulesToGlobalScope_click() {
            /*tslint:disable no-string-literals*/
            window["__FileUtilities"] = this.FileUtilities;
            window["__Logger"] = this.Logger;
            /*tslint:enable no-string-literals*/

            this.UiHelper.alert("Added __FileUtilities and __Logger to window.");
        }

        public setRequirePinThreshold_click() {
            var message: string;

            message = this.Utilities.format("Enter the value (in minutes) for PIN prompt threshold? Current setting is {0} minutes.", this.Preferences.requirePinThreshold);

            this.UiHelper.prompt(message, "Require PIN Threshold", null, this.Preferences.requirePinThreshold.toString()).then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                if (isNaN(parseInt(result.value, 10))) {
                    this.UiHelper.alert("Invalid value; a number is required.");
                    return;
                }

                this.Preferences.requirePinThreshold = parseInt(result.value, 10);

                this.UiHelper.alert(this.Utilities.format("PIN prompt threshold is now set to {0} minutes.", result.value));
            });
        }

        public testJsException_click() {
            /*tslint:disable no-string-literal*/

            // Cause an exception by referencing an undefined variable.
            // We use defer so we can execute outside of the context of Angular.
            _.defer(function () {
                var x = window["____asdf"].blah();
            });

            /*tslint:enable no-string-literal*/
        }

        public testAngularException_click() {
            /*tslint:disable no-string-literal*/
            
            // Cause an exception by referencing an undefined variable.
            var x = window["____asdf"].blah();

            /*tslint:enable no-string-literal*/
        }

        public apiGetToken_click() {
            var httpConfig: Interfaces.IRequestConfig;

            httpConfig = {
                method: "GET",
                url: "~/tokens/" + this.Preferences.token,
                data: null,
                blocking: true,
                blockingText: "Retrieving Token Info..."
            };

            this.$http(httpConfig).then((response: ng.IHttpPromiseCallbackArg<DataTypes.ITokenResponse>) => {
                var message = this.Utilities.format("Token: {0}\nExpires: {1}", response.data.token, response.data.expires);
                this.UiHelper.alert(message);
            });
        }

        public showFullScreenBlock_click() {
            window.ProgressIndicator.showSimpleWithLabel(true, "Authenticating...");

            setTimeout(function () {
                window.ProgressIndicator.hide();
            }, 4000);
        }

        public startProgress_click() {
            NProgress.start();
        }

        public incrementProgress_click() {
            NProgress.inc();
        }

        public doneProgress_click() {
            NProgress.done();
        }

        public showPinEntry_click() {
            this.UiHelper.showPinEntry(null, true, "Testing new PIN entry").then((pin: string) => {
                this.UiHelper.alert("PIN entered: " + pin);
            });
        }

        public showPinEntry1234_click() {
            this.UiHelper.showPinEntry("1234", true, "Testing PIN matching (1234)").then((pin: string) => {
                this.UiHelper.alert("PIN entered: " + pin);
            });
        }

        public readFile_click() {
            this.UiHelper.prompt("Enter file name to read from", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                this.FileUtilities.readTextFile(result.value)
                    .then((text) => { console.log(text); this.UiHelper.alert(text);; },
                    (err) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        public writeFile_click() {
            var path: string,
                contents: string;

            this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.UiHelper.prompt("Enter file contents").then((result: Models.KeyValuePair<string, string>) => {

                    if (result.key !== "OK") {
                        return;
                    }

                    contents = result.value;

                    this.FileUtilities.writeTextFile(path, contents, false)
                        .then(() => { console.log("WRITE OK"); this.UiHelper.alert("WRITE OK"); },
                        (err) => { console.error(err); this.alertFileIoError(err); });
                });
            });
        }

        public appendFile_click() {
            var path: string,
                contents: string;

            this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                this.UiHelper.prompt("Enter file contents", "File I/O Test", null, " / ").then((result: Models.KeyValuePair<string, string>) => {

                    if (result.key !== "OK") {
                        return;
                    }

                    contents = result.value;

                    this.FileUtilities.writeTextFile(path, contents, true)
                        .then(() => { console.log("APPEND OK"); this.UiHelper.alert("APPEND OK"); },
                        (err) => { console.error(err); this.alertFileIoError(err); });
                });
            });
        }

        public createDir_click() {
            var path: string;

            this.UiHelper.prompt("Enter dir name to create", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.createDirectory(path)
                    .then(() => { console.log("CREATE DIR OK"); this.UiHelper.alert("CREATE DIR OK"); },
                    (err) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        public listFiles_click() {
            var path: string,
                list = "";

            this.UiHelper.prompt("Enter path to list files", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.getFilePaths(path)
                    .then((files) => {
                        console.log(files);

                        files.forEach((value: string) => {
                            list += "\n" + value;
                        });

                        this.UiHelper.alert(list);
                    },
                    (err) => {
                        console.error(err);
                        this.alertFileIoError(err);
                    });
            });
        }

        public listDirs_click() {
            var path: string,
                list = "";

            this.UiHelper.prompt("Enter path to list dirs", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.getDirectoryPaths(path)
                    .then((dirs) => {
                        console.log(dirs);

                        dirs.forEach((value: string) => {
                            list += "\n" + value;
                        });

                        this.UiHelper.alert(list);
                    },
                    (err) => {
                        console.error(err);
                        this.alertFileIoError(err);
                    });
            });
        }

        public deleteFile_click() {
            var path: string;

            this.UiHelper.prompt("Enter path to delete file", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.deleteFile(path)
                    .then(() => { console.log("DELETE FILE OK"); this.UiHelper.alert("DELETE FILE OK"); },
                    (err) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        public deleteDir_click() {
            var path: string;

            this.UiHelper.prompt("Enter path to delete dir", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.deleteDirectory(path)
                    .then(() => { console.log("DELETE DIR OK"); this.UiHelper.alert("DELETE FILE OK"); },
                    (err) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        //#endregion
    }
}