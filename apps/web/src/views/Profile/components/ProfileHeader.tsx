import {
  Flex,
  Button,
  useModal,
  Grid,
  Box,
  Heading,
  VisibilityOff,
  VisibilityOn,
  NextLinkFromReactRouter as ReactRouterLink,
  ScanLink,
} from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { getBlockExploreLink, isAddress } from 'utils'
import truncateHash from '@sweepstakes/utils/truncateHash'
import { Achievement, Profile } from 'state/types'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import useGetUsernameWithVisibility from 'hooks/useUsernameWithVisibility'
import { useDomainNameForAddress } from 'hooks/useDomain'
import EditProfileModal from './EditProfileModal'

interface HeaderProps {
  accountPath: string
  profile: Profile
  achievements: Achievement[]
  nftCollected: number
  isAchievementsLoading: boolean
  isNftLoading: boolean
  isProfileLoading: boolean
  onSuccess?: () => void
}

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({ accountPath, profile, onSuccess }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { domainName } = useDomainNameForAddress(accountPath)
  const { usernameWithVisibility, userUsernameVisibility, setUserUsernameVisibility } = useGetUsernameWithVisibility(
    profile?.username,
  )
  const [onEditProfileModal] = useModal(
    <EditProfileModal
      onSuccess={() => {
        onSuccess?.()
      }}
    />,
    false,
  )

  const isConnectedAccount = isAddress(account) === isAddress(accountPath)
  const profileUsername = isConnectedAccount ? usernameWithVisibility : profile?.username

  const toggleUsernameVisibility = () => {
    setUserUsernameVisibility(!userUsernameVisibility)
  }

  const Icon = userUsernameVisibility ? VisibilityOff : VisibilityOn

  const title = useMemo(() => {
    if (profileUsername) {
      return `@${profileUsername}`
    }

    if (accountPath) {
      return domainName || truncateHash(accountPath, 5, 3)
    }

    return null
  }, [domainName, profileUsername, accountPath])

  const description = useMemo(() => {
    const getActivateButton = () => {
      if (!profile) {
        return (
          <ReactRouterLink to="/create-profile">
            <Button mt="16px">{t('Activate Profile')}</Button>
          </ReactRouterLink>
        )
      }
      return (
        <Button width="fit-content" mt="16px" onClick={onEditProfileModal}>
          {t('Reactivate Profile')}
        </Button>
      )
    }

    return (
      <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
        {accountPath && profile?.username && (
          <ScanLink href={getBlockExploreLink(accountPath, 'address')} bold color="primary">
            {domainName || truncateHash(accountPath)}
          </ScanLink>
        )}
        {accountPath && isConnectedAccount && !profile && getActivateButton()}
      </Flex>
    )
  }, [domainName, accountPath, isConnectedAccount, onEditProfileModal, profile, t])

  return (
    <>
      <Grid
        pb="48px"
        gridGap="16px"
        alignItems="center"
        gridTemplateColumns={['1fr', null, null, null, 'repeat(2, 1fr)']}
      >
        <Box>
          <Heading as="h1" scale="xl" color="secondary" mb="16px">
            {title}
            {isConnectedAccount && profile?.username ? (
              <Icon ml="4px" onClick={toggleUsernameVisibility} cursor="pointer" />
            ) : null}
          </Heading>
          {description}
        </Box>
      </Grid>
    </>
  )
}

export default ProfileHeader
