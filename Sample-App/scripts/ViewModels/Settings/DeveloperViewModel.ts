﻿module JustinCredible.SampleApp.ViewModels {

    export class DeveloperViewModel {
        mockApiRequests: boolean;

        enableFullHttpLogging: boolean;

        logToLocalStorage: boolean;

        devicePlatform: string;
        deviceModel: string;
        deviceOsVersion: string;
        deviceUuid: string;
        deviceCordovaVersion: string;

        userId: string;
        token: string;

        defaultStoragePathId: string;
        defaultStoragePath: string;

        apiUrl: string;
    }
}
