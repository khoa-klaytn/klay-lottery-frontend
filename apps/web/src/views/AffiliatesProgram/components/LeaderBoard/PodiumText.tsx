import { Box, Text, Skeleton, BoxProps } from '@sweepstakes/uikit'
import { formatNumber } from '@sweepstakes/utils/formatBalance'

interface PodiumTextProps extends BoxProps {
  title: string
  amount: string
  prefix?: string
}

const PodiumText: React.FC<React.PropsWithChildren<PodiumTextProps>> = ({ title, amount, prefix = '', ...props }) => {
  return (
    <Box {...props}>
      {amount ? `${prefix}${formatNumber(Number(amount), 0)}` : <Skeleton width="77px" height="24px" />}
      <Text fontSize="12px" color="textSubtle">
        {title}
      </Text>
    </Box>
  )
}

export default PodiumText
