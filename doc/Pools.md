# Pools documentation

## How to add a new pool

- Add an entry in `apps/web/src/config/constants/pools.tsx`, below the pool with the id 0
- Insert informations, with the contract address and the correct tokens (See [Tokens](./Tokens.md))
- Run `pnpm test:config` to make sure the data you set in the config match the data on chain

Pools APRs depend on farm data to compute prices
