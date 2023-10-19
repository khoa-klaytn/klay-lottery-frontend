export const klayLotteryABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_randomGeneratorAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'min',
        type: 'uint256',
      },
    ],
    name: 'DiscountDivisorLow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EndTimePast',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FinalNumberNotDrawn',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'sending',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'demanding',
        type: 'uint256',
      },
    ],
    name: 'InsufficientFunds',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LotteryNotClaimable',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LotteryNotClose',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LotteryNotOpen',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LotteryNotOver',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LotteryOver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'PortionsExceed10000',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SendFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TicketIdInvalid',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TicketNotYours',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'number',
        type: 'uint32',
      },
    ],
    name: 'TicketNumberInvalid',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'min',
        type: 'uint256',
      },
    ],
    name: 'TicketPriceLow',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AdminTokenRecovery',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'firstTicketIdNextLottery',
        type: 'uint256',
      },
    ],
    name: 'LotteryClose',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'injectedAmount',
        type: 'uint256',
      },
    ],
    name: 'LotteryInjection',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'finalNumber',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'countWinningTickets',
        type: 'uint256',
      },
    ],
    name: 'LotteryNumberDrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'priceTicket',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'firstTicketId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'injectedAmount',
        type: 'uint256',
      },
    ],
    name: 'LotteryOpen',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'injector',
        type: 'address',
      },
    ],
    name: 'NewOperatorAndInjectorAddresses',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'randomGenerator',
        type: 'address',
      },
    ],
    name: 'NewRandomGenerator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numberTickets',
        type: 'uint256',
      },
    ],
    name: 'TicketsClaim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numberTickets',
        type: 'uint256',
      },
    ],
    name: 'TicketsPurchase',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: 'MIN_DISCOUNT_DIVISOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint32[]',
        name: '_ticketNumbers',
        type: 'uint32[]',
      },
    ],
    name: 'buyTickets',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_numberTickets',
        type: 'uint256',
      },
    ],
    name: 'calculateCurrentTotalPriceForBulkTickets',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_discountDivisor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_priceTicket',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_numberTickets',
        type: 'uint256',
      },
    ],
    name: 'calculateTotalPriceForBulkTickets',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_randomGeneratorAddress',
        type: 'address',
      },
    ],
    name: 'changeRandomGenerator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_ticketIds',
        type: 'uint256[]',
      },
    ],
    name: 'claimTickets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'closeLottery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentLotteryId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentTicketId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_autoInjection',
        type: 'bool',
      },
    ],
    name: 'drawFinalNumberAndMakeLotteryClaimable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'forceCloseLottery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'injectFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'injectorAddress',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxNumberTicketsPerBuyOrClaim',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minPriceTicket',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'operatorAddress',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingInjectionNextLottery',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'randomGenerator',
    outputs: [
      {
        internalType: 'contract IRandomNumberGenerator',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'recoverWrongTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_autoInjection',
        type: 'bool',
      },
      {
        internalType: 'uint32',
        name: '_finalNumber',
        type: 'uint32',
      },
    ],
    name: 'setFinalNumberAndMakeLotteryClaimable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxNumberTicketsPerBuy',
        type: 'uint256',
      },
    ],
    name: 'setMaxNumberTicketsPerBuy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minPriceTicket',
        type: 'uint256',
      },
    ],
    name: 'setMinTicketPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_operatorAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_injectorAddress',
        type: 'address',
      },
    ],
    name: 'setOperatorAndInjectorAddresses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_endTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_priceTicket',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_discountDivisor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_winnersPortion',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_burnPortion',
        type: 'uint256',
      },
      {
        internalType: 'uint256[6]',
        name: '_rewardPortions',
        type: 'uint256[6]',
      },
    ],
    name: 'startLottery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'viewLotteries',
    outputs: [
      {
        components: [
          {
            internalType: 'enum IndexedKlayLottery.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'priceTicket',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'discountDivisor',
            type: 'uint256',
          },
          {
            internalType: 'uint256[6]',
            name: 'rewardPortions',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256',
            name: 'winnersPortion',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'burnPortion',
            type: 'uint256',
          },
          {
            internalType: 'uint256[6]',
            name: 'rewardPerUserPerBracket',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256[6]',
            name: 'countWinnersPerBracket',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256',
            name: 'firstTicketId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'firstTicketIdNextLottery',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountCollected',
            type: 'uint256',
          },
          {
            internalType: 'uint32',
            name: 'finalNumber',
            type: 'uint32',
          },
        ],
        internalType: 'struct IndexedKlayLottery.Lottery[]',
        name: 'lotteries',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'viewLottery',
    outputs: [
      {
        components: [
          {
            internalType: 'enum IndexedKlayLottery.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'priceTicket',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'discountDivisor',
            type: 'uint256',
          },
          {
            internalType: 'uint256[6]',
            name: 'rewardPortions',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256',
            name: 'winnersPortion',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'burnPortion',
            type: 'uint256',
          },
          {
            internalType: 'uint256[6]',
            name: 'rewardPerUserPerBracket',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256[6]',
            name: 'countWinnersPerBracket',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256',
            name: 'firstTicketId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'firstTicketIdNextLottery',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountCollected',
            type: 'uint256',
          },
          {
            internalType: 'uint32',
            name: 'finalNumber',
            type: 'uint32',
          },
        ],
        internalType: 'struct IndexedKlayLottery.Lottery',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: 'ticketNumber',
        type: 'uint32',
      },
    ],
    name: 'viewNumberTickets',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_ticketIds',
        type: 'uint256[]',
      },
    ],
    name: 'viewNumbersAndStatusesForTicketIds',
    outputs: [
      {
        internalType: 'uint32[]',
        name: '',
        type: 'uint32[]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketId',
        type: 'uint256',
      },
    ],
    name: 'viewRewardsForTicketId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'viewTickets',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'number',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        internalType: 'struct IndexedKlayLottery.Ticket[]',
        name: 'tickets',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_cursor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_size',
        type: 'uint256',
      },
    ],
    name: 'viewUserInfoForLotteryId',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint32[]',
        name: '',
        type: 'uint32[]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
    ],
    name: 'viewUserTicketIds',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
