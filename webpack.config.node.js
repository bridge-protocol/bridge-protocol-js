const path = require('path');
const nodeExternals = require('webpack-node-externals');
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");

module.exports = {
	target: 'node',
	//mode: 'development',
    entry: './src/index.js',
    plugins: [new LicenseCheckerWebpackPlugin({ outputFilename: "ThirdPartyNotices.txt" })],
    output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bridgeprotocol-sdk.js',
       libraryTarget: 'commonjs',
       library: 'BridgeProtocol'
   },
   externals: [nodeExternals()]
};