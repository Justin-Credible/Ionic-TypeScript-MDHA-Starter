/**
 * This module is used to house interfaces describing server-side data types
 * that are used on the client-side (eg as parameters or responses to/from
 * AJAX calls).
 */
declare module JustinCredible.SampleApp.DataTypes {

    //#region Client-side only types

    interface IVersionInfo {
        majorVersion: number;
        minorVersion: number;
        releaseVersion: number;
        revisionVersion: number;
        versionString: string;
        buildTimestamp: string;
        applicationName: string;
        websiteUrl: string;
        githubUrl: string;
        email: string;
    }

    //#endregion

    //#region Tokens, etc

    interface ITokenResponse {
        expires: number;
        token: string;
    }

    //#endregion
}