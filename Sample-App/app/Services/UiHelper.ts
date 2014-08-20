module JustinCredible.SampleApp.Services {

    /**
    * Provides a common set of helper methods for working with the UI.
    */
    export class UiHelper {

        public static $inject = ["$rootScope", "$q", "$http", "$ionicModal", "Utilities", "Preferences"];

        private $rootScope: ng.IRootScopeService;
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        private $ionicModal: any;
        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        private isPinEntryOpen = false;
        private isLoginOpen = false;

        constructor($rootScope: ng.IRootScopeService, $q: ng.IQService, $http: ng.IHttpService, $ionicModal: any, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$http = $http;
            this.$ionicModal = $ionicModal;
            this.Utilities = Utilities;
            this.Preferences = Preferences;

            this.isPinEntryOpen = false;
            this.isLoginOpen = false;
        }

        //#region Native Dialogs

        /**
         * Shows a native alert dialog with an OK button and "Alert" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog with an OK button.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * @param buttonName The label for the button, defaults to "OK".
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title: string, buttonName: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * @param buttonName The label for the button, defaults to "OK".
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title?: string, buttonName?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                alertCallback: () => void;

            // Default the title.
            title = title || "Alert";

            // Default the button name.
            buttonName = buttonName || "OK";

            navigator.notification.alert(message, alertCallback, title, buttonName);

            return q.promise;
        }

        /**
         * Displays a native confirm dialog with "Yes" and "No" buttons and "Confirm" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog with "Yes" and "No" buttons.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title: string): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "Yes" and "No".
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title: string, buttonLabels: string[]): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "Yes" and "No".
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title?: string, buttonLabels?: string[]): ng.IPromise<string> {
            var q = this.$q.defer<string>(),
                callback: (choice: number) => void;

            // Default the title.
            title = title || "Confirm";

            // Default the buttons array.
            buttonLabels = buttonLabels || ["Yes", "No"];

            // Define the callback that is executed when the dialog is closed.
            callback = (choice: number): void => {
                var promiseResult: Models.KeyValuePair<string, string>,
                    buttonText: string;

                // Get the button text for the button that was clicked; the callback
                // gives us a button index that is 1 based (not zero based!).
                buttonText = buttonLabels[choice - 1];

                q.resolve(buttonText);
            };

            // Show the prompt.
            navigator.notification.confirm(message, callback, title, buttonLabels);

            return q.promise;
        }

        /**
         * Shows a native prompt dialog with "OK" and "Cancel" buttons with "Prompt" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog with "OK" and "Cancel" buttons.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "OK" and "Cancel".
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string, buttonLabels: string[]): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "OK" and "Cancel".
         * @param defaultText Default text box input value, default is an empty string.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string, buttonLabels: string[], defaultText: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "OK" and "Cancel".
         * @param defaultText Default text box input value, default is an empty string.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title?: string, buttonLabels?: string[], defaultText?: string): ng.IPromise<Models.KeyValuePair<string, string>> {
            var q = this.$q.defer<Models.KeyValuePair<string, string>>(),
                callback: (result: NotificationPromptResult) => void;

            // Default the title
            title = title || "Prompt";

            // Default the buttons array.
            buttonLabels = buttonLabels || ["OK", "Cancel"];

            // Define the callback that is executed when the dialog is closed.
            callback = (promptResult: NotificationPromptResult): void => {
                var promiseResult: Models.KeyValuePair<string, string>,
                    buttonText: string;

                // Get the button text for the button that was clicked; the callback
                // gives us a button index that is 1 based (not zero based!).
                buttonText = buttonLabels[promptResult.buttonIndex - 1];

                // Define the result object that we'll use the resolve the promise.
                // This contains the button that was selected as well as the contents
                // of the text box.
                promiseResult = new Models.KeyValuePair<string, string>(buttonText, promptResult.input1);

                q.resolve(promiseResult);
            };

            // Show the prompt.
            navigator.notification.prompt(message, callback, title, buttonLabels, defaultText);

            return q.promise;
        }

        //#endregion

        //#region Modal Dialogs

        /**
         * Used to show the PIN entry prompt dialog.
         * 
         * @param pinToMatch The PIN to validate against; if provided validation will occur and if they don't match
         *                      the dialog will not close automatically until it is matched. If not provided then
         *                      the dialog will close once the user enters a PIN.
         * @param showBackButton Indicates if the back (cancel) button should be click-able by the user.
         * @param promptText The text to show above the PIN fields.
         * @param hideBackground Optional parameter used to indicate the content in the background shouldn't be visible (defaults to false).
         * @returns A promise which will be resolved once the dialog has closed. It will include a single parameter
         *          of type string. This will be populated with the PIN value that was entered (or null if the user
         *          clicked the cancel button).
         */
        public showPinEntry(pinToMatch: string, showBackButton: boolean, promptText: string, hideBackground?: boolean): ng.IPromise<string> {
            var q = this.$q.defer<string>(),
                backdrop: HTMLDivElement,
                creationPromise: ng.IPromise<string>;

            // If the dialog is already open, then we don't want to open another.
            // In this case, we explicitly reject the promise.
            if (this.isPinEntryOpen) {
                q.reject("ALREADY_OPEN");
                return q.promise;
            }

            // Create the modal dialog.
            creationPromise = this.$ionicModal.fromTemplateUrl("templates/PinEntry.html", {
                backdropClickToClose: false,
                hardwareBackButtonClose: false,
                showBackButton: showBackButton,
                pinToMatch: pinToMatch,
                promptText: promptText
            });

            // Once it has been created then...
            creationPromise.then((modal: any) => {

                // ... show the dialog.
                modal.show();
                this.isPinEntryOpen = true;

                if (hideBackground) {
                    // HACK: Here we adjust the background color's alpha value so the user can't
                    // see through the overlay. At some point we should update this to use a blur
                    // effect similar to this: http://ionicframework.com/demos/frosted-glass/
                    backdrop = <HTMLDivElement> document.querySelector("div.modal-backdrop");
                    backdrop.style.backgroundColor = "rgba(0, 0, 0, 1)";
                }

                // Subscribe to the close event.
                modal.scope.$on("modal.hidden", () => {

                    if (hideBackground) {
                        // HACK: Restore the backdrop's background color value.
                        backdrop.style.backgroundColor = "";
                    }

                    this.isPinEntryOpen = false;

                    // Once the dialog is closed, resolve the original promise
                    // using the result (the PIN) from the dialog.
                    q.resolve(<string>modal.result);

                });
            });

            return q.promise;
        }

        /**
         * Used to show the reorder categories dialog.
         * 
         * @returns A promise which will be resolved once the dialog has closed.
         */
        public showReorder(): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                creationPromise: ng.IPromise<void>;

            // Create the modal dialog.
            creationPromise = this.$ionicModal.fromTemplateUrl("templates/ReorderCategories.html", {
                backdropClickToClose: true,
                hardwareBackButtonClose: true
            });

            // Once it has been created then...
            creationPromise.then((modal: any) => {

                // ... show the dialog.
                modal.show();

                // Subscribe to the close event.
                modal.scope.$on("modal.hidden", () => {

                    // Once the dialog is closed, resolve the original promise.
                    q.resolve();

                });
            });

            return q.promise;
        }

        //#endregion

        //#region Helpers for the device_resume event

        public showPinEntryAfterResume(): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                resumedAt: Moment;

            // If the PIN entry dialog then there is nothing to do.
            if (this.isPinEntryOpen) {
                q.reject("ALREADY_OPEN");
                return q.promise;
            }

            // If there is a PIN set and a last paused time then we need to determine if we
            // need to show the lock screen.
            if (this.Preferences.pin && this.Preferences.lastPausedAt != null && this.Preferences.lastPausedAt.isValid()) {
                // Get the current time.
                resumedAt = moment();

                // If the time elapsed since the last pause event is greater than the threshold,
                // then we need to show the lock screen.
                if (resumedAt.diff(this.Preferences.lastPausedAt, "minutes") > this.Preferences.requirePinThreshold) {
                    this.showPinEntry(this.Preferences.pin, false, "PIN Required", true).then(() => {
                        // Once a matching PIN is entered, then we can resolve.
                        q.resolve();
                    });
                }
                else {
                    // If we don't need to show the PIN screen, then immediately resolve.
                    q.resolve();
                }
            }
            else {
                // If we don't need to show the PIN screen, then immediately resolve.
                q.resolve();
            }

            return q.promise;
        }

        //#endregion
    }
}