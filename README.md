Perfect Bhargav! Here is your **final copy-paste ready** `README.md` file for your NFT Marketplace — all in one page and without screenshots:

---

```markdown
# 🖼️ NFT Marketplace

A decentralized NFT Marketplace built using **Solidity**, **React**, and **Truffle**. This dApp allows users to mint their own NFTs, list them for sale, view owned NFTs, and purchase NFTs from others — all on a local blockchain.

---

## 🚀 Features

- Mint NFTs with custom metadata URI
- List NFTs for sale on a marketplace
- Buy NFTs listed by others
- View NFTs owned by the current user
- Interact with deployed smart contracts on Ganache (localhost)

---

## 🧱 Tech Stack

- **Frontend:** React.js, React-Bootstrap, React Router
- **Blockchain:** Solidity, Truffle, Ganache
- **Libraries:** Web3.js, OpenZeppelin Contracts

---



---

## 🔐 Smart Contracts Overview

### 🧩 `NFT.sol`

- Extends `ERC721URIStorage` from OpenZeppelin
- Public function to mint new NFTs with token URI

```solidity
function createNFT(string memory tokenURI) public returns (uint256);
````

### 🧩 `Marketplace.sol`

* Lists NFTs for sale and handles purchases
* Transfers NFT ownership on purchase
* Allows user to retrieve their owned NFTs

```solidity
function createMarketItem(address nftContract, uint32 tokenId, uint128 price) public payable;
function purchaseMarketItem(uint32 itemId) public payable;
function getUserNFTs(address user) public view returns (MarketItem[] memory);
```

---

## ⚙️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nft-marketplace.git
cd nft-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Ganache (Local Blockchain)

Make sure Ganache is running at:

```
http://127.0.0.1:7545
```

### 4. Compile and Deploy Contracts

```bash
truffle compile
truffle migrate --reset
```

### 5. Start the React App

```bash
npm start
```

---

## 📜 License

MIT License

---

## 🙋‍♂️ Author

**Bhargav Nandan Chaturvedi**

```

