// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract VolcanoNFT is ERC721 {
    constructor() ERC721("Volcano", "VOL") {}

    function mintNFT(address to, uint256 tokenId, string memory tokenURI) public payable {
        require(msg.value >= 0.01 ether, "Not enough ETH");
        _safeMint(to, tokenId, abi.encodePacked(tokenURI));
    }
}
