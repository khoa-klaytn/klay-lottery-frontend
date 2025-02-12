import { Trans } from '@sweepstakes/localization'
import { AtomBox, Heading, Image, Text } from '@sweepstakes/uikit'
import { useState, useCallback } from 'react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay } from 'swiper/modules'

const IntroSteps = [
  {
    title: <Trans>Your first step in the DeFi world</Trans>,
    icon: '/images/wallets/pulsar-wallet.svg',
    description: (
      <Trans>A Web3 Wallet allows you to send and receive crypto assets like bitcoin, BNB, ETH, and much more.</Trans>
    ),
  },
  {
    title: <Trans>Login using a wallet connection</Trans>,
    icon: '/images/wallets/pulsar-world.svg',
    description: (
      <Trans>
        Instead of setting up new accounts and passwords for every website, simply set up your wallet in one go, and
        connect it to your favorite DApps.
      </Trans>
    ),
  },
]

const StepDot = ({ active, place, onClick }: { active: boolean; place: 'left' | 'right'; onClick: () => void }) => (
  <AtomBox padding="4px" onClick={onClick} cursor="pointer">
    <AtomBox
      bgc={active ? 'secondary' : 'inputSecondary'}
      width="56px"
      height="8px"
      borderLeftRadius={place === 'left' ? 'card' : '0'}
      borderRightRadius={place === 'right' ? 'card' : '0'}
    />
  </AtomBox>
)

const StepIntro = () => {
  const [step, setStep] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  const handleRealIndexChange = useCallback((swiperInstance: SwiperClass) => {
    setStep(swiperInstance.realIndex)
  }, [])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      return () => {
        setStep(stepIndex)
        swiper?.slideTo(stepIndex)
      }
    },
    [swiper],
  )

  return (
    <AtomBox
      display="flex"
      width="100%"
      flexDirection="column"
      style={{ gap: '24px' }}
      mx="auto"
      my="48px"
      justifyContent="center"
      textAlign="center"
      alignItems="center"
    >
      <Swiper
        loop
        initialSlide={0}
        slidesPerView={1}
        modules={[Autoplay]}
        onSwiper={setSwiper}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        onRealIndexChange={handleRealIndexChange}
        style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}
      >
        {IntroSteps.map((introStep) => (
          <SwiperSlide key={introStep.icon}>
            <Heading as="h2" color="invertedContrast">
              {introStep.title}
            </Heading>
            <Image m="auto" src={introStep.icon} width={198} height={178} />
            <Text maxWidth="368px" m="auto" small color="textSubtle">
              {introStep.description}
            </Text>
          </SwiperSlide>
        ))}
      </Swiper>
      <AtomBox display="flex">
        <StepDot place="left" active={step === 0} onClick={handleStepClick(0)} />
        <StepDot place="right" active={step === 1} onClick={handleStepClick(1)} />
      </AtomBox>
    </AtomBox>
  )
}

export default StepIntro
