// var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

module.exports = {
	node: { fs: 'empty',
			net: 'empty',
			tls: 'empty',
			module: 'empty'
		  },
	watch: true,
	entry: {
		mainpage: __dirname + '/src/scripts/mainpage.jsx',
		common: __dirname + '/src/scripts/common.jsx',
		boys_goods: __dirname + '/src/scripts/boys_goods.jsx',
		girls_goods: __dirname + '/src/scripts/girls_goods.jsx',
		cart: __dirname + '/src/scripts/cart.jsx'
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/dist/scripts'
	},
	module: {
		rules: [
			{
				test: /(.jsx|.js)$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	}
	// plugins: [
	// 	new webpackUglifyJsPlugin({
	// 		cacheFolder: __dirname + '/public/cached_uglify/',
	// 		debug: true,
	// 		minimize: true,
	// 		sourceMap: false,
	// 		output: {
	// 			comments: false
	// 		},
	// 		compressor: {
	// 			warnings: false
	// 		}
	// 	})
	// ]
};
