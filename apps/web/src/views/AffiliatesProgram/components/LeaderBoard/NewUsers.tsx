import { useTranslation } from '@sweepstakes/localization'
import { Flex, Text, Skeleton, AccountFilledIcon } from '@sweepstakes/uikit'

interface NewUsersProps {
  totalUsers: number
}

const NewUsers: React.FC<React.PropsWithChildren<NewUsersProps>> = ({ totalUsers }) => {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column">
      {totalUsers ? (
        <Flex justifyContent="center">
          {/* not as height prop because Inner wins priority with auto */}
          <AccountFilledIcon style={{ height: '24px', width: '24px' }} />
        </Flex>
      ) : (
        <Skeleton width="77px" height="24px" />
      )}
      <Text fontSize="12px" textAlign="center" color="textSubtle">
        {t('New Users')}
      </Text>
    </Flex>
  )
}

export default NewUsers
