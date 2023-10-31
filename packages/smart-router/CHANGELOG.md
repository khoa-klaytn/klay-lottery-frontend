# @sweepstakes/smart-router

## 4.9.0

### Minor Changes

- 5b1c68cb6: Default to subgraph cache fallback for v3 candidate pools fetcher
- 435a90ac2: Add support for opBNB mainnet

### Patch Changes

- Updated dependencies [435a90ac2]
  - @sweepstakes/multicall@3.2.0
  - @sweepstakes/sdk@5.6.0
  - @sweepstakes/chains@0.1.0
  - @sweepstakes/tokens@0.5.0
  - @sweepstakes/v3-sdk@3.5.0

## 4.8.8

### Patch Changes

- 1577caa6f: Add default import path for evm

## 4.8.7

### Patch Changes

- 1831356d9: refactor: Move ChainsId usage from Sdk to Chains package
- Updated dependencies [1831356d9]
  - @sweepstakes/sdk@5.5.0
  - @sweepstakes/multicall@3.1.2
  - @sweepstakes/tokens@0.4.4
  - @sweepstakes/v3-sdk@3.4.4

## 4.8.6

### Patch Changes

- e491ed2ba: Fix module not found under nodejs esm resolution

## 4.8.5

### Patch Changes

- 2d7e1b3e2: Upgraded viem
- Updated dependencies [2d7e1b3e2]
  - @sweepstakes/multicall@3.1.1
  - @sweepstakes/sdk@5.4.2
  - @sweepstakes/v3-sdk@3.4.3
  - @sweepstakes/tokens@0.4.3

## 4.8.4

### Patch Changes

- 4cca3f688: Support dropping unexected multicalls
- Updated dependencies [4cca3f688]
  - @sweepstakes/multicall@3.1.0

## 4.8.3

### Patch Changes

- bb83caccc: Accept nullish value to getExecutionPrice function
- Updated dependencies [51b77c787]
  - @sweepstakes/tokens@0.4.2
  - @sweepstakes/v3-sdk@3.4.2
  - @sweepstakes/multicall@3.0.1

## 4.8.2

### Patch Changes

- Updated dependencies [5a9836d39]
  - @sweepstakes/multicall@3.0.1

## 4.8.1

### Patch Changes

- Updated dependencies [8337b09a8]
  - @sweepstakes/multicall@3.0.0

## 4.8.0

### Minor Changes

- a784ca6ed: SweepStakes Multicall release

### Patch Changes

- e4bfa0a15: Add mm route type
- Updated dependencies [a784ca6ed]
  - @sweepstakes/multicall@1.0.0
  - @sweepstakes/tokens@0.4.1
  - @sweepstakes/v3-sdk@3.4.1

## 4.7.1

### Patch Changes

- Updated dependencies [7a0c21e72]
  - @sweepstakes/sdk@5.4.1
  - @sweepstakes/tokens@0.4.1
  - @sweepstakes/v3-sdk@3.4.1

## 4.7.0

### Minor Changes

- 868f4d11f: Add Base support

### Patch Changes

- Updated dependencies [868f4d11f]
  - @sweepstakes/sdk@5.4.0
  - @sweepstakes/tokens@0.4.0
  - @sweepstakes/v3-sdk@3.4.0

## 4.6.0

### Minor Changes

- 24f51d314: Customizable v2 pool provider

## 4.5.2

### Patch Changes

- e9c080787: Export provider functions

## 4.5.1

### Patch Changes

- Updated dependencies [d0f9b28a9]
  - @sweepstakes/tokens@0.3.1
  - @sweepstakes/v3-sdk@3.3.1

## 4.5.0

### Minor Changes

- 659be0529: Add support for building v3 pool fetcher with customized fallbacks and source of pool tvl references

## 4.4.0

### Minor Changes

- 5e15c611e: Add linea support

### Patch Changes

- Updated dependencies [5e15c611e]
  - @sweepstakes/sdk@5.3.0
  - @sweepstakes/tokens@0.3.0
  - @sweepstakes/v3-sdk@3.3.0

## 4.3.6

### Patch Changes

- @sweepstakes/tokens@0.2.3
- @sweepstakes/v3-sdk@3.2.3

## 4.3.5

### Patch Changes

