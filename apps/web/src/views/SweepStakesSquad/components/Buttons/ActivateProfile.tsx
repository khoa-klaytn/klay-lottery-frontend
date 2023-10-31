import { Button, NextLinkFromReactRouter } from '@sweepstakes/uikit'
import { ContextApi } from '@sweepstakes/localization'
import { UserStatusEnum } from 'views/SweepStakesSquad/types'

type ActivateProfileButtonProps = {
  t: ContextApi['t']
  userStatus: UserStatusEnum
}

const ActivateProfileButton: React.FC<React.PropsWithChildren<ActivateProfileButtonProps>> = ({ t, userStatus }) => (
  <>
    {(userStatus === UserStatusEnum.NO_PROFILE || userStatus === UserStatusEnum.UNCONNECTED) && (
      <Button as={NextLinkFromReactRouter} to="/create-profile" mr="4px">
        {t('Activate Profile')}
      </Button>
    )}
  </>
)

export default ActivateProfileButton
