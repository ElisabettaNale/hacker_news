const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { type } = require('os');

module.exports = {
    entry: {
        principale: './src/js/script.js',
        secondario: './src/js/script2.js'
    },
    output: {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: { rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
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
            title: 'Applicazione webpack',
            template: './src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/img', to: 'img' }
            ]
        })
    ],
    devServer: {
        open: true,
        static: path.resolve(__dirname, 'dist'),
    }
}

console.log(__dirname)
