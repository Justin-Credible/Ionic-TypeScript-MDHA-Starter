module JustinCredible.SampleApp.Controllers {

    export interface ISettingsController {
        viewModel: ViewModels.SettingsViewModel;
    }

    export class SettingsController extends BaseController<ViewModels.SettingsViewModel> implements ISettingsController {

        public static $inject = ["$scope", "Utilities", "Preferences"];

        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            super($scope, ViewModels.SettingsViewModel);

            this.Utilities = Utilities;
            this.Preferences = Preferences;

            this.viewModel.isDebugMode = this.Utilities.isDebugMode;
            this.viewModel.isDeveloperMode = this.Preferences.enableDeveloperTools;
        }
    }
}