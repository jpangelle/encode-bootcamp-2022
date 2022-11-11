import { ethers } from "hardhat";

async function main() {
  const gwei = ethers.utils.parseEther("0.000000001");

  const ReentrancyAttack = await ethers.getContractFactory("ReentrancyAttack");
  const reentrancyAttack = await ReentrancyAttack.deploy({
    value: gwei,
  });

  await reentrancyAttack.deployed();

  console.log(`deployed to ${reentrancyAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
