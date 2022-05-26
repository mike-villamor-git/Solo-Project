const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
    
    entry: '/index.js',
    mode: 'development', //process.env.NODE_ENV,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    }
                }
            },
            {
                test: /.(css|scss)$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    
                ]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './index.html'
    })],
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        },
        static: {
            // directory: path.join(__dirname, 'client'),
            publicPath: '/build/bundle.js',
            // directory: path.join(__dirname),

        },
        compress: true,
        port: 8080,
        hot: true
    }
}; 