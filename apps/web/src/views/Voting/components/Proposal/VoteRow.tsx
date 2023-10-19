import { Flex, LinkExternal, Text, ScanLink } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { getBlockExploreLink } from 'utils'
import { Vote } from 'state/types'
import { IPFS_GATEWAY } from '../../config'
import TextEllipsis from '../TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
  isVoter: boolean
}

const VoteRow: React.FC<React.PropsWithChildren<VoteRowProps>> = ({ vote }) => {
  const hasVotingPower = !!vote.metadata?.votingPower

  const votingPower = hasVotingPower
    ? parseFloat(vote.metadata.votingPower).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : '--'

  return (
    <Row>
      <AddressColumn>
        <Flex alignItems="center">
          <ScanLink useBscCoinFallback href={getBlockExploreLink(vote.voter, 'address')}>
            {truncateHash(vote.voter)}
          </ScanLink>
        </Flex>
      </AddressColumn>
      <ChoiceColumn>
        <TextEllipsis title={vote.proposal.choices[vote.choice - 1]}>
          {vote.proposal.choices[vote.choice - 1]}
        </TextEllipsis>
      </ChoiceColumn>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={vote.metadata.votingPower}>{votingPower}</Text>
          {hasVotingPower && <LinkExternal href={`${IPFS_GATEWAY}/${vote.id}`} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  )
}

export default VoteRow
