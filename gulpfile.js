
/*globals Buffer, __dirname, process*/

// Native Node Modules
var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");

// Gulp & Gulp Plugins
var gulp = require("gulp");
var gutil = require("gulp-util");
var rename = require("gulp-rename");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var typedoc = require("gulp-typedoc");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var templateCache = require("gulp-angular-templatecache");

// Other Modules
var del = require("del");
var runSequence = require("run-sequence");
var bower = require("bower");
var request = require("request");
var xpath = require("xpath");
var XmlDom = require("xmldom").DOMParser;
var xmlSerializer = new (require("xmldom")).XMLSerializer;
var KarmaServer = require("karma").Server;


var paths = {
    ts: ["./src/**/*.ts"],
    templates: ["./src/**/*.html"],
    sassIndex: "./src/Styles/Index.scss",
    sass: ["./src/Styles/**/*.scss"],
    www: ["./www/**/*.*"],
    tests: ["./tests/**/*.ts"],
    chromeIcon: ["./resources/icon.png"],
    chromeManifest: ["./chrome-manifest.json"]
};

/**
 * Used to determine if the gulp operation was launched for a debug or release build.
 * This is controlled by the debug flag in runtime-config.json.
 */
function isDebugBuild() {

    var runtimeConfigJson = fs.readFileSync("runtime-config.json", "utf8");

    // Remove BOM marker on Windows - http://stackoverflow.com/a/24376813
    runtimeConfigJson = runtimeConfigJson.toString().replace(/^\uFEFF/, "");

    var runtimeConfig = JSON.parse(runtimeConfigJson);
    return !!runtimeConfig.debug;
}

/**
 * Helper used to pipe an arbitrary string value into a file.
 * 
 * http://stackoverflow.com/a/23398200/4005811
 */
function string_src(filename, str) {
    var src = require("stream").Readable({ objectMode: true });

    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(str) }));
        this.push(null);
    };

    return src;
}

/**
 * Used to verify the version of node that is being used to execute gulp.
 * Useful to verify that your Visual Studio instance is using the same
 * version as the one you are using from the command line. If the versions
 * are different, be sure to add your node path to Visual Studio's list of
 * external tools via the following dialog:
 *
 * Tools > Options > Projects and Solutions > External Web Tools
 *
 * You should ensure this task and running node --version from a command
 * prompt return the same node version.
 */
gulp.task("echo-node-version", function (cb) {
    console.log(process.version);
    cb();
});

/**
 * The default task downloads, Bower libraries, TypeScript definitions,
 * and compiles Angular templates and SASS files.
 */
gulp.task("default", function (cb) {
    runSequence("config", "libs", "tsd", "templates", "sass", cb);
});

/**
 * Performs linting of the TypeScript source code.
 */
gulp.task("lint", function (cb) {
    var filesToLint = paths.ts.concat(paths.tests);

    return gulp.src(filesToLint)
    .pipe(tslint());
});

/**
 * Run all of the unit tests once and then exit.
 * 
 * A Karma test server instance must be running first (eg karma start).
 */
