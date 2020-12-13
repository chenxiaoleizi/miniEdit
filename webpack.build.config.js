const path = require("path")

module.exports = {
    mode: "production",

    entry: "./lib/index.js",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./dist"),
        // library: 'MiniEdit',
        libraryTarget: 'umd'
    },
    
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}