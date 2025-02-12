# 🥞 Klay Lottery Frontend

<p align="center">
  <a href="https://sweepstakes.finance">
      <img src="https://sweepstakes.finance/logo.png" height="128">
  </a>
</p>

This project contains the main features of the pancake application.

If you want to contribute, please refer to the [contributing guidelines](./CONTRIBUTING.md) of this project.

## Documentation

- [Cypress tests](doc/Cypress.md)

> Install dependencies using [pnpm](https://pnpm.io)

## `apps/web`

<details>
<summary>
Config
</summary>

| Config               | Location                                                                                           |
|----------------------|----------------------------------------------------------------------------------------------------|
| SSLottery address    | [constants/contracts.ts @default.SSLottery](apps/web/src/config/constants/contracts.ts?plain=1#L5) |
| SSLottery ABI        | [abi/SSLottery.ts @default](apps/web/src/config/abi/SSLottery.ts?plain=1#L1)                       |
| Lottery subgraph url | [constants/endpoints.ts @GRAPH_API_LOTTERY](apps/web/src/config/constants/endpoints.ts?plain=1#L5) |

</details>

<details>
<summary>
How to start
</summary>

```sh
pnpm i
```

start the development server

```sh
pnpm dev
```

build with production mode

```sh
pnpm build

# start the application after build
pnpm start
```

</details>

## Packages

| Package                                    | Description                                                                                                 |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [sdk](/packages/swap-sdk)                  | An SDK for building applications                                                                            |
| [aptos-swap-sdk](/packages/aptos-swap-sdk) | Aptos version of Swap SDK                                                                                   |
| [swap-sdk-core](/packages/swap-sdk-core)   | Swap SDK Shared code                                                                                        |
| [wagmi](/packages/wagmi)                   | Extension for [wagmi](https://github.com/wagmi-dev/wagmi), including bsc chain and binance wallet connector |
| [awgmi](/packages/awgmi)                   | Connect to Aptos with similar wagmi React hooks.                                                            |
