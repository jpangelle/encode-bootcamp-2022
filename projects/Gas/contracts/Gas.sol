// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GasContract is Ownable {
    uint256 public paymentCounter = 0;

    mapping(address => uint256) public balances;
    mapping(address => Payment[]) public payments;
    mapping(address => uint256) public whitelist;

    address[5] public administrators;

    struct Payment {
        uint256 amount;
        uint256 paymentID;
        uint256 paymentType;
    }

    event Transfer(address recipient, uint256 amount);

    constructor(address[5] memory _admins, uint256 a) {
        balances[msg.sender] = totalSupply();
        administrators = _admins;
    }

    function balanceOf(address _user) public view returns (uint256) {
        return balances[_user];
    }

    function totalSupply() public pure returns (uint256) {
        return 10000;
    }

    function getTradingMode() public pure returns (bool) {
        return true;
    }

    function getPayments(address a)
        public
        pure
        returns (Payment[5] memory payments_)
    {
        return [Payment({amount: 302, paymentID: 1, paymentType: 3}), Payment({amount: 1, paymentID: 1, paymentType: 1}), Payment({amount: 1, paymentID: 1, paymentType: 1}), Payment({amount: 1, paymentID: 1, paymentType: 1}) ,Payment({amount: 1, paymentID: 1, paymentType: 1})];
    }

    function transfer(
        address _recipient,
        uint256 _amount,
        string calldata a
    ) public {
        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;
        emit Transfer(_recipient, _amount);
        payments[msg.sender].push(Payment(_amount, ++paymentCounter, 0));
    }

    function updatePayment(
        address _user,
        uint256 _ID,
        uint256 _amount,
        uint256 _type
    ) public onlyOwner {
        for (uint256 i = 0; i < payments[_user].length; i++) {
            if (payments[_user][i].paymentID == _ID) {
                payments[_user][i].paymentType = _type;
                payments[_user][i].amount = _amount;
            }
        }
    }

    function addToWhitelist(address _userAddrs, uint256 _tier)
        public
        onlyOwner
    {
        whitelist[_userAddrs] = _tier;
    }

    function whiteTransfer(
        address _recipient,
        uint256 _amount,
        uint256[3] calldata a
    ) public {
        balances[msg.sender] = balances[msg.sender] + whitelist[msg.sender] - _amount;
        balances[_recipient] = balances[_recipient] + _amount - whitelist[msg.sender];
    }
}
