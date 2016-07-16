module.exports = function(config) {
  config.set({
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
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
        },
        packages: {
          'app/test/unit': {
            defaultExtension: 'ts'
          },
          'app/src': {
            defaultExtension: 'ts'
          }
        },
        transpiler: 'typescript',
        typescriptOptions : {
          "module": "amd",
          "emitDecoratorMetadata": true,
          "experimentalDecorators": true
        }
      },
      serveFiles: [
        'app/src/**/*.*',
        'app/jspm_packages/**/*'
      ]
    },
    files: [
      'app/test/unit/setup.ts',
      'app/test/unit/*.ts'
    ],
    exclude: [],
    preprocessors: { },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
  });


  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
  }
};