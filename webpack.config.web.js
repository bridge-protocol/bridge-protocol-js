const path = require('path');
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");

module.exports = {
	node:{
		 fs: 'empty'
	},
  entry: './src/index.js',
  plugins: [new LicenseCheckerWebpackPlugin({ outputFilename: "ThirdPartyNotices.txt" })],
  output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bridgeprotocol.min.js',
       libraryTarget: 'var',
       library: 'BridgeProtocol'
  }
};