import type { WebpackOptionsNormalized } from 'webpack'

import * as StackbitDev from '@stackbit/dev/dist/dev.js'

export type NextPluginOptions = Parameters<(typeof StackbitDev)['start']>[0]

export const runBeforeWebpackCompile = async ({
  mode,
  pluginOptions,
  devServerStartedRef,
}: {
  mode: WebpackOptionsNormalized['mode']
  pluginOptions: NextPluginOptions
  devServerStartedRef: { current: boolean }
}) => {
  const isNextDev = mode === 'development'

  if (isNextDev && !devServerStartedRef.current) {
    devServerStartedRef.current = true
    StackbitDev.start(pluginOptions)
  }
}
