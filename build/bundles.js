module.exports = {
  "bundles": {
    "dist/app-build": {
      "includes": [
        "[**/*.js]",
        "**/*.json!json",
        "**/*.html!text",
        "**/*.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        // "depCache": true,
        "rev": true
      }
    },
    "dist/aurelia": {
      "includes": [
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating-binding",
        "aurelia-polyfills",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-validatejs",
        "aurelia-dialog",
        "aurelia-dialog/*.js",
        "aurelia-logging-console",
        "[bootstrap]",
        "[bootstrap/js/bootstrap.js]",
        "bootstrap/css/bootstrap.css!text",
        "aurelia-v-grid",
        "aurelia-v-grid/**/*.js",
        "aurelia-v-grid/**/*.html!text",
        "aurelia-v-grid/**/*.css!text",
        "fetch",
        "moment",
        "showdown",
        "semver",
        "json",
        "text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        // "depCache": false,
        "rev": true
      }
    }
  }
};
