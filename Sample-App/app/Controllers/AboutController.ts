module JustinCredible.SampleApp.Controllers {

    export interface IAboutController {
        viewModel: ViewModels.AboutViewModel;
    }

    export class AboutController extends BaseController<ViewModels.AboutViewModel> implements IAboutController {

        public static $inject = ["$scope", "$location", "Utilities", "Preferences", "versionInfo"];

        private $location: ng.ILocationService;
        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $location: ng.ILocationService, Utilities: Services.Utilities, Preferences: Services.Preferences, versionInfo: JustinCredible.SampleApp.DataTypes.IVersionInfo) {
            super($scope, ViewModels.AboutViewModel);

            this.$location = $location;
            this.Utilities = Utilities;
            this.Preferences = Preferences;

            this.viewModel.logoClickCount = 0;

            this.viewModel.applicationName = versionInfo.applicationName;
            this.viewModel.websiteUrl = versionInfo.websiteUrl;
            this.viewModel.githubUrl = versionInfo.githubUrl;
            this.viewModel.versionString = Utilities.format("{0}.{1}.{2}.{3}", versionInfo.majorVersion, versionInfo.minorVersion, versionInfo.releaseVersion, versionInfo.revisionVersion);
            this.viewModel.timestamp = versionInfo.buildTimestamp;
        }

        //#region Controller Methods

        public logo_click() {

            if (this.Preferences.enableDeveloperTools) {
                return;
            }

            this.viewModel.logoClickCount += 1;

            // If they've clicked the logo 10 times, then enable development tools
            // and push them back to the settings page.
            if (this.viewModel.logoClickCount > 9) {
                this.Preferences.enableDeveloperTools = true;
                window.plugins.toast.showShortBottom("Development Tools Enabled!");
                this.$location.path("/app/settings");
            }
        }

        //#endregion
    }
}