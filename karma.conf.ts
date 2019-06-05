import { Config } from 'karma'
import path from 'path'
import { Configuration } from 'webpack'

module.exports = (config: Config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'test/**/*.spec.ts*',
      // 'src/**/*.ts',
      // 'src/**/*.tsx',
      // 'test/**/*.ts',
      // 'test/**/*.tsx',
      // 'test/**/*.png',
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    proxies: {
      '/test/': path.resolve(__dirname, 'test'),
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // '**/*.ts': ['karma-typescript'],
      // '**/*.tsx': ['karma-typescript'],
      // add webpack as preprocessor
      'test/**/*.spec.ts*': [ 'webpack' ],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    mime: {
      // 'text/x-typescript': ['ts', 'tsx'],
    },

    browserNoActivityTimeout: 30 * 1000,
  })

  const webpackConfig: Configuration = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  module: 'es2015',
                },
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: [ path.resolve(__dirname, 'test') ],
          enforce: 'post',
          use: {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true },
          }
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
    resolve: {
      extensions: ['.js', '.ts', '.json', '.tsx'],
    },
  }

  config.set({
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'text-summary' ],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      ['report-config']: {
        html: { outdir: 'html' }
      }
    },
  } as any)
}
