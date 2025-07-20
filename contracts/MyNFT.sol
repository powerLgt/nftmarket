// SPDX-License-Identifier: MIT 
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {

    uint256 private _currentTokenId = 0;

    constructor () ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function mint(address to) public onlyOwner {
        uint256 tokenId = ++_currentTokenId;
        _mint(to, tokenId);
    }

    function currentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }
}