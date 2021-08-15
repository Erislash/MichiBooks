const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'frontend', 'app.js'),
    output: {
        path: path.join(__dirname, 'backend', 'public'),
        publicPath: '/backend/public',
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'frontend', 'index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'style/bundle.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {
                        // make all svg images to work in IE
                        iesafe: true,
                    },
                },
            },
        ],
    },
    devServer: {
        contentBase: path.join('backend', 'public'),
        compress: true,
        port: 9000,
    },
};
