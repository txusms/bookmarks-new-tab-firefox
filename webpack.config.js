var HtmlWebpackPlugin = require('html-webpack-plugin');
var NewTabHtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: __dirname + '/dist/index.html',
    inject: 'body',
    chunks: ['bookmarks'],
    minify: {
        collapseWhitespace: true,
        removeComments: true
    }
});

var OptionsHtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/options.html',
    filename: __dirname + '/dist/options.html',
    inject: 'body',
    chunks: ['options'],
    minify: {
        collapseWhitespace: true,
        removeComments: true
    }
});

var CopyWebpackPlugin = require('copy-webpack-plugin');
var CopyWebpackPluginConfig = new CopyWebpackPlugin([
    {
       from: __dirname + '/app/icons', to: __dirname + '/dist/icons' 
    },
    {
       from: __dirname + '/app/css', to: __dirname + '/dist/css' 
    },
    {
       from: __dirname + '/app/images', to: __dirname + '/dist/images' 
    },
    {
        from: __dirname + '/app/manifest.json', to: __dirname + '/dist/manifest.json'
    }
]);

module.exports = {
    node: {
        fs: 'empty'
    },
    entry: {
        bookmarks: "./app/bookmarks.js",
        options: "./app/options.js"
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    module: {
    rules: [
       {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  plugins: [NewTabHtmlWebpackPluginConfig, OptionsHtmlWebpackPluginConfig, CopyWebpackPluginConfig]
}