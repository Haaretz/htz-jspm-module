SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "htz-npm-only/": "src/"
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.17",
      "chai": "npm:chai@3.5.0"
    },
    "packages": {
      "npm:chai@3.5.0": {
        "map": {
          "assertion-error": "npm:assertion-error@1.0.2",
          "deep-eql": "npm:deep-eql@0.1.3",
          "type-detect": "npm:type-detect@1.0.0"
        }
      },
      "npm:deep-eql@0.1.3": {
        "map": {
          "type-detect": "npm:type-detect@0.1.1"
        }
      }
    }
  },
  transpiler: "babel",
  packages: {
    "htz-npm-only": {
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
