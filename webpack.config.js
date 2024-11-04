const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: './src/js/script.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    module: { rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            use: {
                loader: 'img-optimize-loader',
                options: {
                    compress: { mode: 'low'}
                }
            }
        },
        {
            test: /\.html$/i,
            loader: 'html-loader'
        }
    ] },
    plugins: [
        new HtmlWebpackPlugin({ 
            template: './src/index.html',
            favicon: './src/img/favicon_orange.ico'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/img', to: 'img' },
                { from: 'src/img/favicon_orange.ico', to: 'favicon_orange.ico' }
            ]
        })
    ],
    devServer: {
        open: true,
        static: path.resolve(__dirname, 'dist'),
        cache: false
    }
}

