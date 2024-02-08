const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,

	css: {
		loaderOptions: {
			scss: {
				additionalData: '@import "~@/assets/scss/custom-colors.scss";'
			}
		}
	},

	pluginOptions: {
		vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
	}
})
