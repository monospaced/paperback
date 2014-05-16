/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '2.0.0',
      banner: '/*! Ebla - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Monospaced */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
              'javascripts/libs/jquery.cookie.js',
              'javascripts/ebla/ebla.js',
              'javascripts/ebla/debug.js',
              'javascripts/ebla/flash-message.js',
              'javascripts/ebla/compatibility.js',
              'javascripts/ebla/elements.js',
              'javascripts/ebla/controls.js',
              'javascripts/ebla/data.js',
              'javascripts/ebla/images.js',
              'javascripts/ebla/layout.js',
              'javascripts/ebla/loader.js',
              'javascripts/ebla/navigation.js',
              'javascripts/ebla/navigation.event.js',
              'javascripts/ebla/navigation.keyboard.js',
              'javascripts/ebla/placesaver.js',
              'javascripts/ebla/progress.js',
              'javascripts/ebla/resize.js',
              'javascripts/ebla/toc.js',
              'javascripts/ebla/init.js',
              'javascripts/ebla/book.js'],
        dest: 'javascripts/ebla.js'
      }
    },
    uglify: {
      dist: {
        src: ['<banner:meta.banner>', 'javascripts/ebla.js'],
        dest: 'javascripts/ebla.min.js'
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'stylesheets/ebla.css': 'stylesheets/ebla.scss',
          'stylesheets/book.css': 'stylesheets/book.scss'
        }
      }
    },
    watch: {
      files: ['javascripts/ebla/*.js', 'stylesheets/*.scss'],
      tasks: ['sass', 'concat', 'uglify']
    },
    jshint: {
      files: ['Gruntfile.js', 'javascripts/ebla.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        devel: true,
        globals: {
          Modernizr: true,
          debug: true,
          bookData: true,
          bookJson: true
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('default', ['sass', 'concat', 'jshint', 'uglify']);
};
