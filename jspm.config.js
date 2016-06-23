SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "local:": "jspm_packages/local/"
  },
  browserConfig: {
    "paths": {
      "monterey-shell/": "dist/"
    }
  },
  nodeConfig: {
    "paths": {
      "monterey-shell/": "src/"
    }
  },
  devConfig: {
    "map": {
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "core-js": "npm:core-js@1.2.6",
      "path": "github:jspm/nodelibs-path@0.2.0-alpha",
      "process": "github:jspm/nodelibs-process@0.2.0-alpha",
      "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.12"
    },
    "packages": {
      "npm:babel-runtime@5.8.38": {
        "map": {}
      },
      "npm:core-js@1.2.6": {
        "map": {}
      }
    }
  },
  transpiler: "plugin-babel",
  babelOptions: {
    "optional": [
      "runtime"
    ]
  },
  meta: {
    "bootstrap": {
      "deps": [
        "jquery"
      ]
    }
  },
  packages: {
    "monterey-shell": {
      "main": "main.js",
      "defaultExtension": "js"
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json",
    "local:*.json"
  ],
  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0-rc.1.0.0",
    "aurelia-binding": "npm:aurelia-binding@1.0.0-rc.1.0.2",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-rc.1.0.0",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-rc.1.0.0",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.0.0-rc.1.0.0",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-rc.1.0.0",
    "aurelia-history": "npm:aurelia-history@1.0.0-rc.1.0.0",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-rc.1.0.0",
    "aurelia-loader": "npm:aurelia-loader@1.0.0-rc.1.0.0",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-rc.1.0.0",
    "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.0",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-rc.1.0.0",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.0",
    "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-rc.1.0.0",
    "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-rc.1.0.0",
    "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-rc.1.0.0",
    "aurelia-router": "npm:aurelia-router@1.0.0-rc.1.0.0",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-rc.1.0.0",
    "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.0",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-rc.1.0.0",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-rc.1.0.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-rc.1.0.0",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "fetch": "github:github/fetch@1.0.0",
    "font-awesome": "npm:font-awesome@4.6.3",
    "jquery": "npm:jquery@2.2.4",
    "scaffolding": "github:monterey-framework/scaffolding@0.1.0",
    "text": "github:systemjs/plugin-text@0.0.3"
  },
  packages: {
    "github:twbs/bootstrap@3.3.6": {
      "map": {
        "jquery": "npm:jquery@2.2.4"
      }
    },
    "npm:aurelia-animator-css@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-bootstrapper@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-dependency-injection@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-framework@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-history-browser@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-loader-default@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-loader@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-logging-console@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-metadata@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-pal-browser@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-polyfills@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-route-recognizer@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-router@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-task-queue@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-templating-binding@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-templating-resources@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-templating-router@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:aurelia-templating@1.0.0-rc.1.0.0": {
      "map": {}
    },
    "npm:font-awesome@4.6.3": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.23"
      }
    },
    "github:monterey-framework/scaffolding@0.1.0": {
      "map": {
        "aurelia-binding": "npm:aurelia-binding@1.0.0-rc.1.0.2"
      }
    }
  }
});
