module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-url': {},
		'postcss-cssnext': {
			browsers: ['last 2 versions', '> 5%'],
		},
		'cssnano': {}
	}
};
