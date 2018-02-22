import globals from 'rollup-plugin-node-globals';

export default {
  input: 'src/main.js',
  output: {
    file: 'index.js',
    format: 'umd',
  },
  plugins: [
    globals()
  ]
};