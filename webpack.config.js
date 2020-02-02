const path = require('path');
module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'app'),
  watch: false,
  output: {
    path: path.join(__dirname, 'public/scripts/'),
    publicPath: '/public/scripts/',
    filename: "index.js",
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'babel-loader',
      query: {
        presets: [
          ["@babel/env", {
            "targets": {
              "browsers": "last 2 chrome versions"
            }
          }]
        ]
      }
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
};