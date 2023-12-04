import { NoProfileAvatarIcon, Flex, Skeleton, Text, Box, useMatchBreakpoints, ProfileAvatar } from '@sweepstakes/uikit'
import { useAccount } from 'wagmi'
import { styled } from 'styled-components'
import { useTranslation } from '@sweepstakes/localization'
import truncateHash from '@sweepstakes/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'

const Desktop = styled(Flex)`
  align-items: center;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const Sticker = styled(Flex)`
  height: 120px;
  width: 120px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  border: 3px solid ${({ theme }) => theme.colors.invertedContrast};
  border-radius: ${({ theme }) => theme.radii.circle};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const StyledNoProfileAvatarIcon = styled(NoProfileAvatarIcon)`
  height: 100%;
  width: 100%;
`

const UserDetail = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isTablet, isDesktop } = useMatchBreakpoints()
  const { domainName, isLoading: isDomainNameLoading, avatar } = useDomainNameForAddress(account ?? '')

  return (
    <>
      {(isTablet || isDesktop) && (
        <Desktop>
          <Box mr="24px">
            <Sticker>
              {avatar ? <ProfileAvatar src={avatar} width={32} height={32} mr="16px" /> : <StyledNoProfileAvatarIcon />}
            </Sticker>
          </Box>
          <Flex flexDirection="column">
            {isDomainNameLoading || !account ? (
              <Skeleton width={160} height={16} my="4px" />
            ) : account ? (
              <Text fontSize="16px">
                {t('Connected with %address%', { address: domainName || truncateHash(account) })}
              </Text>
            ) : null}
          </Flex>
        </Desktop>
      )}
    </>
  )
}

export default UserDetail
