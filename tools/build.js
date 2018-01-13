'use strict';
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');
const fs = require('fs-extra');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const pkg = require('../package.json');
const scss = require('rollup-plugin-scss');
const collectSass = require('rollup-plugin-collect-sass');

console.log('pkg', pkg);

const OUTPUT_DIR = path.resolve(__dirname, './temp/example');
const SRC_DIR = path.resolve(__dirname, '../src');
const SRC_MAIN = path.resolve(__dirname, '../src/px-example-component/index.js');
fs.ensureDirSync(OUTPUT_DIR);

const babelPlugins = [

  [
    "styled-jsx/babel",
    { "plugins": ["styled-jsx-plugin-sass"] }
  ],
  'transform-react-remove-prop-types',
  'transform-es2015-destructuring',
  'transform-es2015-function-name',
  'transform-es2015-parameters',
  /*
  ['css-modules-transform', {
    "devMode": true,
    "preprocessCss": "./build-scss-preprocess.js",
    "extensions": [".css", ".scss", ".less"],
    "extractCss": {
      "dir": `${OUTPUT_DIR}/css`,
      "relativeRoot": SRC_DIR,
      "filename": "[path]/[name].css"
    }
  }]
  */
];


const bundles = [
  {
    format: 'cjs', ext: '.cjs.js', plugins: [],
    moduleName: pkg.config.library,
    babelPresets: [
      'es2015-rollup',
      'react'
    ],
    babelPlugins: babelPlugins
  },
  {
    format: 'es', ext: '.mjs', plugins: [],
    moduleName: pkg.config.library,
    babelPresets: [
      'es2015-rollup',
      'react'
    ],
    babelPlugins: babelPlugins
  },

  {
    format: 'cjs', ext: '.browser.js', plugins: [],
    babelPresets: ['es2015-rollup', 'react'],
    moduleName: pkg.config.library,
    babelPlugins: babelPlugins
  },
  {
    format: 'umd', ext: '.umd.js', plugins: [],
    babelPresets: ['es2015-rollup', 'react'],
    babelPlugins: babelPlugins,
    moduleName: pkg.config.library
  },
  {
    format: 'umd', ext: '.min.js', plugins: [uglify()],
    babelPresets: ['es2015-rollup', 'react'],
    babelPlugins: babelPlugins,
    moduleName: pkg.config.library,
    minify: true
  }
];

let promise = Promise.resolve();

// Clean up the output directory
//promise = promise.then(() => del([`${OUTPUT_DIR}/*`]));

// Compile source code into a distributable format with Babel and Rollup
for (const config of bundles) {
  console.log('Using Config', config);
  promise = promise.then(() => rollup.rollup({
    input: SRC_MAIN,
    external: [
      'prop-types',
      'react',
      'react-dom'
    ].concat(Object.keys(pkg.dependencies || pkg.devDependencies)),
    plugins: [


      resolve({
        main: true
        //browser: true
      }),

      /*collectSass({
        extract: true,
        importOnce: true
      }),*/

      babel({
        babelrc: false,
        exclude: ['node_modules/**', '**/*.scss'],
        presets: config.babelPresets,
        plugins: config.babelPlugins
      }),
      commonjs()
    ].concat(config.plugins)
  }).then(bundle => bundle.write({
    file: `${OUTPUT_DIR}/${config.moduleName || 'main'}${config.ext}`,
    format: config.format,
    sourcemap: !config.minify,
    name: config.moduleName
  })));
}

// Copy package.json and LICENSE.txt
promise = promise.then(() => {
  delete pkg.private;
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.eslintConfig;
  delete pkg.babel;
  fs.writeFileSync(`${OUTPUT_DIR}/package.json`, JSON.stringify(pkg, null, '  '), 'utf-8');
  fs.writeFileSync(`${OUTPUT_DIR}/LICENSE.md`, fs.readFileSync(path.resolve(__dirname, '../LICENSE.md'), 'utf-8'), 'utf-8');
});

promise.catch(err => console.error(err, err.stack)); // eslint-disable-line no-console
