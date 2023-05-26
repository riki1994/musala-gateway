const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './app/app.js',
    mode: 'production',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ["", ".json", ".node", ".js"]
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: 'url-loader?limit=100000'
            },
            {
                test: /.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
        ]
    },
    externals: [ nodeExternals() ]
}