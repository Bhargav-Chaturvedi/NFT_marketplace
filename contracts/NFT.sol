// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    event NFTCreated(uint256 indexed tokenId, string tokenURI, address owner);

    constructor() ERC721("NewCoin", "NC") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function createNFT(string memory tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit NFTCreated(newItemId, tokenURI, msg.sender);
        tokenCounter += 1;
        return newItemId;
    }
}
//Address :  0x7fD0Ad98F9773928E7c8Ce5C423BCB296ddF1fFf