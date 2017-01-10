var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './js/main.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'react'],
				plugins: ['transform-object-rest-spread']
			}
		},
		{
			test: /\.scss$/,
			loaders: ['style-loader', 'css-loader', 'sass-loader']
		}]
	},
};
