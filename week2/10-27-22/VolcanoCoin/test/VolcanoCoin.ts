import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VolcanoCoin", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVolcanoCoinFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();

    return { volcanoCoin, owner, otherAccount };
  }

  it("should have initial total supply of 10000", async function () {
    const { volcanoCoin } = await loadFixture(deployVolcanoCoinFixture);

    expect(await volcanoCoin.getSupply()).to.equal(10000);
  });

  it("should increment by 1000 each time supply is increased", async function () {
    const { volcanoCoin } = await loadFixture(deployVolcanoCoinFixture);

    expect(await volcanoCoin.getSupply()).to.equal(10000);
    await volcanoCoin.increaseSupply();
    expect(await volcanoCoin.getSupply()).to.equal(11000);
  });

  it("only allow onwer to increase supply", async function () {
    const { volcanoCoin, otherAccount } = await loadFixture(
      deployVolcanoCoinFixture
    );

    await expect(
      volcanoCoin.connect(otherAccount).increaseSupply()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
