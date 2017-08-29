import babel from 'rollup-plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import copy from 'rollup-plugin-copy'
import uglify from 'rollup-plugin-uglify'

const options = {
  entry: 'src/ionic-simple-datepicker.js',
  dest: 'dist/ionic-simple-datepicker.js',
  sourceMap: false,
  moduleName: 'OSC',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup'],
      runtimeHelpers: false,
      externalHelpers: false,
      exclude: 'node_modules/**',
    }),
    copy({
      'src/ionic-simple-datepicker.css': 'dist/ionic-simple-datepicker.css',
    }),
    cleanup(),
  ],
  format: 'umd',
}

export default [
  options,
  Object.assign({}, options, {
    dest: 'dist/ionic-simple-datepicker.js',
    sourceMap: true,
  }),
  Object.assign({}, options, {
    dest: 'dist/ionic-simple-datepicker.min.js',
    plugins: options.plugins.concat(uglify()),
  }),
]
