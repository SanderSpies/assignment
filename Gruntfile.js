module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      default: {
        src: [
          'components/*/*.js',
          'services/*.js',
          'external/*.js'
        ],
        dest: 'build/development.js'
      }
    },
    sass: {
      dist: {
        files: {
          'build/development.css': 'components/Page/PageComponent.scss'
        }
      }
    },
    watch: {
      files: [
        'components/*/*.js',
        'services/*.js',
        'components/*/*.scss'
      ],
      tasks: [
        'browserify',
        'sass'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['browserify', 'sass']);
};