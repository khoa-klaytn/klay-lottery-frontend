import BigNumber from "bignumber.js";
import type {
  PoolCategory,
  PoolConfigBaseProps,
  SerializedPoolConfig,
  DeserializedPoolConfig,
  DeserializedPool,
  DeserializedLockedVaultUser,
  SerializedVaultFees,
  DeserializedVaultFees,
  DeserializedVaultUser,
} from "@sweepstakes/pools";

export {
  PoolCategory,
  PoolConfigBaseProps,
  SerializedPoolConfig,
  DeserializedPoolConfig,
  DeserializedPool,
  DeserializedLockedVaultUser,
  SerializedVaultFees,
  DeserializedVaultFees,
  DeserializedVaultUser,
};

export interface HarvestActionsProps {
  earnings: BigNumber;
  isLoading?: boolean;
  onPresentCollect: any;
  earningTokenPrice: number;
  earningTokenBalance: number;
  earningTokenDollarBalance: number;
}
