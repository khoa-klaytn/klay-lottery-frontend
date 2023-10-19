import { getPoolApr } from 'utils/apr'
import { vi } from 'vitest'

vi.mock('../../config/constants/lpAprs/56.json', async () => {
  const actual = await vi.importActual('../../config/constants/lpAprs/56.json')
  // @ts-ignore
  return {
    default: {
      // @ts-ignore
      ...actual.default,
      '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0': 10.5,
    },
  }
})

describe('getPoolApr', () => {
  it(`returns null when parameters are missing`, () => {
    const apr = getPoolApr(null, null, null, null)
    expect(apr).toBeNull()
  })
  it(`returns null when APR is infinite`, () => {
    const apr = getPoolApr(0, 0, 0, 0)
    expect(apr).toBeNull()
  })
  it(`get the correct pool APR`, () => {
    const apr = getPoolApr(10, 1, 100000, 1)
    expect(apr).toEqual(1051.2)
  })
})
