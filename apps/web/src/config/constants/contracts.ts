import { ChainId } from '@sweepstakes/chains'
import { DEPLOYER_ADDRESSES } from '@sweepstakes/v3-sdk'
import { V3_QUOTER_ADDRESSES } from '@sweepstakes/smart-router/evm'
import type { Address } from 'viem'

export default {
  masterChef: {
    [ChainId.BSC_TESTNET]: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
    [ChainId.BSC]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
  },
  masterChefV1: {
    [ChainId.BSC_TESTNET]: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
    [ChainId.BSC]: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
  },
  sousChef: {
    [ChainId.BSC_TESTNET]: '0xD3af5Fe61DBaF8f73149bfcFa9FB653ff096029A',
    [ChainId.BSC]: '0x6Ab8463a4185b80905E05A9ff80A2d6b714B9e95',
  },
  klayLottery: {
    [ChainId.KLAYTN_TESTNET]: '0x31C7E1DF0d4be713eb005595D88dA094b282a132',
    [ChainId.KLAYTN]: '0x', // TODO: deploy to mainnet
  },
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.GOERLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ZKSYNC_TESTNET]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    [ChainId.ZKSYNC]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    [ChainId.ARBITRUM_ONE]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ARBITRUM_GOERLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON_ZKEVM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON_ZKEVM_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.OPBNB]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.OPBNB_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BASE_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.SCROLL_SEPOLIA]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  pancakeProfile: {
    [ChainId.BSC]: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    [ChainId.BSC_TESTNET]: '0x4B683C7E13B6d5D7fd1FeA9530F451954c1A7c8A',
  },
  pancakeBunnies: {
    [ChainId.BSC]: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
    [ChainId.BSC_TESTNET]: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
  },
  bunnyFactory: {
    [ChainId.BSC]: '0xfa249Caa1D16f75fa159F7DFBAc0cC5EaB48CeFf',
    [ChainId.BSC_TESTNET]: '0x707CBF373175fdB601D34eeBF2Cf665d08f01148',
  },
  claimRefund: {
    [ChainId.BSC]: '0xE7e53A7e9E3Cf6b840f167eF69519175c497e149',
    [ChainId.BSC_TESTNET]: '0x',
  },
  pointCenterIfo: {
    [ChainId.BSC]: '0x3C6919b132462C1FEc572c6300E83191f4F0012a',
    [ChainId.BSC_TESTNET]: '0xd2Ac1B1728Bb1C11ae02AB6e75B76Ae41A2997e3',
  },
  bunnySpecial: {
    [ChainId.BSC]: '0xFee8A195570a18461146F401d6033f5ab3380849',
    [ChainId.BSC_TESTNET]: '0x7b7b1583De1DeB32Ce6605F6deEbF24A0671c17C',
  },
  tradingCompetitionEaster: {
    [ChainId.BSC]: '0xd718baa0B1F4f70dcC8458154042120FFE0DEFFA',
    [ChainId.BSC_TESTNET]: '0xC787F45B833721ED3aC46E99b703B3E1E01abb97',
  },
  tradingCompetitionFanToken: {
    [ChainId.BSC]: '0xA8FECf847e28aa1Df39E995a45b7FCfb91b676d4',
    [ChainId.BSC_TESTNET]: '0x',
  },
  tradingCompetitionMobox: {
    [ChainId.BSC]: '0x1C5161CdB145dE35a8961F82b065fd1F75C3BaDf',
    [ChainId.BSC_TESTNET]: '0x',
  },
  tradingCompetitionMoD: {
    [ChainId.BSC]: '0xbDd9a61c67ee16c10f5E37b1D0c907a9EC959f33',
    [ChainId.BSC_TESTNET]: '0x',
  },
  easterNft: {
    [ChainId.BSC]: '0x23c41D28A239dDCAABd1bb1deF8d057189510066',
    [ChainId.BSC_TESTNET]: '0x24ec6962dbe874F6B67B5C50857565667fA0854F',
  },
  cakeVault: {
    [ChainId.BSC]: '0x45c54210128a065de780C4B0Df3d16664f7f859e',
    [ChainId.BSC_TESTNET]: '0x1088Fb24053F03802F673b84d16AE1A7023E400b',
  },
  cakeFlexibleSideVault: {
    [ChainId.BSC]: '0x615e896A8C2CA8470A2e9dc2E9552998f8658Ea0',
    [ChainId.BSC_TESTNET]: '0x1088Fb24053F03802F673b84d16AE1A7023E400b',
  },
  chainlinkOracleBNB: {
    [ChainId.BSC]: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    [ChainId.BSC_TESTNET]: '0x',
  },
  oraklKlayUsd: {
    [ChainId.KLAYTN]: '0x33D6ee12D4ADE244100F09b280e159659fe0ACE0',
    [ChainId.KLAYTN_TESTNET]: '0xC874f389A3F49C5331490145f77c4eFE202d72E1',
  },
  bunnySpecialCakeVault: {
    [ChainId.BSC]: '0x5B4a770Abe7Eafb2601CA4dF9d73EA99363E60a4',
    [ChainId.BSC_TESTNET]: '0x',
  },
  bunnySpecialLottery: {
    [ChainId.BSC]: '0x24ED31d31C5868e5a96aA77fdcB890f3511fa0b2',
    [ChainId.BSC_TESTNET]: '0x382cB497110F398F0f152cae82821476AE51c9cF',
  },
  bunnySpecialXmas: {
    [ChainId.BSC]: '0x59EdDF3c21509dA3b0aCCd7c5ccc596d930f4783',
    [ChainId.BSC_TESTNET]: '0x',
  },
  nftMarket: {
    [ChainId.BSC]: '0x17539cCa21C7933Df5c980172d22659B8C345C5A',
    [ChainId.BSC_TESTNET]: '0x7F9F37Ddcaa33893F9bEB3D8748c8D6BfbDE6AB2',
  },
  nftSale: {
    [ChainId.BSC]: '0x29fE7148636b7Ae0b1E53777b28dfbaA9327af8E',
    [ChainId.BSC_TESTNET]: '0xe486De509c5381cbdBF3e71F57D7F1f7570f5c46',
  },
  zap: {
    [ChainId.BSC]: '0xD4c4a7C55c9f7B3c48bafb6E8643Ba79F42418dF',
    [ChainId.BSC_TESTNET]: '0xD85835207054F25620109bdc745EC1D1f84F04e1',
  },
  stableSwapNativeHelper: {
    [ChainId.BSC]: '0x52E5D1e24A4308ef1A221C949cb2F7cbbAFEE090',
    [ChainId.BSC_TESTNET]: '0x6e4B1D7C65E86f1723720a5fE8993f0908108b64',
  },
  iCake: {
    [ChainId.BSC]: '0x3C458828D1622F5f4d526eb0d24Da8C4Eb8F07b1',
    [ChainId.BSC_TESTNET]: '0x',
  },
  nonBscVault: {
    [ChainId.ETHEREUM]: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
    [ChainId.GOERLI]: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
  },
  mmLinkedPool: {
    [ChainId.ETHEREUM]: '0x9Ca2A439810524250E543BA8fB6E88578aF242BC',
    [ChainId.GOERLI]: '0x7bb894Ca487568dD55054193c3238d7B1f46BB92',
    [ChainId.BSC]: '0xfEACb05b373f1A08E68235bA7FC92636b92ced01',
  },
  tradingReward: {
    [ChainId.ETHEREUM]: '0x',
    [ChainId.BSC]: '0xa842a4AD40FEbbd034fbeF25C7a880464a90e695',
    [ChainId.BSC_TESTNET]: '0x',
  },
  nftPositionManager: {
    [ChainId.ETHEREUM]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.GOERLI]: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
    [ChainId.BSC]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.BSC_TESTNET]: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
    [ChainId.ZKSYNC_TESTNET]: '0xF84697CfE7c88F846e4ba5dAe14A6A8f67deF5c2',
    [ChainId.ZKSYNC]: '0xa815e2eD7f7d5B0c49fda367F249232a1B9D2883',
    [ChainId.POLYGON_ZKEVM]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.POLYGON_ZKEVM_TESTNET]: '0x1f489dd5B559E976AE74303F939Cfd0aF1b62C2B',
    [ChainId.ARBITRUM_ONE]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.LINEA]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.LINEA_TESTNET]: '0xacFa791C833120c769Fd3066c940B7D30Cd8BC73',
    [ChainId.ARBITRUM_GOERLI]: '0xb10120961f7504766976A89E29802Fa00553da5b',
    [ChainId.OPBNB]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.OPBNB_TESTNET]: '0x9d4277f1D41CCB30C0e91f7d1bBA2A739E19032C',
    [ChainId.BASE]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    [ChainId.BASE_TESTNET]: '0x0F81fD8DaC20A21029B496D8F8E08385201B8ca0',
    [ChainId.SCROLL_SEPOLIA]: '0x0F81fD8DaC20A21029B496D8F8E08385201B8ca0',
  },
  v3PoolDeployer: DEPLOYER_ADDRESSES,
  quoter: V3_QUOTER_ADDRESSES,
  v3Airdrop: {
    [ChainId.ETHEREUM]: '0x',
    [ChainId.BSC]: '0xe934d2C5bE5db0295A4de3177762A9E8c74Ae4f4',
    [ChainId.BSC_TESTNET]: '0x',
  },
  tradingRewardTopTrades: {
    [ChainId.ETHEREUM]: '0x',
    [ChainId.BSC]: '0x41920b6A17CB73D1B60f4F41D82c35eD0a46fD71',
    [ChainId.BSC_TESTNET]: '0x',
  },
  vCake: {
    [ChainId.ETHEREUM]: '0x',
    [ChainId.BSC]: '0xa3b8321173Cf3DdF37Ce3e7548203Fc25d86402F',
    [ChainId.BSC_TESTNET]: '0x5DD37E97716A8b358BCbc731516F36FFff978454',
  },
  revenueSharingPool: {
    [ChainId.ETHEREUM]: '0x',
    [ChainId.BSC]: '0xCD5d1935e9bfa4905f9f007C97aB1f1763dC1607',
    [ChainId.BSC_TESTNET]: '0xd2d1DD41700d9132d3286e0FcD8D6E1D8E5052F5',
  },
  anniversaryAchievement: {
    [ChainId.BSC]: '0x0a073aa17275ef839ee77BC6c589D9E661270480',
    [ChainId.BSC_TESTNET]: '0x',
  },
  fixedStaking: {
    [ChainId.ETHEREUM]: '0x',
    [ChainId.BSC]: '0xC0E92c9B437734a0c0e0466F76cDf71c5478b0AB',
    [ChainId.BSC_TESTNET]: '0x',
  },
} as const satisfies Record<string, Record<number, Address>>
