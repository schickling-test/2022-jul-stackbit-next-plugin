import type { NextConfig } from 'next'
import type webpack from 'webpack'
import { NextPluginOptions, runBeforeWebpackCompile } from './plugin.js'

export type { NextConfig }

const devServerStartedRef = { current: false }

export const defaultPluginOptions: NextPluginOptions = {
  rootDir: '.',
  ssgHost: 'localhost',
  ssgPort: 3000,
}

/**
 * This function allows you to provide custom plugin options (currently there are none however).
 *
 * @example
 * ```js
 * // next.config.mjs
 * import { createStackbitPlugin } from 'experimental-next-stackbit'
 *
 * const withStackbit = createStackbitPlugin({ rootDir: '.', ssgHost: 'localhost', ssgPort: 3000 })
 *
 * export default withStackbit({
 *   // My Next.js config
 * })
 * ```
 */
export const createStackbitPlugin =
  (pluginOptions: NextPluginOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => {
    // could be either `next dev` or just `next`
    const isNextDev =
      process.argv.includes('dev') || process.argv.some((_) => _.endsWith('bin/next') || _.endsWith('bin\\next'))

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
 * // next.config.mjs
 * import { withStackbit } from 'experimental-next-stackbit'
 *
 * export default withStackbit({
 *   // My Next.js config
 * })
 * ```
 */
export const withStackbit = createStackbitPlugin(defaultPluginOptions)

class StackbitWebpackPlugin {
  constructor(readonly pluginOptions: NextPluginOptions) {}

  apply(compiler: webpack.Compiler) {
    compiler.hooks.beforeCompile.tapPromise('StackbitWebpackPlugin', async () => {
      await runBeforeWebpackCompile({
        pluginOptions: this.pluginOptions,
        devServerStartedRef,
        mode: compiler.options.mode,
      })
    })
  }
}
