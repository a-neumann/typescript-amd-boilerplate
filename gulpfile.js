var gulp = require("gulp");
var bs = require("browser-sync");
var typescript = require("typescript");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var less = require("gulp-less");
var minifyCss = require("gulp-cssnano");
var uglify = require("gulp-uglify");
var tmpl2js = require("gulp-tmpl2js");
var file = require("gulp-file");
var mainBowerFiles = require("main-bower-files");
var amdOptimize = require("amd-optimize");
var del = require("del");

// notice "./src" in the .vscode/launch.json file!
var src = {
    scripts: "./src/scripts",
    styles: "./src/styles",
    lib: "./src/lib",
    root: "./src"
};
var dest = {
    scripts: "./dist/scripts",
    styles: "./dist/styles",
    lib: "./dist/lib",
    root: "./dist"
};

var startupScript = "main";
var styleBundleName = "styles";
var debugPort = 8081;
var debugLauncher = function() {
    // only Windows syntax for now
    var exec = require("child_process").exec;
    exec("start chrome \"http://localhost:" + debugPort + "\" --remote-debugging-port=9222");
};

gulp.task("scripts", function () {

    var tsProject = ts.createProject("./tsconfig.json");
    //var requireConfig = file("require.config.js", "");

    return gulp.src(src.scripts + "/**/*.ts", { base: src.scripts })
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject, { typescript: typescript, sortOutput: true }))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: src.scripts.replace(/^.*\//, "/") }))
        .pipe(gulp.dest(src.scripts))
        .pipe(bs.reload({ stream: true }));
});

gulp.task("config", function() {

    var libConfig = require(src.root + "/lib.json");
    var cfgStr = JSON.stringify(libConfig);

    var r = "requirejs";
    var content = r + ".config(" + cfgStr + ");" + r + "([\"" + startupScript + "\"]);";

    return file("require.config.js", content, { src: true })
        .pipe(gulp.dest(src.root));
});

gulp.task("templates", function() {

    return gulp.src(src.scripts + "/**/template.html", { base: src.scripts })
        .pipe(tmpl2js({
            mode: "compress",
            wrap: "amd"
        }))
        .pipe(gulp.dest(src.scripts))
        .pipe(bs.reload({ stream: true }));
});

gulp.task("styles", function () {

    return gulp.src([src.styles + "/*.less", src.lib + "/**/*.css"])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat(styleBundleName + ".css"))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: src.styles.replace(/^.*\//, "/") }))
        .pipe(gulp.dest(src.styles))
        .pipe(bs.reload({ stream: true }));
});

function filterCdnPaths(paths) {
    var isCdnRx = /\w+:\/\//;

    for (var p in paths) {
        if (Array.isArray(paths[p])) {
            paths[p] = paths[p].map(function(url) {
                return isCdnRx.test(url) ? "empty:" : url;
            });
        } else if (isCdnRx.test(paths[p])) {
            paths[p] = "empty:";
        }
    }
}

gulp.task("dist-scripts", ["scripts", "templates"], function() {

    var libConfig = require(src.root + "/lib.json");
    delete libConfig.baseUrl;
    filterCdnPaths(libConfig.paths);

    return gulp.src(src.scripts + "/**/*.js", { base: src.scripts })
        .pipe(amdOptimize(startupScript, libConfig))
        .pipe(concat(startupScript + ".js"))
        .pipe(uglify())
        .pipe(gulp.dest(dest.scripts));
});

gulp.task("dist-styles", ["styles"], function () {

    return gulp.src(src.styles + "/" + styleBundleName + ".css")
        .pipe(minifyCss({ keepBreaks: true }))
        .pipe(gulp.dest(dest.styles));
});

gulp.task("dist-lib", function() {

    return gulp.src(mainBowerFiles(), { base: src.lib })
        .pipe(uglify())
        .pipe(gulp.dest(dest.lib));
});

gulp.task("dist-html", function() {

    return gulp.src([
            src.root + "/**/*.html",
            "!" + src.root + "/**/template.html",
            src.root + "/require.config.js"
        ])
        .pipe(gulp.dest(dest.root));
});

gulp.task("dist", ["config", "dist-scripts", "dist-styles", "dist-lib", "dist-html"]);

gulp.task("debug", ["config", "templates", "scripts", "styles"], function (done) {

    debugLauncher();

    gulp.watch(src.scripts + "/**/*.ts", ["scripts"]);
    gulp.watch(src.scripts + "/**/*.html", ["templates"]);
    gulp.watch(src.styles + "/**/*.less", ["styles"]);
    gulp.watch(src.root + "/*.html", ["bs-reload"]);

    bs.init({
        online: false,
        open: false,
        port: debugPort,
        server: {
            baseDir: [ src.root ]
        }
    }, done);
});

gulp.task("bs-reload", function() {
    bs.reload();
});

gulp.task("clean", function(done) {
    return del([dest.scripts + "**/*.js", dest.styles + "**/*.css", dest.root + "/*"], done);
});

//gulp.task("default", ["build"]);