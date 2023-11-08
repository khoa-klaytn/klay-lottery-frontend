import { useEffect, useState } from 'react'
import { Flex, FlexProps } from '@sweepstakes/uikit'
import random from 'lodash/random'
import uniqueId from 'lodash/uniqueId'
import { BallWithNumber } from '../svgs'
import { BallColor } from '../svgs/Balls'

interface WinningNumbersProps extends FlexProps {
  number: string[]
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
  const colors: BallColor[] = ['pink', 'lilac', 'teal', 'aqua', 'green', 'yellow']

  useEffect(() => {
    if (rotateText && number && rotationValues.length === 0) {
      setRotationValues(number.map(() => random(-30, 30)))
    }
  }, [rotateText, number, rotationValues])

  return (
    <Flex justifyContent="space-between" {...containerProps}>
      {number.map((num, index) => {
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
