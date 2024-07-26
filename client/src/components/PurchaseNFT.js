import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

// Define or import the ERC721 ABI
const ERC721_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const PurchaseNFT = ({ web3, marketplaceContract, account }) => {
  const [marketItems, setMarketItems] = useState([]);
  const [loadingItem, setLoadingItem] = useState({}); // Track loading state for each item
  const [transactionStatus, setTransactionStatus] = useState('');
  const [purchasedItem, setPurchasedItem] = useState(null);

  // Fetch market items from the smart contract
  const fetchMarketItems = async () => {
    try {
      const itemCount = await marketplaceContract.methods.itemCounter().call();
      const items = [];
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplaceContract.methods.marketItems(i).call();
        if (!item.sold) { // Only show items that are not sold
          items.push(item);
        }
      }
      setMarketItems(items);
    } catch (error) {
      console.error('Error fetching market items:', error);
    }
  };

  // Fetch market items when the component mounts or transactionStatus changes
  useEffect(() => {
    fetchMarketItems();
  }, [marketplaceContract, transactionStatus]);

  const handlePurchase = async (itemId, price) => {
    setLoadingItem(prevState => ({ ...prevState, [itemId]: true })); // Set loading for the specific item
    try {
      const priceInWei = web3.utils.toWei(price, 'ether');
      const tx = await marketplaceContract.methods.purchaseMarketItem(itemId).send({ from: account, value: priceInWei });

      // Get the updated item info
      const purchasedItem = await marketplaceContract.methods.marketItems(itemId).call();

      // Assuming you have the NFT contract address stored in the item
      const nftContractAddress = purchasedItem.nftContract;

      // Create an instance of the NFT contract
      const nftContract = new web3.eth.Contract(ERC721_ABI, nftContractAddress);
      
      // Fetch tokenURI using the tokenId
      const tokenURI = await nftContract.methods.tokenURI(purchasedItem.tokenId).call();

      setPurchasedItem({
        ...purchasedItem,
        buyer: account,
        price: web3.utils.fromWei(purchasedItem.price, 'ether'),
        tokenURI,
      });
      console.log("NFT URL:", tokenURI);
      setTransactionStatus(`NFT purchased successfully! Transaction hash: ${tx.transactionHash}`);

      // Refresh the list after purchase
      fetchMarketItems();

      // Hide purchased item after 4 seconds
      setTimeout(() => {
        setPurchasedItem(null);
      }, 7000);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      setTransactionStatus('Purchase failed. See console for details.');
    }
    setLoadingItem(prevState => ({ ...prevState, [itemId]: false })); // Clear loading for the specific item
  };

  return (
    <div className="container">
      <h1>Purchase NFTs</h1>
      <div className="row">
        {marketItems.length === 0 ? (
          <p>No NFTs available for purchase.</p>
        ) : (
          marketItems.map((item) => (
            <div key={item.itemId} className="col-md-4 mb-4">
              <div className="card" style={{ border: "2px solid #3498db", borderRadius: "10px", padding: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
                <img src={item.tokenURI} alt={`NFT ${item.itemId}`} className="card-img-top" style={{ borderRadius: "10px" }} />
                <div className="card-body">
                  <h5 className="card-title">Item ID: {item.itemId.toString()}</h5>
                  <p className="card-text">Price: {web3.utils.fromWei(item.price, 'ether')} ETH</p>
                  <p className="card-text">Seller: {item.seller}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handlePurchase(item.itemId, web3.utils.fromWei(item.price, 'ether'))}
                    disabled={loadingItem[item.itemId]} // Disable the button if loading for this item
                  >
                    {loadingItem[item.itemId] ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {transactionStatus && (
        <Alert
          className="mt-3"
          variant={transactionStatus.includes('failed') ? 'danger' : 'success'}
        >
          {transactionStatus}
        </Alert>
      )}
      {purchasedItem && (
        <Alert className="mt-3" variant="success">
          <p><strong>Buyer:</strong> {purchasedItem.buyer}</p>
          <p><strong>NFT URL:</strong> <a href={purchasedItem.tokenURI} target="_blank" rel="noopener noreferrer">{purchasedItem.tokenURI}</a></p>
          <p><strong>Item ID:</strong> {purchasedItem.itemId.toString()}</p>
        </Alert>
      )}
    </div>
  );
};

export default PurchaseNFT;
