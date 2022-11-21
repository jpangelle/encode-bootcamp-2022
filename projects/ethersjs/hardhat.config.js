/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_ENDPOINT,
        blockNumber: 16021186,
      },
    },
  },
};
