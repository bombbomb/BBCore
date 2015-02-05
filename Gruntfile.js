module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        karma: {
            unit: {
                configFile: 'spec/karma.conf.js',
                singleRun: true
            }
        },
        jsdox: {
            generate: {
                options: {
                    contentsEnabled: false,
                    contentsTitle: 'API'
                },
                src: ['src/*.js'],
                dest: 'docs/'
            }
        },
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['docs/01_Intro.md', 'docs/02_Usage.md', 'docs/src/bbcore.md'],
                dest: 'README.md'
            }
        },
        codeclimate: {
            options: {
                file: 'spec/coverage/report-lcov/lcov.info',
                token: '5bf69d78cd8bfe54fb920abdf42be714bd6b405288d1ba6f0ea2d727b8d5166a'
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-codeclimate');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'karma', 'jsdox', 'concat', 'codeclimate']);
};