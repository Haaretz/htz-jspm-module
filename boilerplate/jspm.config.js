SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/",
  },
  browserConfig: {
    "baseURL": "/"
  },
  transpiler: "plugin-babel",
  packages: {
    "<%= moduleSafeName %>": {
      "main": "index.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      },
      "babelOptions": {
        "sourceMaps": true
      }
    }
  },
  meta: {
    "*.json": {
      "format": "json"
    }
  },
  map: {
    "json": "github:systemjs/plugin-json@0.1.2"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {},
  packages: {}
});
