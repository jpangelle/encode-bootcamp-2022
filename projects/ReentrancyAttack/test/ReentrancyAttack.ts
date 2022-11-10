import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ReentrancyAttack", function () {
  async function deployReentrancyAttackFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ReentrancyAttack = await ethers.getContractFactory(
      "ReentrancyAttack"
    );
    const reentrancyAttack = await ReentrancyAttack.deploy();

    return { reentrancyAttack, owner, otherAccount };
  }

  it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    const { reentrancyAttack } = await loadFixture(
      deployReentrancyAttackFixture
    );
  });
});
