const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const ERC20_ABI = require("./erc20.abi.json");
const UNISWAP_ABI = require("./uniswap.abi.json");
const BUSD_ABI = require("./busd.abi.json");

describe("swap tokens", () => {
  let impersonatedSigner;
  let daiContract;
  let uniswapContract;

  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const UNISWAP_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const BINANCE_ACCOUNT = "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d";
  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const BUSD_ADDRESS = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";

  beforeEach(async () => {
    impersonatedSigner = await ethers.getImpersonatedSigner(BINANCE_ACCOUNT);

    daiContract = new ethers.Contract(
      DAI_ADDRESS,
      ERC20_ABI,
      impersonatedSigner
    );

    uniswapContract = new ethers.Contract(
      UNISWAP_ADDRESS,
      UNISWAP_ABI,
      impersonatedSigner
    );
  });

  it("should swap DAI to USDC", async () => {
    const usdcContract = new ethers.Contract(
      USDC_ADDRESS,
      ERC20_ABI,
      impersonatedSigner
    );

    const daiBeforeSwap = await daiContract.balanceOf(
      impersonatedSigner.address
    );
    const usdcBeforeSwap = await usdcContract.balanceOf(
      impersonatedSigner.address
    );

    expect(daiBeforeSwap.toString()).to.equal("2507986110807060000000000");
    expect(usdcBeforeSwap.toString()).to.equal("58522075070300");

    await daiContract.approve(UNISWAP_ADDRESS, "5000000000000000000", {
      gasLimit: 50000,
    });

    await uniswapContract.exactInputSingle(
      [
        DAI_ADDRESS,
        USDC_ADDRESS,
        100,
        impersonatedSigner.address,
        "1670000000",
        "5000000000000000000",
        0,
        0,
      ],
      { gasLimit: 1000000 }
    );

    const daiAfterSwap = await daiContract.balanceOf(
      impersonatedSigner.address
    );
    const usdcAfterSwap = await usdcContract.balanceOf(
      impersonatedSigner.address
    );

    const expectedUSDCAfterSwap = new BigNumber.from(usdcBeforeSwap)
      .add("5000000")
      .sub("5000000" * "0.0000954");

    const expectedDAIAfterSwap = new BigNumber.from(daiBeforeSwap).sub(
      "5000000000000000000"
    );

    expect(daiAfterSwap).to.deep.equal(expectedDAIAfterSwap);
    expect(usdcAfterSwap).to.deep.equal(expectedUSDCAfterSwap);
  });

  it("should swap DAI to BUSD", async () => {
    const busdContract = new ethers.Contract(
      BUSD_ADDRESS,
      BUSD_ABI,
      impersonatedSigner
    );

    const daiBeforeSwap = await daiContract.balanceOf(
      impersonatedSigner.address
    );
    const busdBeforeSwap = await busdContract.balanceOf(
      impersonatedSigner.address
    );

    expect(daiBeforeSwap.toString()).to.equal("2507981110807060000000000");
    expect(busdBeforeSwap.toString()).to.equal("132341384078412973534474240");

    await daiContract.approve(UNISWAP_ADDRESS, "5000000000000000000", {
      gasLimit: 50000,
    });

    await uniswapContract.exactInputSingle(
      [
        DAI_ADDRESS,
        BUSD_ADDRESS,
        100,
        impersonatedSigner.address,
        "1670000000",
        "5000000000000000000",
        0,
        0,
      ],
      { gasLimit: 1000000 }
    );

    const daiAfterSwap = await daiContract.balanceOf(
      impersonatedSigner.address
    );
    const busdAfterSwap = await busdContract.balanceOf(
      impersonatedSigner.address
    );

    const expectedBUSDAfterSwap = new BigNumber.from(busdBeforeSwap)
      .add("5000000000000000000")
      .sub("5000000000000000000" * "0.0000004696299879888");

    const expectedDAIAfterSwap = new BigNumber.from(daiBeforeSwap).sub(
      "5000000000000000000"
    );

    expect(daiAfterSwap).to.deep.equal(expectedDAIAfterSwap);
    expect(busdAfterSwap).to.deep.equal(expectedBUSDAfterSwap);
  });
});
