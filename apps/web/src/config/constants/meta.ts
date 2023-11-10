import memoize from 'lodash/memoize'
import { ContextApi } from '@sweepstakes/localization'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'SweepStakes',
  description: 'Win it in the Lottery, on a platform you can trust.',
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': { title: t('Lottery') }, // TODO: change this back to Home
      '/lottery': { title: t('Lottery') },
      '/info': {
        title: `${t('Overview')} - ${t('Info')}`,
        description: 'View statistics for SweepStakesswap exchanges.',
      },
      '/info/pairs': {
        title: `${t('Pairs')} - ${t('Info')}`,
        description: 'View statistics for SweepStakesswap exchanges.',
      },
      '/info/tokens': {
        title: `${t('Tokens')} - ${t('Info')}`,
        description: 'View statistics for SweepStakesswap exchanges.',
      },
      '/profile': { basePath: true, title: t('Profile') },
    },
    defaultTitleSuffix: t('SweepStakes'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta => {
    const pathList = getPathList(t)
    const pathMetadata =
      pathList.paths[path] ??
      pathList.paths[Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]]

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
