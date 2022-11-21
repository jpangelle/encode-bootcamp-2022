const { ethers } = require("hardhat");
const { expect } = require("chai");
const erc20ABI = require("./erc20.abi.json");
const uniswapABI = require("./uniswap.abi.json");

it("should swap DAI to USDC and DAI to BUSD", async function () {
  const impersonatedSigner = await ethers.getImpersonatedSigner(
    "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d"
  );

  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const busdAddress = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
  const uniswapAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  const daiContract = new ethers.Contract(
    daiAddress,
    erc20ABI,
    impersonatedSigner
  );

  const usdcContract = new ethers.Contract(
    usdcAddress,
    erc20ABI,
    impersonatedSigner
  );

  const busdContract = new ethers.Contract(
    busdAddress,
    erc20ABI,
    impersonatedSigner
  );

  const uniswapContract = new ethers.Contract(
    uniswapAddress,
    uniswapABI,
    impersonatedSigner
  );

  const dai1 = await daiContract.balanceOf(impersonatedSigner.address);
  const usdc1 = await usdcContract.balanceOf(impersonatedSigner.address);

  expect(dai1.toString()).to.equal("2507986110807060000000000");
  expect(usdc1.toString()).to.equal("58522075070300");

  await daiContract.approve(uniswapAddress, 100000, {
    gasLimit: 100000,
  });

  await uniswapContract.exactInputSingle(
    [
      daiAddress,
      usdcAddress,
      3000,
      impersonatedSigner.address,
      1700000000,
      50000,
      0,
      0,
    ],
    { gasLimit: 10000000 }
  );

  const dai2 = await daiContract.balanceOf(impersonatedSigner.address);
  const usdc2 = await usdcContract.balanceOf(impersonatedSigner.address);

  expect(dai2.toString()).to.equal("2507986110807059999950000");
  expect(usdc2.toString()).to.equal("58522075020300");

  const busd1 = await busdContract.balanceOf(impersonatedSigner.address);

  expect(busd1.toString()).to.equal("132341384078412973534474240");

  await uniswapContract.exactInputSingle(
    [
      daiAddress,
      busdAddress,
      3000,
      impersonatedSigner.address,
      1700000000,
      50000,
      0,
      0,
    ],
    { gasLimit: 30000000 }
  );

  const dai3 = await daiContract.balanceOf(impersonatedSigner.address);
  const busd2 = await busdContract.balanceOf(impersonatedSigner.address);

  expect(dai3.toString()).to.equal("2507986110807059999900000");
  expect(busd2.toString()).to.equal("132341384078412973534524240");
});
