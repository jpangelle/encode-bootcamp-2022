import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.ENCODE_INFURA_ENDPOINT_GOERLI);

const config: HardhatUserConfig = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
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
