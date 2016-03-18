Ionic-TypeScript-MDHA-Starter
=============================

> Note: Unless you absolutely must use Visual Studio 2015, I strongly suggest using the IDE and platform agnostic version of this starter project: [Ionic-TypeScript-Starter](https://github.com/Justin-Credible/Ionic-TypeScript-Starter).

This is a sample project that I use as a starting point for developing new mobile applications. This starter project targets iOS, Android, and Chrome (as an extension).

It uses the [Ionic](http://ionicframework.com/) framework (version 1.x, built on [AngularJS](https://angularjs.org/) 1.x) which makes it possible to rapidly build apps that feel native.

The project is written primarily in [TypeScript](http://www.typescriptlang.org/) which decreases development time and increases maintainability (with object oriented and type-safe code, compile-time checking, and IDE tooling such as refactoring and code completion).

Development is done in Visual Studio 2015 using the [Visual Studio Tools for Apache Cordova](https://www.visualstudio.com/en-us/features/cordova-vs.aspx) project (previously known as **M**ulti-**D**evice **H**ybrid **A**pplication).

In-browser development and debugging is possible via the Chrome developer tools. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container. Both of these are provided out of the box when using VS2015.

## Documentation

Documentation is available online at the [project website](http://Justin-Credible.github.io/Ionic-TypeScript-Starter).

> Note: Currently, this documentation is for the IDE and platform agnostic version of this starter project: [Ionic-TypeScript-Starter](https://github.com/Justin-Credible/Ionic-TypeScript-Starter). There may be several discrepancies, some of which are explained below.

## Environment Setup

The following external prerequisites are required:

* [Visual Studio 2015 Community](https://www.visualstudio.com/) with Update 1
* Apache Cordova tools for Visual Studio (included with Visual Studio 2015)
* [Node.js](https://nodejs.org/dist/v4.2.2/) 4.2.2

> Note: If you want to run on a emulator or physical device, you'll need your environment setup for iOS or Android development.

### Configure Visual Studio

This project uses gulp to build TypeScript, SASS, etc. You'll want to make sure the **Task Runner Explorer** window is visible:

* View > Other Windows > Task Runner Explorer

Next, configure Visual Studio to use the same version of Node that is available via your path:

1. Tools > Options
1. Projects and Solutions
1. External Web Tools
2. Add the path to your node installation to the top of the list (eg `C:\Program Files\nodejs`)

This can be verified by executing `node --version` at a command prompt and comparing the version to the `gulp echo-node-version` task when executed from Visual Studio's task runner explorer. More details are available [here](http://ryanhayes.net/synchronize-node-js-install-version-with-visual-studio-2015/).

### Modify your path

All other dependencies are installed in the project directory via `npm`. To use them **you'll need to add `./node_modules/.bin` to your path**. Using the dependencies directly from the project directory reduces dependency hell with globally installed modules and ensures all development is done using the exact same versions of the modules.

The path should be appended via the System > Environment Variables GUI and Visual Studio should be restarted for the changes to take effect.

## Getting Started

In addition to installing Visual Studio, the installer will take care of downloading and setting up all the dependencies you need for developing Cordova applications (Node.js, Apache Ant, Oracle JDK 7, the Android SDK, Google Chrome and more).

You can clone the repository to your machine using:

	$ git clone https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter

Once you've installed VS2015, and cloned this repository you should be able to open the solution file:

	Ionic-TypeScript-MDHA-Starter.sln
 
In the solution explorer you'll see a dependencies node with both the node and bower dependencies. If they do not automatically begin restoring, you'll have to right click them manually.

After the dependencies are installed, you can use the various gulp tasks from the Task Runner Explorer or the command line.

## Gulp Tasks

The following tasks can be used to perform code configuration, library and plugin setup, and TypeScript compilation.

    $ gulp config     # Creates www/js/build-vars.js from config.xml and runtime-config.json values
    $ gulp templates  # Compiles Angluar HTML templates from src/Views/**/*.html to www/js/templates.js
    $ gulp sass       # Compiles SASS from src/Styles/Index.scss to www/css/bundle.css
    $ gulp libs       # Install third Party JS libraries to www/lib as defined in bower.json
    $ gulp tsd        # Install TypeScript definitions as defined in tsd.json
    $ gulp ts         # Compiles TypeScript code as configured by src/tsconfig.json

> Note: You can also just run `gulp` without any arguments which will run all of the above targets.

> Note: If you have issues running `gulp` or any of the gulp tasks above, ensure that you've added `./node_modules/bin` to your path and that it is tawking precedence over npm's global location. You can verify this by using the `which gulp.cmd` from the project directory. The local `node_modules` path should be listed first. In addition, `where tsc.exe` should be run to ensure the TypeScript compiler used is from the project directory instead of Visual Studio's global version.

After you've run the tasks, you can now use the Visual Studio play button to launch the Ripple emulator.

