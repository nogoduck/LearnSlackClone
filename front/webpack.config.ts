import path from "path";
// import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";
// import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isDevelopment = process.env.NODE_ENV !== "production";

//타입스크립트는 자바스크립트의 변수, 함수 매개변수, 함수 리턴값에 타입을 붙일 수 있다.
const config: webpack.Configuration = {
  name: "front",
  mode: isDevelopment ? "development" : "production",
  devtool: !isDevelopment ? "hidden-source-map" : "eval", //inline-source-map 또는 eval
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], //babel이 처리할 확장자목록
    alias: {
      // '../../' 대신 절대경로를 가질 수 있다.
      //자바스크립트로 바꿔주는 웹펙은 아래 경로를 보고 바꾼다
      "@hooks": path.resolve(__dirname, "hooks"),
      "@components": path.resolve(__dirname, "components"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
    },
  },
  entry: {
    app: "./client",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { browsers: ["last 2 chrome versions"] },
                debug: isDevelopment,
              },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
          env: {
            development: {
              plugins: [["@emotion", { sourceMap: true }], require.resolve("react-refresh/babel")],
            },
            production: {
              plugins: ["@emotion"],
            },
          },
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   async: false,
    //   // eslint: {
    //   //   files: "./src/**/*",
    //   // },
    // }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? "development" : "production" }),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/",
  },
  // devServer: {
  //   historyApiFallback: true, // react router
  //   port: 3090,
  //   publicPath: "/dist/",
  //   proxy: {
  //     "/api/": {
  //       target: "http://localhost:3095",
  //       changeOrigin: true,
  //     },
  //   },
  // },
};

if (isDevelopment && config.plugins) {
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());
  // config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "server", openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
  // config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static" }));
}

export default config;
