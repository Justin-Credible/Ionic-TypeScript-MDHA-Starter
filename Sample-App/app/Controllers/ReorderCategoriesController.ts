module JustinCredible.SampleApp.Controllers {

    export interface IReorderCategoriesController {
        viewModel: ViewModels.ReorderCategoriesViewModel;
    }

    export class ReorderCategoriesController extends BaseController<ViewModels.ReorderCategoriesViewModel> implements IReorderCategoriesController {

        public static $inject = ["$scope", "Utilities", "Preferences"];

        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        private modalInstance: any;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            super($scope, ViewModels.ReorderCategoriesViewModel);

            this.Utilities = Utilities;
            this.Preferences = Preferences;

            // Grab the available categories.
            this.viewModel.categories = this.Utilities.categories;

            // Subscribe to the modal shown event.
            $scope.$on("modal.shown", _.bind(this.modal_shown, this));
        }

        //#region Event Handlers

        private modal_shown(ngEvent: ng.IAngularEvent, instance: any) {
            this.modalInstance = instance;
        }

        //#endregion

        //#region Controller Methods

        public item_reorder(item: ViewModels.CategoryItemViewModel, fromIndex: number, toIndex: number) {
            this.viewModel.categories.splice(fromIndex, 1);
            this.viewModel.categories.splice(toIndex, 0, item);
        }

        public done_click() {
            var categoryOrder: string[] = [];

            this.viewModel.categories.forEach((categoryItem: ViewModels.CategoryItemViewModel) => {
                categoryOrder.push(categoryItem.name);
            });

            this.Preferences.categoryOrder = categoryOrder;

            this.modalInstance.hide();
            this.modalInstance.remove();
        }

        //#endregion
    }
}