const path = require("path");

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        port: 3001,
        open: true,
        hot: true,
    },
    entry:  './src/public/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: 'main.[hash].js',
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/public/index.html'
    }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
        })],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            }
                        }
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                type: 'asset/resource',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitWarning: true, // выдать ошибки как warning
                        },
                    },
                ],
            },
        ]
    }
}