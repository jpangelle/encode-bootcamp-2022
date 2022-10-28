// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is Ownable {
    uint256 totalSupply = 10000;

    event SupplyIncrease(uint256 newTotalSupply);
    event TokenTransfer(address recipientAddress, uint256 transferAmount);

    mapping(address => uint256) public TokenMap;
    mapping(address => Payment[]) TransferMap;

    struct Payment {
        address recipientAddress;
        uint256 transferAmount;
    }

    constructor() {
        TokenMap[owner()] = totalSupply;
    }


    function getSupply() public view returns (uint256) {
        return totalSupply;
    }

    function increaseSupply() public onlyOwner {
        totalSupply = totalSupply + 1000;
        emit SupplyIncrease(totalSupply);
    }

    function getAddressBalance(address _address ) public view returns (uint256) {
        return TokenMap[_address];
    }

    function recordTransfer(address _senderAddress, address _recipientAddress, uint256 _amount) internal {
        TransferMap[_senderAddress].push(Payment(_recipientAddress, _amount));
    }

    function transfer(address _address, uint256 _amount) public {
        TokenMap[msg.sender] -= _amount;
        TokenMap[_address] += _amount;
        emit TokenTransfer(_address, _amount);
        recordTransfer(msg.sender, _address, _amount);
    }

    function getUserTransfers(address _address) public view returns(Payment[] memory) {
        return TransferMap[_address];
    }
}