- 726a09484: Export types from Transformer

## 4.3.4

### Patch Changes

- 51b7b1ceb: Export transformer utils

## 4.3.3

### Patch Changes

- Updated dependencies [e0a681bc6]
  - @sweepstakes/tokens@0.2.2
  - @sweepstakes/v3-sdk@3.2.2

## 4.3.2

### Patch Changes

- 640c171aa: Prevent zero liquidity pools from being ignored

## 4.3.1

### Patch Changes

- Updated dependencies [3ba496cb1]
  - @sweepstakes/sdk@5.2.1
  - @sweepstakes/tokens@0.2.1
  - @sweepstakes/v3-sdk@3.2.1

## 4.3.0

### Minor Changes

- 77fc3406a: Add zkSync support

### Patch Changes

- Updated dependencies [77fc3406a]
  - @sweepstakes/sdk@5.2.0
  - @sweepstakes/tokens@0.2.0
  - @sweepstakes/v3-sdk@3.2.0

## 4.2.1

### Patch Changes

- Updated dependencies [500adb4f8]
  - @sweepstakes/tokens@0.1.6
  - @sweepstakes/v3-sdk@3.1.1

## 4.2.0

### Minor Changes

- 8217b73c3: Add fallback configuration to v3 candidate pool fetcher

## 4.1.0

### Minor Changes

- f9fda4ebe: Add Polygon zkEVM support

### Patch Changes

- Updated dependencies [f9fda4ebe]
  - @sweepstakes/sdk@5.1.0
  - @sweepstakes/v3-sdk@3.1.0
  - @sweepstakes/tokens@0.1.5

## 4.0.1

### Patch Changes

- @sweepstakes/tokens@0.1.4
- @sweepstakes/v3-sdk@3.0.1

## 4.0.0

### Major Changes

- 938aa75f5: Migrate ethers to viem

### Patch Changes

- Updated dependencies [e8a1a97a3]
- Updated dependencies [938aa75f5]
  - @sweepstakes/v3-sdk@3.0.0
  - @sweepstakes/sdk@5.0.0
  - @sweepstakes/tokens@0.1.3

## 3.0.0

### Major Changes

- b5dbd2921: Remove JSBI and use BigInt native instead

### Patch Changes

- Updated dependencies [b5dbd2921]
  - @sweepstakes/sdk@4.0.0
  - @sweepstakes/swap-sdk-core@1.0.0
  - @sweepstakes/v3-sdk@2.0.0
  - @sweepstakes/multicall@2.0.0
  - @sweepstakes/tokens@0.1.2

## 2.0.3

### Patch Changes

- 8daeddeae: Remove used typechain and install error on postinstall

## 2.0.2

### Patch Changes

- 078ee23fb: Fix multicall chunk config types

## 2.0.1

### Patch Changes

- 91af69fa2: Allow multicall config pass into quote provider

## 2.0.0

### Major Changes

- dd6cecab1: Move to viem

## 1.0.0

### Minor Changes

- 65fbb250a: Bump version

### Patch Changes

- Updated dependencies [65fbb250a]
- Updated dependencies [65fbb250a]
  - @sweepstakes/v3-sdk@1.0.0
  - @sweepstakes/multicall@1.0.0
  - @sweepstakes/sdk@3.2.0
  - @sweepstakes/tokens@0.1.0

## 0.6.1

### Patch Changes

- d83530d6b: Remove duplicate isTradeBetter util
- Updated dependencies [d83530d6b]
  - @sweepstakes/sdk@3.1.3

## 0.6.0

### Minor Changes

- e63258cf9: Add swap output amount estimation

## 0.5.0

### Minor Changes

- e11c44d86: Add stable swap lp token mint estimation

## 0.4.0

### Minor Changes

- 7be222310: Add price & fee percent to stable swap pairs

## 0.3.0

### Minor Changes

- 34edbd929: Allow to get all common pairs externally

## 0.2.1

### Patch Changes

- 1e4a4b27c: Fix missing dependencies
- Updated dependencies [1e4a4b27c]
  - @sweepstakes/multicall@0.0.2

## 0.2.0

### Minor Changes

- 8090f268a: Add route type to identify if a trade contains stable swap

## 0.1.0

### Minor Changes

- ca9723195: Add support for exact output
