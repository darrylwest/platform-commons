/**
 * Gruntfile - builder, linter, etc.
 *
 * @created: 2014-02-14
 * @author: darryl.west@roundpeg.com
 */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        paths: {
            app:'app',
            less:'app/assets/less',
            lib:'libs',
            config:'config',
            mocha:'mocha',
            build:'build'
        },
        watch:{
            scripts:{
                files:[
                    '<%= paths.config %>/*.js',
                    '<%= paths.config %>/*.json',
                    '<%= paths.app %>/*/*.js',
                    '<%= paths.mocha %>/*/*.js',
                    '<%= paths.less %>/style.less',
                    '<%= paths.less %>/*/*.less',
                    '!<%= paths.mocha %>/lib/*.js'
                ],
                tasks:[
                    'less',
                    'mocha_phantomjs',
                    'jshint'
                ],
                options:{
                    spawn:false
                }
            }
        },
        less: {
            development: {
                options:{
                    paths:[ 'app/assets/css' ]
                },
                files: {
                    'app/assets/css/style.css': 'app/assets/less/style.less'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                verbose: true,
                reporter: '<%= paths.mocha %>/lib/jshint-reporter.js'
            },
            all: [
                'Gruntfile.js',
                'includes.js',
                '<%= paths.app %>/*/*.js',
                '<%= paths.config %>/*.js',
                '<%= paths.mocha %>/*/*.js',
                '!<%= paths.mocha %>/lib/*.js'
            ]
        },
        jsdoc:{
            dist:{
                src:[
                    '<%= paths.app %>/*/*.js',
                    '<%= paths.config %>/*.js'
                ],
                options:{
                    destination:'jsdoc'
                }
            }
        },
        'mocha_phantomjs':{
            options:{
                globals:[ 'jQuery' ],
                reporter:'list' // spec, list, min, dot, etc...
            },
            all: [ 'mocha/index.html' ]
        }
    });

    grunt.registerTask('test', [
        'mocha_phantomjs'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'jsdoc'
    ]);
};

