import { ImgHTMLAttributes } from 'react'
import { styled } from 'styled-components'
import { PlaceholderIcon } from '@sweepstakes/uikit'

interface AchievementAvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  badge?: string
}

const NoBadgePlaceholderIcon = styled(PlaceholderIcon)`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const StyledAchievementAvatar = styled.img`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const AchievementAvatar: React.FC<React.PropsWithChildren<AchievementAvatarProps>> = ({ badge, ...props }) => {
  if (!badge) {
    return <NoBadgePlaceholderIcon />
  }

  return <StyledAchievementAvatar src={`/images/achievements/${badge}`} alt="achievement badge" {...props} />
}

export default AchievementAvatar
