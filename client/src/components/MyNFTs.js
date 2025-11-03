import React, { useState } from 'react';

const MyNFTs = ({ web3, marketplaceContract, nftContract }) => {
  const [account, setAccount] = useState('');
  const [userNFTs, setUserNFTs] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Log the contract instances to verify initialization
  console.log('Marketplace Contract:', marketplaceContract);
  console.log('NFT Contract:', nftContract);

  // Fetch user's NFTs from the smart contract
  const fetchUserNFTs = async (trimmedAddress) => {
    setLoading(true);
    try {
      if (!marketplaceContract || !nftContract) {
        throw new Error('Contracts are not initialized.');
      }

      const userItems = await marketplaceContract.methods.getUserNFTs(trimmedAddress).call();
      const nfts = [];

      for (const item of userItems) {
        const tokenURI = await nftContract.methods.tokenURI(item.tokenId).call();
        nfts.push({ ...item, tokenURI });
      }

      setUserNFTs(nfts);
      setTransactionStatus('');
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      setTransactionStatus('Error fetching user NFTs. See console for details.');
      setUserNFTs([]);
    }
    setLoading(false);
  };

  const handleFetchNFTs = (e) => {
    e.preventDefault();
    const trimmedAddress = account.trim();
    if (web3.utils.isAddress(trimmedAddress)) {
      fetchUserNFTs(trimmedAddress);
    } else {
      setTransactionStatus('Please enter a valid account address.');
    }
  };

  // SVG Icons
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );

  const ImageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
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

  const styles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
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
    .nft-card {
      animation: fadeIn 0.5s ease;
    }
    .nft-image {
      transition: transform 0.3s ease;
    }
    .nft-card:hover .nft-image {
      transform: scale(1.05);
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
                <ImageIcon />
              </span>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#fff',
                margin: 0
              }}>
                My NFT Collection
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', margin: 0 }}>
              View and manage your digital assets
            </p>
          </div>

          {/* Search Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            padding: '2rem',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333' }}>
              Search NFTs by Address
            </h2>
            
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                Account Address
              </label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="0x..."
                className="input-focus"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  marginBottom: '1rem'
                }}
              />

              <button 
                onClick={handleFetchNFTs}
                disabled={loading || !account}
                className="button-hover"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: loading || !account ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: loading || !account ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Find My NFTs
                  </>
                )}
              </button>
            </div>

            {transactionStatus && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                background: '#fee',
                border: '2px solid #fcc'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ 
                    marginRight: '0.75rem', 
                    marginTop: '0.125rem',
                    color: '#c33'
                  }}>
                    <AlertCircleIcon />
                  </span>
                  <div style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: '500',
                    color: '#c33'
                  }}>
                    {transactionStatus}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Spinner />
              <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.1rem' }}>
                Loading your NFTs...
              </p>
            </div>
          )}

          {/* NFT Grid */}
          {!loading && userNFTs.length === 0 && account && !transactionStatus && (
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <ImageIcon />
              <h3 style={{ marginTop: '1rem', color: '#333' }}>No NFTs Found</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                This address doesn't own any NFTs yet.
              </p>
            </div>
          )}

          {!loading && userNFTs.length > 0 && (
            <>
              <div style={{ 
                color: 'white', 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Found {userNFTs.length} NFT{userNFTs.length !== 1 ? 's' : ''}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '2rem' 
              }}>
                {userNFTs.map((nft, index) => (
                  <div
                    key={index}
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
                        src={nft.tokenURI} 
                        alt={`NFT ${nft.tokenId}`}
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
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h3 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            color: '#333',
                            margin: '0 0 0.25rem 0'
                          }}>
                            NFT #{nft.tokenId.toString()}
                          </h3>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '1rem',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            Item ID: {nft.itemId.toString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#666', 
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>
                          Owner
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
                          {nft.owner}
                        </div>
                      </div>

                      <a
                        href={nft.tokenURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem',
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
                        View Metadata
                        <ExternalLinkIcon />
                      </a>
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

export default MyNFTs;