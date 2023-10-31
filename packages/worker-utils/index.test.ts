import { describe, it, expect } from 'vitest'
import { CORS_ALLOW, isOriginAllowed } from './index'

describe('worker-utils', () => {
  it.each([
    ['https://sweepstakes.finance', true],
    ['https://sweepstakes.com', true],
    ['https://aptossweepstakes.finance', false],
    ['https://aptos.sweepstakes.finance', true],
    ['https://sweepstakes.finance.com', false],
    ['http://sweepstakes.finance', false],
    ['https://pancake.run', false],
    ['https://test.pancake.run', true],
    ['http://localhost:3000', true],
    ['http://localhost:3001', true],
  ])(`isOriginAllowed(%s)`, (origin, expected) => {
    expect(isOriginAllowed(origin, CORS_ALLOW)).toBe(expected)
  })
})
