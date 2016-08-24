module.exports = function(config) {
  var configuration = {
    basePath: './',
    frameworks: ['systemjs', 'jasmine'],
    systemjs: {
      configFile: 'app/config.js',
      config: {
        paths: {
          "*": "*",
          "src/*": "app/src/*",
          "github:*": "app/jspm_packages/github/*",
          "npm:*": "app/jspm_packages/npm/*",
          "typescript": "node_modules/typescript/lib/typescript.js",
          "systemjs": "node_modules/systemjs/dist/system.js",
          'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
        },
        packages: {
          'app/test/unit': {
            defaultExtension: 'ts'
          },
          'app/src': {
            defaultExtension: 'ts'
          }
        },
        meta: {
          "github:CodeSeven/toastr@2.1.2/toastr.js": {
            "format": "global"
          }
        },
        transpiler: 'typescript',
        typescriptOptions: {
          "module": "amd",
          "target": "es6",
          "emitDecoratorMetadata": true,
          "experimentalDecorators": true
        }
      },
      serveFiles: [
        'app/src/**/*.*',
        'app/jspm_packages/**/*.*'
      ]
    },
    files: [
      'app/test/unit/setup.ts',
      'app/test/unit/**/*.spec.ts',
      'app/test/unit/*.spec.ts'
    ],
    exclude: [],
    preprocessors: { },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
  }

  config.set(configuration);
};