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
        clean: true
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
        cache: false
    }
}

