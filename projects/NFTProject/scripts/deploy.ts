import { ethers } from "hardhat";

async function main() {
  const VolcanoNFT = await ethers.getContractFactory("VolcanoNFT");
  const volcanoNFT = await VolcanoNFT.deploy();

  await volcanoNFT.deployed();

  console.log(`Deployed to ${volcanoNFT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
