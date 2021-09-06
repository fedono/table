const HtmlWebpackPlugin = require('html-webpack-plugin');
const {WebpackOpenBrowser} = require('webpack-open-browser');
const ProgressBar = require('progress-bar-webpack-plugin')
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './index.tsx',
    output: {
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: ["/node_modules"]
            }
        ]
    },
  devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
    port: 8080,
    open: true
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.less']
  },
  plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new ProgressBar(),
        new WebpackOpenBrowser({
          url: 'http://localhost:3000', browser: 'chrome'
        })
    ]
}