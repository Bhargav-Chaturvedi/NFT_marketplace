// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

    constructor() Ownable(msg.sender) {}

    function createMarketItem(
        address nftContract,
        uint32 tokenId,
        uint128 price
    ) external {
        require(price > 0, "Price must be at least 1 wei");

        unchecked {
            itemCounter++;
        }

        uint32 itemId = itemCounter;
        marketItems[itemId] = MarketItem({
            itemId: itemId,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: payable(msg.sender),
            owner: payable(address(0)),
            price: price,
            sold: false
        });

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

    function purchaseMarketItem(uint32 itemId) external payable {
        MarketItem storage item = marketItems[itemId];
        uint128 price = item.price;
        require(msg.value == price, "Incorrect price");
        require(!item.sold, "Already sold");

        item.sold = true;
        item.owner = payable(msg.sender);

        // Transfer funds and NFT
        item.seller.transfer(price);
        IERC721(item.nftContract).transferFrom(address(this), msg.sender, item.tokenId);
    }

    function getUserNFTs(address user) external view returns (MarketItem[] memory) {
        uint32 totalItems = itemCounter;
        uint32 count;
        for (uint32 i = 1; i <= totalItems; i++) {
            if (marketItems[i].owner == user) count++;
        }

        MarketItem[] memory userItems = new MarketItem[](count);
        uint32 j;
        for (uint32 i = 1; i <= totalItems; i++) {
            if (marketItems[i].owner == user) {
                userItems[j++] = marketItems[i];
            }
        }

        return userItems;
    }
}
