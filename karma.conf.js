// Karma configuration
// Generated on Fri Dec 05 2014 16:49:29 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './app',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],

    jspm: {
      config: "config.js",
      packages: "jspm_packages/",
      // Edit this to your needs
      loadFiles: ['test/unit/**/*.spec.ts'],
      serveFiles: ['src/**/*.*', 'test/unit/**/*.*'],
      paths: {
        '*': '*',
        'test/*': 'test/*',
        'github:*': 'jspm_packages/github/*.js',
        'npm:*': 'jspm_packages/npm/*.js'
      }
    },

    proxies: {
      "jspm_packages/": "base/jspm_packages/",
      "test/": "base/test/",
      "src/": "base/src/"
    },

    // list of files / patterns to load in the browser
    // files: ['app/src/**/*.ts', 'test/**/*.ts'],

    files: [
      { pattern: 'src/**/*.ts', included: false, watched: false},
      { pattern: 'test/**/*.ts', included: false, watched: false},
      { pattern: 'scripts/babel-polyfill.min.js', watched: false, included: true, served: true }
    ],

    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.spec.ts': ['typescript'],
      'src/**/*.ts': ['typescript'],
      // 'src/**/*.ts': ['typescript']
    },
    // 'babelPreprocessor': {
    //   options: {
    //     sourceMap: 'inline',
    //     presets: [ 'es2015-loose', 'stage-1'],
    //     plugins: [
    //       'syntax-flow',
    //       'transform-decorators-legacy',
    //       'transform-flow-strip-types'
    //     ]
    //   }
    // },
    typescriptPreprocessor: {
      tsconfigPath: '../tsconfig.json',
           transformPath: [function(path) { // *optional
        return path.replace(/\.ts$/, '.js');
      }, function(path) {
         return path.replace(/[\/\\]test[\/\\]/i, '/'); // remove directory test and change to /
      }]
      // tsconfigOverrides: {
      //   "module": "system",
      // }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
