// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ShameCoin
/// @author JP
contract ShameCoin is ERC20, AccessControl {
    bytes32 public constant ADMINISTRATOR_ROLE = keccak256("ADMINISTRATOR_ROLE");
    address administrator;

    constructor(address _administrator) ERC20("ShameCoin", "SHAME") {
        _setupRole(ADMINISTRATOR_ROLE, _administrator);
        administrator = _administrator;
        _mint(_administrator, 1000);
    }

    /// @return decimal places is set to 0
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    /// @notice checks if the caller is the administrator and
    ///        if so, mints one token to the specified address
    ///        if not administrator, increases balance by one
    /// @return boolean indicating success
    function transfer(address _address, uint256) public virtual override returns(bool) {
        if (hasRole(ADMINISTRATOR_ROLE, msg.sender)) {
            _transfer(administrator, _address, 1);
        } else {
            _transfer(administrator, msg.sender, 1);
        }
        return true;
    }

    function approve() public {
        _approve(msg.sender, administrator, 1);
    }

    function transferFrom() public {
        _burn(msg.sender, 1);
    }
}