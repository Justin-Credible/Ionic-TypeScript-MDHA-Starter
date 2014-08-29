module JustinCredible.SampleApp.Controllers {

    export interface IConfigurePinController {
        viewModel: ViewModels.ConfigurePinViewModel;
    }

    export class ConfigurePinController extends BaseController<ViewModels.ConfigurePinViewModel> implements IConfigurePinController {

        public static $inject = ["$scope", "UiHelper", "Preferences"];

        private UiHelper: Services.UiHelper;
        private Preferences: Services.Preferences;

        private modalInstance: any;

        constructor($scope: ng.IScope, UiHelper: Services.UiHelper, Preferences: Services.Preferences) {
            super($scope, ViewModels.ConfigurePinViewModel);

            this.UiHelper = UiHelper;
            this.Preferences = Preferences;

            this.viewModel.isPinSet = Preferences.pin !== null;
        }

        //#region Controller Methods

        public setPin_click() {

            // Show the PIN entry dialog.
            this.UiHelper.showPinEntry(null, true, "Enter a value for your new PIN").then((newPin1: string) => {

                // If there was a PIN returned, they didn't cancel.
                if (newPin1) {

                    // Show a second prompt to make sure they enter the same PIN twice.
                    // We pass in the first PIN value because we want them to be able to match it.
                    this.UiHelper.showPinEntry(newPin1, true, "Confirm your new PIN").then((newPin2: string) => {

                        // If there was a PIN returned, they didn't cancel and we know it matched.
                        if (newPin2) {
                            this.Preferences.pin = newPin2;
                            this.viewModel.isPinSet = true;

                            window.plugins.toast.showShortBottom("Your PIN has been configured.");
                        }
                    });
                }
            });
        }

        public changePin_click() {

            // Show the PIN entry dialog; pass the existing PIN which they need to match.
            this.UiHelper.showPinEntry(this.Preferences.pin, true, "Enter your current PIN").then((currentPin: string) => {

                // If there was a PIN returned, they didn't cancel, and it must have matched.
                if (currentPin) {

                    // Now, prompt for the new PIN.
                    this.UiHelper.showPinEntry(null, true, "Enter your new PIN").then((newPin1: string) => {

                        // If there was a PIN returned, they didn't cancel.
                        if (newPin1) {

                            // Show a second prompt to make sure they enter the same PIN twice.
                            // We pass in the first PIN value because we want them to be able to match it.
                            this.UiHelper.showPinEntry(newPin1, true, "Confirm your new PIN").then((newPin2: string) => {

                                // If there was a PIN returned, they didn't cancel.
                                if (newPin2) {
                                    this.Preferences.pin = newPin2;
                                    this.viewModel.isPinSet = true;

                                    window.plugins.toast.showShortBottom("Your PIN has been changed.");
                                }
                            });
                        }
                    });
                }
            });
        }

        public removePin_click() {

            // Show the PIN entry dialog; pass the existing PIN which they need to match.
            this.UiHelper.showPinEntry(this.Preferences.pin, true, "Enter your current PIN").then((pin: string) => {

                // If there was a PIN returned, they didn't cancel and we know it matched.
                if (pin) {
                    this.Preferences.pin = null;
                    this.viewModel.isPinSet = false;

                    window.plugins.toast.showShortBottom("The PIN has been removed.");
                }

            });
        }

        //#endregion
    }
}