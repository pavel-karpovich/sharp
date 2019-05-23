//modules

const browserSync = require('browser-sync'),
    del = require('del'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    csslint = require('gulp-csslint'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    newer = require('gulp-newer'),
    run = require('gulp-run'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify-es').default,
    useref = require('gulp-useref'),
    watch = require('gulp-watch'),
    pipe = require('multipipe');

//variables

const srcPath = {
    'src': './src',
    'html': './src/**/*.html',
    'img': './src/**/*.+(jpg|jpeg|png|svg|gif)',
    'css': ['./src/!(css|js)*/**/*.css'],
    'cssLint': './src/**/*.css',
    'js': './src/!(js|completed)*/**/*.js',
    'jsLint': ['./src/**/*.js', '!./**/node_modules/**', '!./src/**/*.min.js'],
    'font': './src/font/**/*.*',
    'analysis': './code-analysis/',
    'task': './src/task/**/*.+(pdf|тых|html|css)',
    'cmpl': ['./src/completed/**/*.*', '!./**/node_modules/**'],
    'print': './src/css/print/*.css'
};

const distPath = {
    'dist': './dist/',
    'html': './dist/',
    'img': './dist/',
    'css': './dist/css/',
    'print': './dist/css/print',
    'js': './dist/',
    'font': './dist/font/',
    'task': './dist/task/',
    'cmpl': './dist/completed/'
};

const pluginSettings = {
    autoprefixer: {
        browsers: ['last 2 versions', 'ie 9', 'ie 10']
    },
    cleanCSS: {
        compatibility: '*'
    },
    csslint: {
        filename: 'index.html',
        directory: srcPath.analysis + '/css/'
    },
    jshint: {
        filename: srcPath.analysis + '/js/index.html',
        createMissingFolders: true
    }
};

//tasks

const cleanDist = function() {
    return del([srcPath.analysis, distPath.dist]);
}

const parseHtml = function() {
    return gulp.src(srcPath.html)
        .pipe(newer(distPath.html))
        .pipe(useref({}, pipe(sourcemaps.init)))
        .pipe(gulpif("*.js", pipe(
            uglify()
        )))
        .pipe(gulpif("*.css",
            pipe(
                autoprefixer(pluginSettings.autoprefixer),
                cleanCSS(pluginSettings.cleanCSS)
            )
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath.html));
}

const parseCss = function() {
    return gulp.src(srcPath.css)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(pluginSettings.autoprefixer))
        .pipe(cleanCSS(pluginSettings.cleanCSS))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath.css));
}

const lintCss = function() {
    return gulp.src(srcPath.cssLint)
        .pipe(csslint(".csslintrc"));
}

const copyJs = function() {
    return gulp.src(srcPath.js)
        .pipe(gulp.dest(distPath.js));
}

const lintJs = function() {
    return gulp.src(srcPath.jsLint)
        .pipe(jshint(".jshintrc"));
}

const parseImages = function() {
    return gulp.src(srcPath.img)
        .pipe(newer(distPath.img))
        .pipe(imagemin())
        .pipe(gulp.dest(distPath.img));
}

const copyFonts = function() {
    return gulp.src(srcPath.font)
        .pipe(gulp.dest(distPath.font));
}

const copyTaskFiles = function() {
    return gulp.src(srcPath.task)
        .pipe(gulp.dest(distPath.task));
}

const copyCompletedFiles = function() {
    return gulp.src(srcPath.cmpl)
        .pipe(gulp.dest(distPath.cmpl));
}

const copyPrintJsFiles = function() {
    return gulp.src(srcPath.print)
        .pipe(gulp.dest(distPath.print));
}

const copyThemeCssFiles = function() {
    return gulp.src('./src/css/theme/*.css')
        .pipe(gulp.dest('./dist/css/theme/'));
}

const copyHlJsFiles = function() {
    return gulp.src('./src/js/highlight/*.js')
        .pipe(gulp.dest('./dist/js/'));
}

const copyCustomCss = function() {
    return gulp.src('./src/css/custom.css')
        .pipe(gulp.dest('./dist/css/'));
}

const lint = gulp.parallel(lintJs, lintCss);
const translate = gulp.parallel(parseHtml, parseCss, copyJs, parseImages, copyFonts, copyCustomCss, copyTaskFiles, copyCompletedFiles, copyPrintJsFiles, copyThemeCssFiles, copyHlJsFiles);

const build = gulp.series(cleanDist, lint, translate);

const watchServ = function() {

    watch(srcPath.css, parseCss);
    watch(srcPath.html, parseHtml);
    watch(srcPath.js, copyJs);
    watch(srcPath.img, parseImages);
    watch(srcPath.font, copyFonts);
    watch(srcPath.task, copyTaskFiles);
    watch(srcPath.cmpl, copyCompletedFiles);
    watch(srcPath.print, copyPrintJsFiles);
    watch('./src/js/highlight/*.js', copyHlJsFiles);
    watch('./src/css/custom.css', copyCustomCss);

}

const serveDir = function() {
    browserSync.init({
        server: distPath.dist,
        port: 4000
    });
    browserSync.watch(distPath.dist).on("change", browserSync.reload);
}

const serverWatch = gulp.parallel(watchServ, serveDir);
const default_task = gulp.series(build, serverWatch);

const ya = function(cb) {
    run(`npx yaspeller .\\`).exec()
        .on("error", function(err) {
            console.error(err.message);
            cb();
        })
        .on("finish", cb);
}

module.exports.default = default_task;
module.exports.ya = ya;