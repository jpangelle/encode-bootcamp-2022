// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract Swap {
    address DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address UNISWAP_ADDRESS = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address BINANCE_ACCOUNT = 0xDFd5293D8e347dFe59E90eFd55b2956a1343963d;
    address USDC_ADDRESS = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address BUSD_ADDRESS = 0x4Fabb145d64652a948d72533023f6E7A623C7C53;

    IERC20 dai = IERC20(DAI_ADDRESS);
    IERC20 usdc = IERC20(USDC_ADDRESS);
    IERC20 busd = IERC20(BUSD_ADDRESS);

    ISwapRouter swapRouter = ISwapRouter(UNISWAP_ADDRESS);

    function swapDAIForUSDC(uint256 _amountIn) public {
        TransferHelper.safeTransferFrom(DAI_ADDRESS, msg.sender, address(this), _amountIn);

        TransferHelper.safeApprove(DAI_ADDRESS, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: DAI_ADDRESS,
                tokenOut: USDC_ADDRESS,
                fee: 100,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle(params);
    }

    function swapDAIForBUSD(uint256 _amountIn) public {
        TransferHelper.safeTransferFrom(DAI_ADDRESS, msg.sender, address(this), _amountIn);

        TransferHelper.safeApprove(DAI_ADDRESS, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: DAI_ADDRESS,
                tokenOut: BUSD_ADDRESS,
                fee: 100,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle(params);
    }
}
