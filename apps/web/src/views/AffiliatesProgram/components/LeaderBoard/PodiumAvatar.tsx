import React from 'react'
import { styled } from 'styled-components'
import { Flex, ProfileAvatar, NoProfileAvatarIcon } from '@pancakeswap/uikit'
import { useDomainNameForAddress } from 'hooks/useDomain'

const StyledNoProfileAvatarIcon = styled(NoProfileAvatarIcon)`
  width: 100%;
  height: 100%;
`

const Wrapper = styled(Flex)<{ imageSize: number }>`
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
  }

  /* Podium is about 66% of initial size on xs devices  */
  width: ${({ imageSize }) => imageSize * 0.66 + 4}px;
  height: ${({ imageSize }) => imageSize * 0.66 + 4}px;

  /* Podium is about 80% of initial size on sm devices  */
  ${({ theme }) => theme.mediaQueries.xs} {
    width: ${({ imageSize }) => imageSize * 0.8 + 4}px;
    height: ${({ imageSize }) => imageSize * 0.8 + 4}px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: ${({ imageSize }) => imageSize + 4}px;
    height: ${({ imageSize }) => imageSize + 4}px;
  }
`

interface PodiumAvatarProps {
  position: number
  address: string
}

const PodiumAvatar: React.FC<React.PropsWithChildren<PodiumAvatarProps>> = ({ address, position }) => {
  const imageSize = position === 1 ? 128 : 113
  const { avatar } = useDomainNameForAddress(address)

  return (
    <Wrapper imageSize={imageSize}>
      {avatar ? <ProfileAvatar width={imageSize} height={imageSize} src={avatar} /> : <StyledNoProfileAvatarIcon />}
    </Wrapper>
  )
}

export default PodiumAvatar
