import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, CardBody, Heading, Text, useToast } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'

const ProfilePicture: React.FC = () => {
  const publicClient = usePublicClient()
  const [isApproved, setIsApproved] = useState(false)
  const [isProfileNftsLoading, setIsProfileNftsLoading] = useState(true)
  const [userProfileCreationNfts, setUserProfileCreationNfts] = useState(null)

  useEffect(() => {
    const fetchUserPancakeCollectibles = async () => {
      try {
        setUserProfileCreationNfts(null)
      } catch (e) {
        console.error(e)
        setUserProfileCreationNfts(null)
      } finally {
        setIsProfileNftsLoading(false)
      }
    }
    setIsProfileNftsLoading(true)
    fetchUserPancakeCollectibles()
  }, [publicClient, setIsProfileNftsLoading, setUserProfileCreationNfts])

  const { t } = useTranslation()
  const { toastSuccess } = useToast()

  const handleApprove = async () => {
    toastSuccess(t('Enabled'), t('Please progress to the next step.'))
    setIsApproved(true)
  }

  if (!userProfileCreationNfts?.length && !isProfileNftsLoading) {
    return (
      <>
        <Heading scale="xl" mb="24px">
          {t('Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any Pancake Collectibles in your wallet.')}
        </Text>
        <Text as="p">
          {t(
            'You need a Pancake Collectible to finish setting up your profile. If you sold or transferred your starter collectible to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.',
          )}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 2 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.')}
          </Text>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {t(
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text>
          <Button disabled={isApproved} onClick={handleApprove} endIcon={undefined} id="approveStarterCollectible">
            {t('Enable')}
          </Button>
        </CardBody>
      </Card>
    </>
  )
}

export default ProfilePicture
