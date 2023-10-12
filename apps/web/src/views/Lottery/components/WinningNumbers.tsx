import { useEffect, useState } from 'react'
import { Flex, FlexProps } from '@pancakeswap/uikit'
import random from 'lodash/random'
import uniqueId from 'lodash/uniqueId'
import { parseRetrievedNumber } from '../helpers'
import { BallWithNumber } from '../svgs'
import { BallColor } from '../svgs/Balls'

interface WinningNumbersProps extends FlexProps {
  number: string
  size?: string
  fontSize?: string
  rotateText?: boolean
}

const WinningNumbers: React.FC<React.PropsWithChildren<WinningNumbersProps>> = ({
  number,
  size = '32px',
  fontSize = '16px',
  rotateText,
  ...containerProps
}) => {
  const [rotationValues, setRotationValues] = useState([])
  const reversedNumber = parseRetrievedNumber(number)
  const colors: BallColor[] = ['pink', 'lilac', 'teal', 'aqua', 'green', 'yellow']

  useEffect(() => {
    if (rotateText && reversedNumber && rotationValues.length === 0) {
      setRotationValues(reversedNumber.map(() => random(-30, 30)))
    }
  }, [rotateText, reversedNumber, rotationValues])

  return (
    <Flex justifyContent="space-between" {...containerProps}>
      {reversedNumber.map((num, index) => {
        return (
          <BallWithNumber
            key={uniqueId()}
            rotationTransform={rotateText && rotationValues[index]}
            size={size}
            fontSize={fontSize}
            color={colors[index]}
            number={num}
          />
        )
      })}
    </Flex>
  )
}

export default WinningNumbers
