//modules

const gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gulpSequence = require('gulp-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    csslint = require('gulp-csslint'),
    csslintReporter = require('gulp-csslint-report'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    pipe = require('multipipe'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    watch = require('gulp-watch'),
    run = require('gulp-run');

//variables

const yaspellerDictionary = 'yadict.json';

const srcPath = {
    'src': './src',
    'html': './src/**/*.html',
    'img': './src/**/*.+(jpg|jpeg|png|svg|gif)',
    'css': ['./src/!(css|js)*/**/*.css'],
    'cssLint': './src/**/*.css',
    'js': './src/!(js)*/**/*.js',
    'jsLint': ['./src/**/*.js', '!./src/**/*.min.js'],
    'font': './src/font/**/*.*',
    'analysis': './code-analysis/',
    'task': './src/task/**/*.pdf',
    'cmpl': './src/completed/**/*.*'
};

const distPath = {
    'dist': './dist/',
    'html': './dist/',
    'img': './dist/',
    'css': './dist/css/',
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

gulp.task('clean', () => {
    return del([srcPath.analysis, distPath.dist]);
});

gulp.task('html', () => {
    return gulp.src(srcPath.html)
        .pipe(newer(distPath.html))
        .pipe(useref({}, pipe(sourcemaps.init)))
        .pipe(gulpif('*.js', pipe(
            uglify()
        )))
        .pipe(gulpif('*.css',
            pipe(
                autoprefixer(pluginSettings.autoprefixer),
                cleanCSS(pluginSettings.cleanCSS)
            )
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath.html));
});

gulp.task('css', () => {
    return gulp.src(srcPath.css)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(pluginSettings.autoprefixer))
        .pipe(cleanCSS(pluginSettings.cleanCSS))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath.css));
});

gulp.task('css:lint', () => {
    return gulp.src(srcPath.cssLint)
        .pipe(csslint('.csslintrc'));
});

gulp.task('js', () => {
    return gulp.src(srcPath.js)
        .pipe(gulp.dest(distPath.js));
});

gulp.task('js:lint', () => {
    return gulp.src(srcPath.jsLint)
        .pipe(jshint('.jshintrc'));
});

gulp.task('img', () => {
    return gulp.src(srcPath.img)
        .pipe(newer(distPath.img))
        .pipe(imagemin())
        .pipe(gulp.dest(distPath.img));
});

gulp.task('font', () => {
    return gulp.src(srcPath.font)
        .pipe(gulp.dest(distPath.font));
});

gulp.task('serve', () => {
    browserSync.init({
        server: distPath.dist,
        port: 4000
    });

    browserSync.watch(distPath.dist).on('change', browserSync.reload);
});

gulp.task('task', () => {
    return gulp.src(srcPath.task)
        .pipe(gulp.dest(distPath.task));
});

gulp.task('cmpl', () => {
    return gulp.src(srcPath.cmpl)
        .pipe(gulp.dest(distPath.cmpl));
});

gulp.task('build', gulpSequence('clean', ['js:lint', 'css:lint'], [
    'html',
    'img',
    'js',
    'css',
    'font',
    'task',
    'cmpl'
]));

gulp.task('watch', () => {
    watch(srcPath.css, () => gulp.start('css'));
    watch(srcPath.html, () => gulp.start('html'));
    watch(srcPath.js, () => gulp.start('js'));
    watch(srcPath.img, () => gulp.start('img'));
    watch(srcPath.font, () => gulp.start('font'));
    watch(srcPath.task, () => gulp.start('task'));
    watch(srcPath.cmpl, () => gulp.start('cmpl'));
});

gulp.task('default', gulpSequence('build', ['watch', 'serve']));

gulp.task('yaspeller', function(cb) {
    run(`.\\node_modules\\.bin\\yaspeller --dictionary ${yaspellerDictionary} -l ru -e ".md,.html" .\\`).exec()
        .on('error', function(err) {
            console.error(err.message);
            cb();
        })
        .on('finish', cb);
});
