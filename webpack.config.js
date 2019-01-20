const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'examples/src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'examples/dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './examples/public/index.html'})
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: 3000
  }
};
