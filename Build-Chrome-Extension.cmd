@ECHO OFF

REM Configuration Parameters
SET MsBuildPath="C:\Program Files (x86)\MSBuild\14.0\Bin\msbuild.exe"
SET MDAVsixDir=%VS140COMNTOOLS%..\IDE\EXTENSIONS\ApacheCordovaTools\
SET NodeJsDir=C:\Program Files\nodejs\
SET NpmInstallDir=%APPDATA%\npm
SET SolutionName=JustinCredible.SampleApp.sln
SET ProjectDirName=Sample-App
SET ConfigurationName=Debug

REM First perform a solution clean.
ECHO Cleaning...
%MsBuildPath% %SolutionName% /t:Clean

REM Perform a build arbitrarily using the Android Nexus for Ripple configuration.
REM We just need the TypeScript files to be compiled, we don't really care about the platform at this point.
ECHO Building with Apache Tools for Visual Studio...
%MsBuildPath% %SolutionName% /p:Configuration=%ConfigurationName% /p:LangName=en-US /p:Platform=Android /p:DebuggerFlavor=RippleNexus

REM Create a directory that will hold the Chrome extension.
ECHO Packaing Chrome extension...
mkdir %ProjectDirName%\bin\Chrome

REM Copy over the extension manifest and icon files.
copy %ProjectDirName%\chrome-manifest.json %ProjectDirName%\bin\Chrome\manifest.json
copy %ProjectDirName%\res\icons\android\icon-96-xhdpi.png %ProjectDirName%\bin\Chrome\icon.png

REM Copy the application payload.
xcopy /E %ProjectDirName%\platforms\android\assets\www %ProjectDirName%\bin\Chrome

REM Loading the Cordova script inside of a Chrome extension can cause issues, so here we just blank it out.
ECHO // Cordova.js is not needed for a Chrome extension. > %ProjectDirName%\bin\Chrome\Cordova.js

ECHO Chrome extension output location:
ECHO .\%ProjectDirName%\bin\Chrome