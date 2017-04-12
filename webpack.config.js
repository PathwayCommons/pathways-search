var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: ['./js/App.js'],
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		rules: [{
				test: /.jsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader']
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.png$/,
				use: 'url-loader'
			}
		]
	}
};
