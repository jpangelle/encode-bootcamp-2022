import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      },
    },
    goerli: {
      url: process.env.ENCODE_INFURA_ENDPOINT_GOERLI,
      accounts: [process.env.ENCODE_PRIVATE_KEY],
    },
  },
  solidity: "0.8.10",
  etherscan: {
    apiKey: process.env.ENCODE_ETHERSCAN_API_KEY,
  },
};

export default config;
