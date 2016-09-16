const path = require('path');
const webpack = require('webpack');
const htmlPlugin = require('html-webpack-plugin');
const openBrowserPlugin = require('open-browser-webpack-plugin');

const APP_CONFIG = require('./.app-config.json');

const PATHS = {
	app: path.join(__dirname, 'src'),
	images:path.join(__dirname,'src/assets/'),
	build: path.join(__dirname, 'dist')
};

const options = {
	host:'localhost',
	port:'3000'
};

module.exports = {
	entry: {
		app: PATHS.app
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	devServer: {
			historyApiFallback: true,
			hot: true,
			https: true,
			inline: true,
			stats: 'errors-only',
			host: options.host, // Defaults to `localhost`
			port: options.port // Defaults to 8080
		},
	module: {
		loaders: [
			{
				test: /index.html$/,
				loader: 'html',
			},
			{
				test: /index.html$/,
				loader: 'string-replace',
				query: {
					multiple: [
						{search: '$GOOGLE_SHEETS_CLIENT_ID', replace: APP_CONFIG.GOOGLE_SHEETS_CLIENT_ID},
						{search: '$GOOGLE_SHEETS_DOCUMENT_URL', replace: APP_CONFIG.GOOGLE_SHEETS_DOCUMENT_URL}
					]
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					cacheDirectory: true,
					presets: ['es2015']
				}
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css'],
				include:PATHS.app
			},
			{
				test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				loader: 'file',
				query: {
					name: '[path][name].[ext]'
				}
			},
		]
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin({
				multiStep: true
		}),
		new htmlPlugin({
			template:path.join(PATHS.app,'index.html'),
			inject:'body'
		}),
		new openBrowserPlugin({
			url: `http://${options.host}:${options.port}`
		})
	]
};
