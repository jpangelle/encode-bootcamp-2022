import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VolcanoNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVolcanoNFTFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, ...addresses] = await ethers.getSigners();

    const VolcanoNFT = await ethers.getContractFactory("VolcanoNFT");
    const volcanoNFT = await VolcanoNFT.deploy();

    return { volcanoNFT, owner, addresses };
  }

  it("should mint NFT", async function () {
    const { addresses, volcanoNFT } = await loadFixture(
      deployVolcanoNFTFixture
    );

    const tokenId = 1;

    expect(
      await volcanoNFT.mintNFT(
        addresses[0].address,
        tokenId,
        `https://dummyjson.com/products/${tokenId}`,
        { value: ethers.utils.parseEther("0.01") }
      )
    );
  });

  it("should transfer NFT", async function () {
    const { addresses, volcanoNFT } = await loadFixture(
      deployVolcanoNFTFixture
    );

    const tokenId = 1;

    expect(
      await volcanoNFT.mintNFT(
        addresses[0].address,
        tokenId,
        `https://dummyjson.com/products/${tokenId}`,
        { value: ethers.utils.parseEther("0.01") }
      )
    );
    expect(
      await volcanoNFT
        .connect(addresses[0])
        ["safeTransferFrom(address,address,uint256)"](
          addresses[0].address,
          addresses[1].address,
          tokenId
        )
    );
  });
});
