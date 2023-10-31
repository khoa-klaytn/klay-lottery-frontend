import { useState } from 'react'
import sumBy from 'lodash/sumBy'
import { Card, CardBody, CardHeader, Flex, Heading, PrizeIcon } from '@sweepstakes/uikit'
import { useProfile } from 'state/profile/hooks'
import { Achievement } from 'state/types'
import { useTranslation } from '@sweepstakes/localization'
import AchievementRow from './AchievementRow'

const ClaimPointsCallout: React.FC<React.PropsWithChildren<{ onSuccess?: () => void }>> = ({ onSuccess = null }) => {
  const [claimableAchievements, setClaimableAchievement] = useState<Achievement[]>([])
  const { t } = useTranslation()
  const { profile, refresh: refreshProfile } = useProfile()

  const handleCollectSuccess = (achievement: Achievement) => {
    refreshProfile()
    setClaimableAchievement((prevClaimableAchievements) =>
      prevClaimableAchievements.filter((prevClaimableAchievement) => prevClaimableAchievement.id !== achievement.id),
    )
    onSuccess?.()
  }

  if (!profile?.isActive) {
    return null
  }

  if (claimableAchievements.length === 0) {
    return null
  }

  const totalPointsToCollect = sumBy(claimableAchievements, 'points')

  return (
    <Card isActive mb="32px">
      <CardHeader>
        <Flex flexDirection={['column', null, 'row']} justifyContent={['start', null, 'space-between']}>
          <Flex alignItems="center" mb={['16px', null, 0]}>
            <PrizeIcon width="32px" mr="8px" />
            <Heading scale="lg">{t('%num% Points to Collect', { num: totalPointsToCollect })}</Heading>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        {claimableAchievements.map((achievement) => (
          <AchievementRow key={achievement.address} achievement={achievement} onCollectSuccess={handleCollectSuccess} />
        ))}
      </CardBody>
    </Card>
  )
}

export default ClaimPointsCallout
