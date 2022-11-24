// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "https://github.com/Arachnid/solidity-stringutils/blob/master/src/strings.sol";

contract VolcanoCoin is Ownable {
    using strings for *;

    uint256 totalSupply = 10000;
    bool public paused;

    event SupplyIncrease(uint256 newTotalSupply);
    event TokenTransfer(address recipientAddress, uint256 transferAmount);

    mapping(address => uint256) public TokenMap;
    mapping(address => Payment[]) TransferMap;

    struct Payment {
        address recipientAddress;
        uint256 transferAmount;
    }

    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    constructor() {
        TokenMap[owner()] = totalSupply;
    }

    function setPaused(bool _paused) public onlyOwner whenNotPaused {
        paused = _paused;
    }

    function getSupply() public view whenNotPaused returns (uint256) {
        return totalSupply;
    }

    function increaseSupply() public onlyOwner whenNotPaused {
        totalSupply = totalSupply + 1000;
        emit SupplyIncrease(totalSupply);
    }

    function getAddressBalance(address _address ) public view whenNotPaused returns (uint256) {
        return TokenMap[_address];
    }

    function recordTransfer(address _senderAddress, address _recipientAddress, uint256 _amount) internal whenNotPaused {
        TransferMap[_senderAddress].push(Payment(_recipientAddress, _amount));
    }

    function transfer(address _address, uint256 _amount) public whenNotPaused {
        TokenMap[msg.sender] -= _amount;
        TokenMap[_address] += _amount;
        emit TokenTransfer(_address, _amount);
        recordTransfer(msg.sender, _address, _amount);
    }

    function getUserTransfers(address _address) public view whenNotPaused returns(Payment[] memory) {
        return TransferMap[_address];
    }

    function concatString(string memory _string) public {
        return _string.toSlice().concat("from ETH Denver".toSlice());
    }
}