gulp.task("test", ["ts:tests"], function (done) {

    var server = new KarmaServer({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, function (err, result) {
        // When a non-zero code is returned by Karma something went wrong.
        done(err === 0 ? null : "There are failing unit tests");
    });

    server.start();
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directories and rebuild the tsd.d.ts typings bundle for both the app
 * as well as the unit tests.
 */
gulp.task("tsd", function (cb) {
    runSequence("tsd:app", "tsd:tests", cb);
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle (for the app).
 */
gulp.task("tsd:app", function (cb) {

    // First reinstall any missing definitions to the typings directory.
    exec("tsd reinstall", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (err) {
            cb(err);
            return;
        }

        // Rebuild the src/tsd.d.ts bundle reference file.
        exec("tsd rebundle", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle (for the unit tests).
 */
gulp.task("tsd:tests", function (cb) {
    // First reinstall any missing definitions to the typings-tests directory.
    exec("tsd reinstall --config tsd.tests.json", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (err) {
            cb(err);
            return;
        }

        // Rebuild the tests/tsd.d.ts bundle reference file.
        exec("tsd rebundle --config tsd.tests.json", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });
});

/**
 * Used to build the www/js/build-vars.js file with values pulled from config.xml
 * and runtime-settings.json.
 */
gulp.task("config", function (cb) {

    var runtimeConfigJson = fs.readFileSync("runtime-config.json");

    // Remove BOM marker on Windows - http://stackoverflow.com/a/24376813
    runtimeConfigJson = runtimeConfigJson.toString().replace(/^\uFEFF/, "");

    var runtimeConfig = JSON.parse(runtimeConfigJson);

    var isDebug = !!runtimeConfig.debug;

    if (isDebug) {
        console.log("Gulpfile building with debug=true via runtime-config.json.");
    }
    else {
        console.log("Gulpfile building with debug=false via runtime-config.json.");
    }

    // Remove the schemes node from the config.xml file.
    var configRaw = fs.readFileSync("config.xml", "utf8");
    var configXmlDoc = new XmlDom().parseFromString(configRaw);

    // Grab values out of config.xml used to build www/js/build-vars.js

    var applicationName,
        email,
        websiteUrl,
        majorVersion = 0,
        minorVersion = 0,
        buildVersion = 0;

    // Attempt to grab the name element from config.xml.
    try {
        applicationName = xpath.select1("/*[local-name() = 'widget']/*[local-name() = 'name']/text()", configXmlDoc).toString();
    }
    catch (err) {
        console.error("Unable to parse name from the config.xml file.");
        cb(err);
    }

    // Attempt to grab the e-mail address.
    try {
        email = xpath.select1("/*[local-name() = 'widget']/*[local-name() = 'author']/@email", configXmlDoc).value;
    }
    catch (err) {
        console.error("Unable to parse email from the author node from the config.xml file.");
        cb(err);
    }

    // Attempt to grab the website URL.
    try {
        websiteUrl = xpath.select1("/*[local-name() = 'widget']/*[local-name() = 'author']/@href", configXmlDoc).value;
    }
    catch (err) {
        console.error("Unable to parse href from the author node from the config.xml file.");
        cb(err);
    }

    // Attempt to query and parse the version information from config.xml.
    // Default to 0.0.0 if there are any problems.
    try {
        var versionString = xpath.select1("/*[local-name() = 'widget']/@version", configXmlDoc).value;
        var versionParts = versionString.split(".");
        majorVersion = parseInt(versionParts[0], 10);
        minorVersion = parseInt(versionParts[1], 10);
        buildVersion = parseInt(versionParts[2], 10);
    }
    catch (err) {
        console.log("Error parsing version from config.xml; using 0.0.0 instead.", err);
    }

    // Create the structure of the buildVars variable.
    var buildVars = {
        applicationName: applicationName,
        email: email,
        websiteUrl: websiteUrl,
        majorVersion: majorVersion,
        minorVersion: minorVersion,
        buildVersion: buildVersion,
        debug: isDebug,
        buildTimestamp: (new Date()).toUTCString(),
        properties: {}
    };

    // Populate the configuration object with all of the values from runtime-settings.json.
    for (var key in runtimeConfig) {

        // No need to include the debug flag, it is already included at the top level.
        if (key === "debug") {
            continue;
        }

        buildVars.properties[key] = runtimeConfig[key];
    }

    // Grab the git commit hash.
    exec("git rev-parse --short HEAD", function (err, stdout, stderr) {

        buildVars.commitShortSha = err ? "unknown" : stdout.replace("\n", "");

        // Write the buildVars variable with code that will define it as a global object.
        var buildVarsJs = "window.buildVars = " + JSON.stringify(buildVars)  + ";";

        // Write the file out to disk.
        fs.writeFileSync("www/js/build-vars.js", buildVarsJs, { encoding: "utf8" });

        cb();
    });
});

/**
 * Used to copy the entire TypeScript source into the www/js/src directory so that
 * it can be used for debugging purposes.
 * 
 * This will only copy the files if the build scheme is not set to release. A release
 * build will ensure that the files are deleted if they are present.
 */
gulp.task("ts:src", ["ts:src-read-me"], function (cb) {

    if (isDebugBuild()) {
        return gulp.src(paths.ts)
            .pipe(gulp.dest("www/js/src"));
    }
    else {
        del([
            "www/js/src",
            "www/js/bundle.js.map",
        ]).then(function () {
            cb();
        });
    }
});

/**
 * Used to add a readme file to www/js/src to explain what the directory is for.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
gulp.task("ts:src-read-me", function (cb) {

    if (!isDebugBuild()) {
        cb();
        return;
    }

    var infoMessage = "This directory contains a copy of the TypeScript source files for debug builds; it can be safely deleted and will be regenerated via the gulp ts task.\n\nTo omit this directory create a release build by specifying the scheme:\ngulp ts --scheme release";

    return string_src("readme.txt", infoMessage)
        .pipe(gulp.dest("www/js/src/"));
});

/**
 * Used to compile TypeScript and create a Chrome extension located in the
 * chrome directory.
 */
gulp.task("chrome", ["ts"], function (cb) {

    // Copy the www payload.
    gulp.src(paths.www)
      .pipe(gulp.dest("chrome"))
      .on("end", function() {

      // Copy in the icon to use for the toolbar.
      gulp.src(paths.chromeIcon)
        .pipe(gulp.dest("chrome"))
        .on("end", function() {

          // Copy in the manifest file for the extension.
          gulp.src(paths.chromeManifest)
            .pipe(rename("manifest.json"))
            .pipe(gulp.dest("./chrome"))
            .on("end", cb);
        });
    });
});

/**
 * Used to perform compliation of the TypeScript source in the src directory and
 * output the JavaScript to the out location as specified in tsconfig.json (usually
 * www/js/bundle.js).
 * 
 * It will also delegate to the vars and src tasks to copy in the original source
 * which can be used for debugging purposes. This will only occur if the build scheme
 * is not set to release.
 */
gulp.task("ts", ["config", "ts:src"], function (cb) {
    exec("tsc -p src", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        // For debug builds, we are done, but for release builds, minify the bundle.
        if (isDebugBuild()) {
            cb(err);
        }
        else {
            runSequence("minify", function () {
                cb(err);
            });
        }
    });
});

/**
 * Used to minify the JavaScript bundle.js built from the "ts" TypeScript compilation
 * target. This will use the bundle that is already on disk whose location is determined
 * from the out property of the compiler options in tsconfig.json.
 */
gulp.task("minify", function () {

    // Read tsconfig.json to determine the bundle output location.
    var config = JSON.parse(fs.readFileSync("src/tsconfig.json", "utf8"));
    var bundleLocation = config.compilerOptions.out;

    // Minify to a temporary location and the move to the bundle location.
    return gulp.src(bundleLocation)
        .pipe(uglify())
        .pipe(gulp.dest(path.dirname(bundleLocation)));
});

/**
 * Used to perform compilation of the unit TypeScript tests in the tests directory
 * and output the JavaScript to tests/tests-bundle.js. Compilation parameters are
 * located in tests/tsconfig.json.
 * 
 * It will also delegate to the ts task to ensure that the application source is
 * compiled as well.
 */
gulp.task("ts:tests", ["ts"], function (cb) {
    exec("tsc -p tests", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * Used to concatenate all of the HTML templates into a single JavaScript module.
 */
gulp.task("templates", function () {

    return gulp.src(paths.templates)
        .pipe(templateCache({
            "filename": "templates.js",
            "root": "",
            "module": "templates",
            standalone: true
        }))
        .pipe(gulp.dest("./www/js"));
});

/**
 * Used to perform compilation of the SASS styles in the styles directory (using
 * Index.scss as the root file) and output the CSS to www/css/bundle.css.
 */
gulp.task("sass", function (cb) {

    var sassConfig = {
        outputStyle: isDebugBuild() ? "nested" : "compressed",
        errLogToConsole: true
    };

    return gulp.src(paths.sassIndex)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig))
        .pipe(rename("bundle.css"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./www/css"));
});

/**
 * Used to download all of the bower dependencies as defined in bower.json and place
 * the consumable pieces in the www/lib directory.
 */
gulp.task("libs", function(cb) {
    exec("bower-installer", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * Used to perform a file clean-up of the project. This removes all files and directories
 * that don't need to be committed to source control by delegating to several of the clean
 * sub-tasks.
 */
gulp.task("clean", ["clean:tmp", "clean:node", "clean:bower", "clean:platforms", "clean:plugins", "clean:chrome", "clean:libs", "clean:ts", "clean:tsd", "clean:templates", "clean:sass"]);

/**
 * Removes the tmp directory.
 */
gulp.task("clean:tmp", function (cb) {
    del([
        "tmp",
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the node_modules directory.
 */
gulp.task("clean:node", function (cb) {
    del([
        "node_modules"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the bower_components directory.
 */
gulp.task("clean:bower", function (cb) {
    del([
        "bower_components"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the platforms directory.
 */
gulp.task("clean:platforms", function (cb) {
    del([
        "platforms"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the www/lib directory.
 */
gulp.task("clean:libs", function (cb) {
    del([
        "www/lib"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes files related to TypeScript compilation.
 */
gulp.task("clean:ts", function (cb) {
    del([
        "www/js/bundle.js",
        "www/js/bundle.d.ts",
        "www/js/bundle.js.map",
        "www/js/build-vars.js",
        "www/js/src"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes files related to TypeScript definitions.
 */
gulp.task("clean:tsd", function (cb) {

    // TODO: These patterns don't actually remove the sub-directories
    // located in the typings directories, they leave the directories
    // but remove the *.d.ts files. The following glob should work for
    // remove directories and preserving the custom directory, but they
    // don't for some reason and the custom directory is always removed:
    // "typings/**"
    // "!typings/custom/**"

    del([
        "src/tsd.d.ts",
        "typings/**/*.d.ts",
        "!typings/custom/*.d.ts",
        // "typings/**",
        // "!typings/custom/**",

        "tests/tsd.d.ts",
        "typings-tests/**/*.d.ts",
        "!typings-tests/custom/*.d.ts",
        // "typings-tests/**",
        // "!typings/custom/**"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the generated templates JavaScript from the templates target.
 */
gulp.task("clean:templates", function (cb) {
    del([
        "www/js/templates.js"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the generated css from the SASS target.
 */
gulp.task("clean:sass", function (cb) {
    del([
        "www/css/bundle.css",
        "www/css/bundle.css.map"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the chrome directory.
 */
gulp.task("clean:chrome", function (cb) {
    del([
        "chrome"
    ]).then(function () {
        cb();
    });
});
