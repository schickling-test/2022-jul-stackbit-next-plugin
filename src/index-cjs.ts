import type { NextConfig } from 'next'
import type webpack from 'webpack'

import type { NextPluginOptions } from './plugin.js'

export type { NextConfig }

const devServerStartedRef = { current: false }

const defaultPluginOptions: NextPluginOptions = {
  rootDir: '.',
  ssgHost: 'localhost',
  ssgPort: 3000,
}
module.exports.defaultPluginOptions = defaultPluginOptions

/**
 * This function allows you to provide custom plugin options (currently there are none however).
 *
 * @example
 * ```js
 * // next.config.js
 * const { createStackbitPlugin } = require('experimental-next-stackbit')
 *
 * const withStackbit = createStackbitPlugin({ rootDir: '.', ssgHost: 'localhost', ssgPort: 3000 })
 *
 * export default withStackbit({
 *   // My Next.js config
 * })
 * ```
 */
module.exports.createStackbitPlugin =
  (pluginOptions: NextPluginOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig>) => {
    return {
      ...nextConfig,
      webpack(config: webpack.Configuration, options: any) {
        config.plugins!.push(new StackbitWebpackPlugin(pluginOptions))

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    }
  }

/**
 * Next.js plugin for Stackbit with default options.
 *
 * If you want to provide custom plugin options, please use {@link createStackbitPlugin} instead.
 *
 * @example
 * ```js
 * // next.config.js
 * const { withStackbit } = require('experimental-next-stackbit')
 *
 * export default withStackbit({
 *   // My Next.js config
 * })
 * ```
 */
module.exports.withStackbit = module.exports.createStackbitPlugin(defaultPluginOptions)

class StackbitWebpackPlugin {
  constructor(readonly pluginOptions: NextPluginOptions) {}

  apply(compiler: webpack.Compiler) {
    compiler.hooks.beforeCompile.tapPromise('StackbitWebpackPlugin', async () => {
      const { runBeforeWebpackCompile } = await import('./plugin.js')

      await runBeforeWebpackCompile({
        pluginOptions: this.pluginOptions,
        devServerStartedRef,
        mode: compiler.options.mode,
      })
    })
  }
}
