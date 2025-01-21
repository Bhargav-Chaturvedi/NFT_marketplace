// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
    struct MarketItem {
        uint32 itemId;
        address nftContract;
        uint32 tokenId;
        address payable seller;
        address payable owner;
        uint128 price;
        bool sold;
    }

    uint32 public itemCounter;
    mapping(uint32 => MarketItem) public marketItems;

    event MarketItemCreated(
        uint32 indexed itemId,
        address indexed nftContract,
        uint32 indexed tokenId,
        address seller,
        address owner,
        uint128 price,
        bool sold
    );

    constructor() Ownable() {}

    function createMarketItem(
        address nftContract,
        uint32 tokenId,
        uint128 price
    ) public payable {
        require(price > 0, "Price must be at least 1 wei");

        itemCounter += 1;
        uint32 itemId = itemCounter;

        marketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function purchaseMarketItem(uint32 itemId) public payable {
        MarketItem storage item = marketItems[itemId];
        require(msg.value == item.price, "Please submit the asking price");

        item.seller.transfer(msg.value);
        IERC721(item.nftContract).transferFrom(address(this), msg.sender, item.tokenId);
        item.owner = payable(msg.sender);
        item.sold = true;
    }

    function getUserNFTs(address user) public view returns (MarketItem[] memory) {
        uint32 itemCount = itemCounter;
        uint32 userItemCount = 0;
        uint32 currentIndex = 0;

        // Count the number of NFTs owned by the user
        for (uint32 i = 1; i <= itemCount; i++) {
            if (marketItems[i].owner == user) {
                userItemCount += 1;
            }
        }

        // Create an array to hold the user's NFTs
        MarketItem[] memory userItems = new MarketItem[](userItemCount);

        // Populate the array with the user's NFTs
        for (uint32 i = 1; i <= itemCount; i++) {
            if (marketItems[i].owner == user) {
                userItems[currentIndex] = marketItems[i];
                currentIndex += 1;
            }
        }

        return userItems;
    }
}
