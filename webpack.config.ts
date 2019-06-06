import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const isTest = process.env.NODE_ENV === 'test'

const rel = (filename: string) => path.resolve(__dirname, filename)

const entries = {
  index: ['./demo/index.tsx'],
}

const config: Configuration = {
  entry: entries,

  output: {
    path: rel('docs'),
    filename: 'dist/[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: isTest ? 'test/tsconfig.json' : 'demo/tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
      ...(isTest ? [{
        test: /\.tsx?$/,
        exclude: [ rel('./test') ],
        enforce: 'post' as 'post',
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
        },
      }] : []),
      {
        test: /\.(mp4|png|jpg|jpeg|png|svg|cur)$/,
        use: [
          'file-loader?name=res/[name]-[hash:6].[ext]',
        ],
        exclude: /icons/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },

  plugins: [
    ...Object.keys(entries)
      .map(entry => new HtmlWebpackPlugin({
        filename: entry + '.html',
        template: './demo/index.html',
        chunks: [entry],
      })),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.json', '.tsx'],
  },

  externals: isTest ? {} : {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  devServer: {
    host: '0.0.0.0',
    port: 8899,
  },

  devtool: process.env.WEBPACK_DEV_SERVER ? 'inline-source-map' : false,
}

export default config
