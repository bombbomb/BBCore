const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const uglify = require('gulp-uglify');
const pump = require('pump');
const package = require('./package.json');
const header = require('gulp-header');
const KarmaServer = require('karma').Server;
const jsMarkdown = require('gulp-jsdoc-to-markdown');

const paths = {
    src : 'src/**/*.js',
    build : 'build',
    outputFile : 'bbcore.min.js',
    karmaConfig : `${__dirname}/spec/karma.conf.js`,
    docSource : 'docs/build',
    root : './'
}

const filepathsToConcat = [
    'src/bbcore.js',
    'src/modules/bbcore.api.js',
    'src/modules/bbcore.auth.js',
    'src/modules/bbcore.contacts.js',
    'src/modules/bbcore.email.js',
    'src/modules/bbcore.extras.js',
    'src/modules/bbcore.helpers.js',
    'src/modules/bbcore.video.js',
    'src/modules/bbcore.videoRecorder.js'
];

const dateObject = new Date();
const today = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;
const coreHeader = `/*! ${package.name} ${today} */\n`
const docTitle = 'README.md';

gulp.task('build', ['combine-js', 'docs']);
gulp.task('docs', ['make-docs']);

gulp.task('clean', () => { 
    del([paths.build, paths.root + docTitle]);
});

gulp.task('test', (done) => {
    new KarmaServer({
        configFile: paths.karmaConfig,
        singleRun: true
    }, done).start();
});

gulp.task('combine-js', () => {
    return gulp.src(filepathsToConcat)
        .pipe(concat(paths.outputFile))
        .pipe(gulp.dest(paths.build));    
});

gulp.task('uglify', ['combine-js'], () => {
        pump([
            gulp.src(`${paths.build}/${paths.outputFile}`),
            uglify(),
            gulp.dest(paths.build)    
        ]);
});

gulp.task('add-core-header', () => {
    return gulp.src(`${paths.build}/${paths.outputFile}`)
        .pipe(header(coreHeader))
        .pipe(gulp.dest(paths.build));
});

gulp.task('make-docs', ['combine-docs'], (cb) => {
    return gulp.src(`${paths.build}/${paths.outputFile}`)
        .pipe(jsMarkdown())
        .pipe(concat('BBCore.combined.md'))
        .pipe(gulp.dest(paths.docSource));
});

gulp.task('combine-docs', ['combine-js'], () => {
    return gulp.src(['docs/01_Intro.md', 'docs/02_Usage.md', 'docs/build/BBCore.combined.md'])
        .pipe(concat(docTitle))
        .pipe(gulp.dest(paths.root));
});

gulp.task('default', () => {
    console.log('Enter a task to perform an action.');
});