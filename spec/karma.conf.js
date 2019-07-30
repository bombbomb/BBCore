module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            '../src/libs/jquery.js',
            '../src/*.js',
            '../src/modules/*.js',
            '*.js',
            { pattern: '../src/libs/jquery.js', watched: false, included: true }
        ],
        preprocessors: {
            '../src/*.js': [],
            '../src/modules/*.js': []
        },
        coverageReporter: {
            type : 'lcovonly',
            dir : 'coverage/',
            subdir: 'report-lcov',
            file: 'lcov.info'
        },
        reporters: ['dots'],
        browsers: ['PhantomJS']
    });
};
