module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.combined.js',
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
                src: ['build/BBCore.combined.js'],
                dest: 'docs/'
            }
        },
        concat: {
            options: {
                separator: ''
            },
            docs: {
                src: ['docs/01_Intro.md', 'docs/02_Usage.md', 'docs/build/BBCore.combined.md'],
                dest: 'README.md'
            },
            moduleMasher: {
                src: [
                    'src/bbcore.js',
                    'src/modules/bbcore.auth.js',
                    'src/modules/bbcore.api.js',
                    'src/modules/bbcore.contacts.js',
                    'src/modules/bbcore.email.js',
                    'src/modules/bbcore.extras.js',
                    'src/modules/bbcore.videoRecorder.js',
                    'src/modules/bbcore.video.js'
                ],
                dest: 'build/<%= pkg.name %>.combined.js'
            }
        },
        codeclimate: {
            options: {
                file: 'spec/coverage/report-lcov/lcov.info',
                token: '5bf69d78cd8bfe54fb920abdf42be714bd6b405288d1ba6f0ea2d727b8d5166a'
            }
        },
        jshint: {
            all: ['src/bbcore.js']
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-codeclimate');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'karma', 'jsdox', 'concat']);
    grunt.registerTask('full', ['concat', 'jshint', 'uglify', 'karma', 'jsdox', 'concat', 'codeclimate']);
};