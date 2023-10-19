import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import BaseBanner from '../BaseBanner'
import CompetitionBanner from '../CompetitionBanner'
import GalxeSyndicateBanner from '../GalxeSyndicateBanner'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import { OpBnbBanner } from '../OpBnbBanner'
import PerpetualBanner from '../PerpetualBanner'
import TradingRewardBanner from '../TradingRewardBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'

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
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <GalxeSyndicateBanner /> },
      { shouldRender: true, banner: <OpBnbBanner /> },
      { shouldRender: true, banner: <BaseBanner /> },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <GalxeTraverseBanner /> },
      { shouldRender: true, banner: <TradingRewardBanner /> },
      {
        shouldRender: isRenderCompetitionBanner,
        banner: <CompetitionBanner />,
      },
      {
        shouldRender: true,
        banner: <PerpetualBanner />,
      },
    ]
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [isRenderCompetitionBanner])
}
