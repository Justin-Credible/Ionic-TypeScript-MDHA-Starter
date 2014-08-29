module JustinCredible.SampleApp.Controllers {

    export interface IPinEntryController {
        viewModel: ViewModels.PinEntryViewModel;
    }

    export class PinEntryController extends BaseController<ViewModels.PinEntryViewModel> implements IPinEntryController {

        public static $inject = ["$scope", "Utilities", "Preferences"];

        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        private modalInstance: any;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            super($scope, ViewModels.PinEntryViewModel);

            this.Utilities = Utilities;
            this.Preferences = Preferences;

            this.viewModel.pin = "";

            $scope.$on("modal.shown", _.bind(this.modal_shown, this));
        }

        //#region Event Handlers

        private modal_shown(ngEvent: ng.IAngularEvent, instance: any) {

            // Only respond to modal.shown events for the PIN Entry dialog.
            if (instance.dialogId !== Services.UiHelper.PIN_ENTRY_DIALOG_ID) {
                return;
            }

            this.modalInstance = instance;

            this.viewModel.pin = instance.pin == null ? "" : instance.pin;
            this.viewModel.showBackButton = !!instance.showBackButton;
            this.viewModel.pinToMatch = instance.pinToMatch;
            this.viewModel.promptText = instance.promptText;
        }

        //#endregion

        //#region Private Methods

        private validatePin() {

            if (this.viewModel.pinToMatch) {

                // If there is a PIN to match, then we'll see if it matches. This is
                // for the case when we are validating a user entered PIN against one
                // that is already configured.

                if (this.viewModel.pin === this.viewModel.pinToMatch) {
                    // If the PIN values match, then close this dialog instance.
                    this.modalInstance.result = this.viewModel.pin;
                    this.modalInstance.hide();
                    this.modalInstance.remove();
                }
                else {
                    // If the PIN values do not match, then clear the fields and remain
                    // open so the user can try again.
                    this.viewModel.pin = "";
                    window.plugins.toast.showShortTop("Invalid pin; please try again.");
                    this.scope.$apply();
                }
            }
            else {
                // If we aren't attempting to match a PIN, then this must be a prompt
                // for a new PIN value. In this case we can just set the result and
                // close this modal instance.
                this.modalInstance.result = this.viewModel.pin;
                this.modalInstance.hide();
                this.modalInstance.remove();
            }
        }

        //#endregion

        //#region Controller Methods

        public number_click(value: number) {

            if (this.viewModel.pin.length < 4) {
                this.viewModel.pin += value;

                // If all four digits have been entered then we need to take action.
                // We wait a fraction of a second so that the user can see the last
                // digit in the PIN appear in the UI.
                if (this.viewModel.pin.length === 4) {
                    _.delay(_.bind(this.validatePin, this), 700);
                }
            }
        }

        public clear_click() {
            this.viewModel.pin = "";
        }

        public back_click() {
            this.modalInstance.result = null;
            this.modalInstance.hide();
            this.modalInstance.remove();
        }

        //#endregion
    }
}