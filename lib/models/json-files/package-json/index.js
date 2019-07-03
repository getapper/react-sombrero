const JsonFile = require('..')
const path = require('path')

class PackageJson extends JsonFile {
  constructor(json) {
    super(json)
  }

  init(json) {
    this.json = Object.assign({}, {
      "version": "0.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "dev": "cross-env REST_ENV=LOCALE cross-env PORT=3620 cross-env node scripts/start.js",
        "build": "cross-env REST_ENV=PRODUCTION cross-env NODE_ENV=production cross-env node scripts/build.js"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
        "axios": "0.18.0",
        "classnames": "2.2.6",
        "@material-ui/core": "4.1.3",
        "@material-ui/icons": "4.2.1",
        "immutable": "3.8.2",
        "joi-browser": "13.4.0",
        "lodash": "4.17.11",
        "prop-types": "15.7.2",
        "react": "16.8.6",
        "react-attire": "0.4.3",
        "react-dom": "16.8.6",
        "react-hot-loader": "4.6.3",
        "react-i18next": "7.12.0",
        "react-joi-form-decorator": "1.2.0",
        "react-redux": "5.0.7",
        "react-redux-hash-router": "1.2.0",
        "redux": "4.0.0",
        "redux-immutable": "4.0.0",
        "redux-saga": "0.16.0",
        "i18next": "11.9.0",
        "i18next-browser-languagedetector": "2.2.3"
      },
      "devDependencies": {
        "@babel/runtime": "7.0.0-beta.42",
        "autoprefixer": "6.7.7",
        "babel-core": "6.26.3",
        "babel-eslint": "10.0.1",
        "babel-loader": "6.2.4",
        "babel-plugin-transform-runtime": "6.23.0",
        "babel-preset-es2015": "6.24.1",
        "babel-preset-react": "6.24.1",
        "babel-preset-stage-2": "6.24.1",
        "babel-runtime": "6.26.0",
        "case-sensitive-paths-webpack-plugin": "2.1.2",
        "cross-env": "5.2.0",
        "css-hot-loader": "1.4.3",
        "css-loader": "0.23.1",
        "detect-port": "1.2.3",
        "eslint": "5.16.0",
        "eslint-loader": "1.6.0",
        "eslint-config-airbnb": "17.1.0",
        "eslint-import-resolver-webpack": "0.11.1",
        "eslint-plugin-flowtype": "2.21.0",
        "eslint-plugin-import": "2.16.0",
        "eslint-plugin-jsx-a11y": "6.2.1",
        "eslint-plugin-react": "7.12.4",
        "extract-text-webpack-plugin": "2.1.2",
        "file-loader": "1.1.11",
        "html-webpack-plugin": "3.2.0",
        "node-sass": "4.12.0",
        "postcss-loader": "2.0.10",
        "promise": "8.0.3",
        "react-dev-utils": "5.0.2",
        "sass-loader": "6.0.5",
        "style-loader": "0.13.1",
        "url-loader": "0.6.2",
        "webpack": "2.5.0",
        "webpack-dev-server": "2.5.1",
        "webpack-hot-middleware": "2.24.3",
        "webpack-manifest-plugin": "2.0.4",
        "whatwg-fetch": "3.0.0"
      },
      "restUris": {
        "LOCALE": "http://localhost:5554"
      },
      "engines": {
        "node": ">=9.11.1",
        "npm": ">=5.6.0"
      }
    }, json)
  }

  read() {
    super.read('/package.json')
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR, '/package.json'), true)
  }
}

module.exports = PackageJson
