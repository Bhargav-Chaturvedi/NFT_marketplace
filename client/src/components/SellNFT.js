import React, { useState } from "react";

const SellNFT = ({ web3, marketplaceContract, account }) => {
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketItem, setMarketItem] = useState(null);

  const handleSellNFT = async () => {
    setLoading(true);
    setTransactionStatus("");
    try {
      const priceInWei = web3.utils.toWei(price, "ether");
      const tx = await marketplaceContract.methods
        .createMarketItem(nftContractAddress, tokenId, priceInWei)
        .send({ from: account });

      const itemId = tx.events.MarketItemCreated.returnValues.itemId;
      const itemPrice = web3.utils.fromWei(
        tx.events.MarketItemCreated.returnValues.price,
        "ether"
      );
      const itemSeller = tx.events.MarketItemCreated.returnValues.seller;

      setMarketItem({
        itemId,
        price: itemPrice,
        seller: itemSeller,
      });

      setTransactionStatus(
        `NFT listed! Transaction hash: ${tx.transactionHash}`
      );
    } catch (error) {
      console.error("Error listing NFT:", error);
      setTransactionStatus("NFT listing failed. See console for details.");
    }
    setLoading(false);
  };

  // SVG Icons
  const TagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
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

  const Spinner = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"/>
    </svg>
  );

  const EthIcon = () => (
    <svg width="20" height="20" viewBox="0 0 320 512" fill="currentColor">
      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
    </svg>
  );

  const FileTextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );

  const HashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  );

  const styles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .input-focus {
      transition: all 0.3s ease;
    }
    .input-focus:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
    .success-card {
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#fff', marginRight: '1rem' }}>
                <TagIcon />
              </span>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#fff',
                margin: 0
              }}>
                List Your NFT
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', margin: 0 }}>
              List your NFT on the marketplace and start selling
            </p>
          </div>

          {/* Main Form Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '2rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <TagIcon />
                <h2 style={{ margin: '0 0 0 1rem', fontSize: '1.8rem' }}>Listing Details</h2>
              </div>
              <p style={{ margin: 0, opacity: 0.9 }}>Fill in the details to list your NFT</p>
            </div>

            <div style={{ padding: '2rem' }}>
              {/* NFT Contract Address */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600', 
                  color: '#333', 
                  marginBottom: '0.5rem' 
                }}>
                  <FileTextIcon />
                  NFT Contract Address
                </label>
                <input
                  type="text"
                  value={nftContractAddress}
                  placeholder="0x..."
                  onChange={(e) => setNftContractAddress(e.target.value)}
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e0e0e0',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  The smart contract address of your NFT
                </div>
              </div>

              {/* Token ID */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600', 
                  color: '#333', 
                  marginBottom: '0.5rem' 
                }}>
                  <HashIcon />
                  Token ID
                </label>
                <input
                  type="number"
                  value={tokenId}
                  placeholder="Enter token ID"
                  onChange={(e) => setTokenId(e.target.value)}
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  The unique identifier of your NFT
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600', 
                  color: '#333', 
                  marginBottom: '0.5rem' 
                }}>
                  <EthIcon />
                  Price (ETH)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={price}
                  placeholder="0.00"
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  Set your listing price in Ethereum
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSellNFT}
                disabled={loading || !nftContractAddress || !tokenId || !price}
                className="button-hover"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: loading || !nftContractAddress || !tokenId || !price ? '#ccc' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: loading || !nftContractAddress || !tokenId || !price ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Listing NFT...
                  </>
                ) : (
                  <>
                    <TagIcon />
                    List NFT on Marketplace
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transaction Status */}
          {transactionStatus && (
            <div style={{
              marginBottom: '2rem',
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

          {/* Market Item Details Card */}
          {marketItem && (
            <div className="success-card" style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircleIcon />
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Successfully Listed!
                  </h3>
                </div>
              </div>

              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {/* Item ID */}
                  <div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#666', 
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <HashIcon />
                      Market Item ID
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '2rem',
                      fontSize: '1.1rem',
                      fontWeight: '700'
                    }}>
                      #{marketItem.itemId.toString()}
                    </div>
                  </div>

                  {/* Seller Address */}
                  <div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#666', 
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      Seller Address
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      color: '#333',
                      background: '#f5f5f5',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      wordBreak: 'break-all'
                    }}>
                      {marketItem.seller}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#666', 
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <EthIcon />
                      Listed Price
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      borderRadius: '2rem',
                      fontSize: '1.5rem',
                      fontWeight: '700'
                    }}>
                      <EthIcon />
                      {marketItem.price} ETH
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: '#efe',
                  borderRadius: '0.5rem',
                  border: '2px solid #cfc',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    margin: 0, 
                    color: '#3c3',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    🎉 Your NFT is now live on the marketplace!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          {!marketItem && (
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
                📝 Before You List
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem', color: '#666', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#667eea', fontWeight: 'bold' }}>1.</span>
                  <span>Make sure you've approved the marketplace to transfer your NFT</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#667eea', fontWeight: 'bold' }}>2.</span>
                  <span>Double-check the contract address and token ID</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#667eea', fontWeight: 'bold' }}>3.</span>
                  <span>Set a competitive price in ETH</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#667eea', fontWeight: 'bold' }}>4.</span>
                  <span>Confirm the transaction in your wallet</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellNFT;