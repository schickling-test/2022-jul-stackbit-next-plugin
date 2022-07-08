import type { NextConfig } from 'next'
import type * as StackbitDev from '@stackbit/dev/dist/dev.js'

type StackbitDevOptions = Parameters<typeof StackbitDev['start']>[0]

export type { NextConfig }

let devServerStarted = false

const defaultPluginOptions: StackbitDevOptions = {
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
  (stackbitDevOptions: StackbitDevOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => {
    // could be either `next dev` or just `next`
    const isNextDev =
      process.argv.includes('dev') || process.argv.some((_) => _.endsWith('bin/next') || _.endsWith('bin\\next'))
    const isBuild = process.argv.includes('build')

    return {
      ...nextConfig,
      // Since Next.js doesn't provide some kind of real "plugin system" we're (ab)using the `redirects` option here
      // in order to hook into and block the `next build` and initial `next dev` run.
      redirects: async () => {
        const { start } = await import('@stackbit/dev/dist/dev.js')

        if (isNextDev && !devServerStarted) {
          devServerStarted = true
          start(stackbitDevOptions)
        }

        return nextConfig.redirects?.() ?? []
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
