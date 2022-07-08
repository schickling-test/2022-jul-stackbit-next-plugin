import type { NextConfig } from 'next'
import * as StackbitDev from '@stackbit/dev/dist/dev.js'

type StackbitDevOptions = Parameters<typeof StackbitDev['start']>[0]

export type { NextConfig }

let devServerStarted = false

export const defaultPluginOptions: StackbitDevOptions = {
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
  (stackbitDevOptions: StackbitDevOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => {
    // could be either `next dev` or just `next`
    const isNextDev =
      process.argv.includes('dev') || process.argv.some((_) => _.endsWith('bin/next') || _.endsWith('bin\\next'))

    return {
      ...nextConfig,
      // Since Next.js doesn't provide some kind of real "plugin system" we're (ab)using the `redirects` option here
      // in order to hook into and block the `next build` and initial `next dev` run.
      redirects: async () => {
        if (isNextDev && !devServerStarted) {
          devServerStarted = true
          StackbitDev.start(stackbitDevOptions)
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
 * // next.config.mjs
 * import { withStackbit } from 'experimental-next-stackbit'
 *
 * export default withStackbit({
 *   // My Next.js config
 * })
 * ```
 */
export const withStackbit = createStackbitPlugin(defaultPluginOptions)
