SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/",
  },
  browserConfig: {
    "baseURL": "/"
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.13",
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "babel": "npm:babel-core@5.8.38",
      "core-js": "npm:core-js@1.2.7",
      "path": "github:jspm/nodelibs-path@0.2.0-alpha"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "<%= moduleSafeName %>": {
      "main": "index.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
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
