import React, { useEffect, useState } from 'react';

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
  const [loadingItem, setLoadingItem] = useState({});
  const [transactionStatus, setTransactionStatus] = useState('');
  const [purchasedItem, setPurchasedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch market items from the smart contract
const fetchMarketItems = async () => {
  setLoading(true);
  try {
    const itemCount = await marketplaceContract.methods.itemCounter().call();
    const items = [];

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplaceContract.methods.marketItems(i).call();
      if (!item.sold) {
        const nftContract = new web3.eth.Contract(ERC721_ABI, item.nftContract);
        const tokenURI = await nftContract.methods.tokenURI(item.tokenId).call();
        items.push({
          ...item,
          tokenURI,
        });
      }
    }
    setMarketItems(items);
  } catch (error) {
    console.error('Error fetching market items:', error);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchMarketItems();
  }, [marketplaceContract, transactionStatus]);

  const handlePurchase = async (itemId, price) => {
    setLoadingItem(prevState => ({ ...prevState, [itemId]: true }));
    setTransactionStatus('');
    try {
      const priceInWei = web3.utils.toWei(price, 'ether');
      const tx = await marketplaceContract.methods.purchaseMarketItem(itemId).send({ from: account, value: priceInWei });

      const purchasedItem = await marketplaceContract.methods.marketItems(itemId).call();
      const nftContractAddress = purchasedItem.nftContract;
      const nftContract = new web3.eth.Contract(ERC721_ABI, nftContractAddress);
      const tokenURI = await nftContract.methods.tokenURI(purchasedItem.tokenId).call();

      setPurchasedItem({
        ...purchasedItem,
        buyer: account,
        price: web3.utils.fromWei(purchasedItem.price, 'ether'),
        tokenURI,
      });
      console.log("NFT URL:", tokenURI);
      setTransactionStatus(`NFT purchased successfully! Transaction hash: ${tx.transactionHash}`);

      fetchMarketItems();

      setTimeout(() => {
        setPurchasedItem(null);
      }, 4000);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      setTransactionStatus('Purchase failed. See console for details.');
    }
    setLoadingItem(prevState => ({ ...prevState, [itemId]: false }));
  };

  // SVG Icons
  const ShoppingBagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  const AlertCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );

  const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );

  const Spinner = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"/>
    </svg>
  );

  const EthIcon = () => (
    <svg width="16" height="16" viewBox="0 0 320 512" fill="currentColor">
      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
    </svg>
  );

  const styles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    .nft-card {
      animation: fadeIn 0.5s ease;
    }
    .nft-image {
      transition: transform 0.3s ease;
    }
    .card-hover:hover .nft-image {
      transform: scale(1.05);
    }
    .button-hover {
      transition: transform 0.2s ease;
    }
    .button-hover:hover:not(:disabled) {
      transform: scale(1.02);
    }
    .button-hover:active:not(:disabled) {
      transform: scale(0.98);
    }
    .success-alert {
      animation: slideIn 0.5s ease;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '3rem 1rem',
        paddingBottom: '4rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#fff', marginRight: '1rem' }}>
                <ShoppingBagIcon />
              </span>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#fff',
                margin: 0
              }}>
                NFT Marketplace
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', margin: 0 }}>
              Discover and purchase unique digital assets
            </p>
          </div>

          {/* Transaction Status */}
          {transactionStatus && (
            <div className="success-alert" style={{
              maxWidth: '800px',
              margin: '0 auto 2rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              background: transactionStatus.includes('failed') ? '#fee' : '#efe',
              border: `2px solid ${transactionStatus.includes('failed') ? '#fcc' : '#cfc'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  marginRight: '0.75rem', 
                  marginTop: '0.125rem',
                  color: transactionStatus.includes('failed') ? '#c33' : '#3c3'
                }}>
                  {transactionStatus.includes('failed') ? <AlertCircleIcon /> : <CheckCircleIcon />}
                </span>
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '500',
                  color: transactionStatus.includes('failed') ? '#c33' : '#3c3'
                }}>
                  {transactionStatus}
                </div>
              </div>
            </div>
          )}

          {/* Purchased Item Details */}
          {purchasedItem && (
            <div className="success-alert" style={{
              maxWidth: '800px',
              margin: '0 auto 2rem',
              padding: '1.5rem',
              borderRadius: '1rem',
              background: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #efe'
              }}>
                <CheckCircleIcon />
                <h3 style={{ margin: 0, color: '#3c3', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  Purchase Successful!
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>
                    Buyer Address
                  </span>
                  <div style={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#333',
                    background: '#f5f5f5',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    wordBreak: 'break-all'
                  }}>
                    {purchasedItem.buyer}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>
                    Item ID
                  </span>
                  <div style={{ fontSize: '0.95rem', color: '#333', fontWeight: '600' }}>
                    #{purchasedItem.itemId.toString()}
                  </div>
                </div>
                <div>
                  <a
                    href={purchasedItem.tokenURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    View NFT Metadata
                    <ExternalLinkIcon />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Spinner />
              <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.1rem' }}>
                Loading marketplace...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && marketItems.length === 0 && (
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <ShoppingBagIcon />
              <h3 style={{ marginTop: '1rem', color: '#333' }}>No NFTs Available</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Check back later for new listings!
              </p>
            </div>
          )}

          {/* NFT Grid */}
          {!loading && marketItems.length > 0 && (
            <>
              <div style={{ 
                color: 'white', 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {marketItems.length} NFT{marketItems.length !== 1 ? 's' : ''} Available for Purchase
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '2rem' 
              }}>
                {marketItems.map((item, index) => (
                  <div
                    key={item.itemId}
                    className="card-hover nft-card"
                    style={{
                      background: 'white',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {/* NFT Image */}
                    <div style={{ 
                      width: '100%', 
                      height: '320px', 
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      position: 'relative'
                    }}>
                      <img 
                        src={item.tokenURI} 
                        alt={`NFT ${item.itemId}`}
                        className="nft-image"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
                              <div style="text-align: center;">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21 15 16 10 5 21"/>
                                </svg>
                                <p style="margin-top: 1rem; font-size: 0.9rem;">Image Not Available</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>

                    {/* NFT Details */}
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: '#333',
                          margin: '0 0 0.5rem 0'
                        }}>
                          NFT #{item.itemId.toString()}
                        </h3>
                        
                        {/* Price Badge */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: '2rem',
                          fontSize: '1.1rem',
                          fontWeight: '700'
                        }}>
                          <EthIcon />
                          {web3.utils.fromWei(item.price, 'ether')} ETH
                        </div>
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#666', 
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>
                          Seller
                        </div>
                        <div style={{ 
                          fontSize: '0.85rem',
                          fontFamily: 'monospace',
                          color: '#333',
                          background: '#f5f5f5',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          wordBreak: 'break-all'
                        }}>
                          {item.seller}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(item.itemId, web3.utils.fromWei(item.price, 'ether'))}
                        disabled={loadingItem[item.itemId]}
                        className="button-hover"
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          background: loadingItem[item.itemId] ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '1rem',
                          cursor: loadingItem[item.itemId] ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {loadingItem[item.itemId] ? (
                          <>
                            <Spinner />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingBagIcon />
                            Purchase Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseNFT;