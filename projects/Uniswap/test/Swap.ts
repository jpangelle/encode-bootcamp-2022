import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import erc20ABI from "./erc20.abi.json";

const BINANCE_ACCOUNT = "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const BUSD_ADDRESS = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";

const getERC20Contract = (
  contractAddress: string,
  signer?: SignerWithAddress
) => new ethers.Contract(contractAddress, erc20ABI, signer || ethers.provider);

const approveERC20Tokens = async (
  signer: SignerWithAddress,
  spender: string,
  contractAddress: string,
  amount: BigNumber
) => {
  const erc20Contract = getERC20Contract(contractAddress, signer);

  await erc20Contract.approve(spender, amount, { gasLimit: 1000000 });
};

const deployUniswapFixture = async () => {
  const owner = await ethers.getSigners();
  const impersonatedSigner = await ethers.getImpersonatedSigner(
    BINANCE_ACCOUNT
  );

  const SwapFactory = await ethers.getContractFactory("Swap");
  const Swap = await SwapFactory.deploy();

  return {
    Swap,
    owner,
    impersonatedSigner,
  };
};

it("should swap DAI to USDC", async () => {
  const { Swap, impersonatedSigner } = await loadFixture(deployUniswapFixture);

  const daiContract = getERC20Contract(DAI_ADDRESS, impersonatedSigner);
  const usdcContract = getERC20Contract(USDC_ADDRESS, impersonatedSigner);

  const daiBeforeSwap = await daiContract.balanceOf(impersonatedSigner.address);

  const usdcBeforeSwap = await usdcContract.balanceOf(
    impersonatedSigner.address
  );

  expect(daiBeforeSwap.toString()).to.equal("2507986110807060000000000");
  expect(usdcBeforeSwap.toString()).to.equal("58522075070300");

  const amountIn = BigNumber.from("5000000000000000000");

  await approveERC20Tokens(
    impersonatedSigner,
    Swap.address,
    DAI_ADDRESS,
    amountIn
  );

  await Swap.connect(impersonatedSigner).swapDAIForUSDC(amountIn, {
    gasLimit: 1000000,
  });

  const daiAfterSwap = await daiContract.balanceOf(impersonatedSigner.address);
  const usdcAfterSwap = await usdcContract.balanceOf(
    impersonatedSigner.address
  );

  const expectedUSDCAfterSwap = BigNumber.from(usdcBeforeSwap)
    .add("5000000")
    .sub(BigNumber.from("5000000").mul(954).div(10000000));

  const expectedDAIAfterSwap = BigNumber.from(daiBeforeSwap).sub(
    "5000000000000000000"
  );

  expect(daiAfterSwap).to.deep.equal(expectedDAIAfterSwap);
  expect(usdcAfterSwap).to.deep.equal(expectedUSDCAfterSwap);
});

it("should swap DAI to BUSD", async () => {
  const { Swap, impersonatedSigner } = await loadFixture(deployUniswapFixture);

  const daiContract = getERC20Contract(DAI_ADDRESS, impersonatedSigner);
  const busdContract = getERC20Contract(BUSD_ADDRESS, impersonatedSigner);

  const daiBeforeSwap = await daiContract.balanceOf(impersonatedSigner.address);

  const busdBeforeSwap = await busdContract.balanceOf(
    impersonatedSigner.address
  );

  expect(daiBeforeSwap.toString()).to.equal("2507986110807060000000000");
  expect(busdBeforeSwap.toString()).to.equal("132341384078412973534474240");

  const amountIn = BigNumber.from("5000000000000000000");

  await approveERC20Tokens(
    impersonatedSigner,
    Swap.address,
    DAI_ADDRESS,
    amountIn
  );

  await Swap.connect(impersonatedSigner).swapDAIForBUSD(amountIn, {
    gasLimit: 1000000,
  });

  const daiAfterSwap = await daiContract.balanceOf(impersonatedSigner.address);
  const busdAfterSwap = await busdContract.balanceOf(
    impersonatedSigner.address
  );

  const expectedBUSDAfterSwap = BigNumber.from(busdBeforeSwap)
    .add("5000000000000000000")
    .sub(
      BigNumber.from("5000000000000000000")
        .mul(BigNumber.from("4696299879888"))
        .div(BigNumber.from("10000000000000000000"))
    );

  const expectedDAIAfterSwap = BigNumber.from(daiBeforeSwap).sub(
    "5000000000000000000"
  );

  expect(daiAfterSwap).to.deep.equal(expectedDAIAfterSwap);
  expect(busdAfterSwap).to.deep.equal(expectedBUSDAfterSwap);
});
