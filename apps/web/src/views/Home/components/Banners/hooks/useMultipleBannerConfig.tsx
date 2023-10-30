import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import BaseBanner from '../BaseBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 * {
 *   shouldRender: isRenderCompetitionBanner,
 *   banner: <CompetitionBanner />,
 * },
 * ```
 */

export const useMultipleBannerConfig = () => {
  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [{ shouldRender: true, banner: <BaseBanner /> }]

    const SHUFFLE_BANNERS: IBannerConfig[] = []
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [])
}
