import {
  Box,
  Flex,
  Tag,
  LockIcon,
  useTooltip,
  TooltipText,
  Skeleton,
  Text,
  NextLinkFromReactRouter,
  useMatchBreakpoints,
} from '@sweepstakes/uikit'
import { VaultPosition } from 'utils/cakePool'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from '@sweepstakes/localization'
import { styled } from 'styled-components'
import useCakeBenefits from './hooks/useCakeBenefits'

const CakeBenefitsCardWrapper = styled(Box)`
  width: 100%;
  margin-bottom: 24px;
  padding: 1px 1px 3px 1px;
  background-image: ${({ theme }) => theme.colors.gradientInversePrimary};
  border-radius: ${({ theme }) => theme.radii.default};
`

const CakeBenefitsCardInner = styled(Box)`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

interface CakeBenefitsCardProps {
  onDismiss: () => void
}

const CakeBenefitsCard: React.FC<React.PropsWithChildren<CakeBenefitsCardProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { data: cakeBenefits, status: cakeBenefitsFetchStatus } = useCakeBenefits()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: cakeTargetRef,
    tooltip: cakeTooltip,
    tooltipVisible: cakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`%lockedCake% KLAY (including rewards) are locked in the KLAY Pool until %lockedEndTime%`, {
          lockedEndTime: cakeBenefits?.lockedEndTime,
        })}
      </Text>
      <NextLinkFromReactRouter to="/pools" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: vCakeTargetRef,
    tooltip: vCakeTooltip,
    tooltipVisible: vCakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`vCAKE boosts your voting power to %totalScore% in the SweepStakes voting governance.`, {
          totalScore: cakeBenefits?.vCake?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  return cakeBenefitsFetchStatus === FetchStatus.Fetched ? (
    <>
      {[VaultPosition.None, VaultPosition.Flexible].includes(cakeBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" alignItems="center">
            <Tag variant="secondary" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('No KLAY locked')}
              </Flex>
            </Tag>
          </Flex>
        </>
      ) : [VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(cakeBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Tag variant="failure" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('KLAY staking expired')}
              </Flex>
            </Tag>
          </Flex>
        </>
      ) : (
        <CakeBenefitsCardWrapper>
          <CakeBenefitsCardInner>
            <Flex flexDirection="row" alignItems="center">
              <Tag variant="secondary" mr="auto">
                <Flex alignItems="center">
                  <Box as={LockIcon} mr="4px" />
                  {t('KLAY locked')}
                </Flex>
              </Tag>
              <TooltipText ref={cakeTargetRef} bold fontSize="16px" />
              {cakeTooltipVisible && cakeTooltip}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText color="textSubtle" fontSize="16px" mr="auto">
                bCAKE
              </TooltipText>
              {t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={vCakeTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                vCAKE
              </TooltipText>
              {vCakeTooltipVisible && vCakeTooltip}
              {cakeBenefits?.vCake?.vaultScore}
            </Flex>
          </CakeBenefitsCardInner>
        </CakeBenefitsCardWrapper>
      )}
    </>
  ) : (
    <Skeleton width="100%" height={146} borderRadius="16px" marginBottom={24} />
  )
}

export default CakeBenefitsCard
