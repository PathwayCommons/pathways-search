var path = require('path');
var webpack = require('webpack');
var webpackStripLoader = require('strip-loader');

module.exports = {
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: true
			}
		})
	],
	entry: ['./js/main.js'],
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
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
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader', 'postcss-loader']
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file?name=fonts/[name].[ext]'
			},
			{
				test: /\.png$/,
				loader: 'url-loader'
			},
			{
				test: [/\.js$/, /\.es6$/],
				exclude: /node_modules/,
				loader: webpackStripLoader.loader('console.log')
			}
		]
	}
};
