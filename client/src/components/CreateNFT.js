import React, { useState } from "react";

const CreateNFT = ({ web3, nftContract, marketplaceContract, account }) => {
  const [tokenURI, setTokenURI] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [approvalTokenId, setApprovalTokenId] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'tx') {
        setCopiedTx(true);
        setTimeout(() => setCopiedTx(false), 2000);
      } else {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const useTokenIdInApproval = () => {
    setApprovalTokenId(tokenId);
  };

  const handleCreateNFT = async () => {
    setLoadingCreate(true);
    setTransactionStatus("");
    setTokenId("");
    setTransactionHash("");
    try {
      const tx = await nftContract.methods
        .createNFT(tokenURI)
        .send({ from: account });
      console.log("Transaction receipt:", tx);
      
      setTransactionHash(tx.transactionHash);
      
      if (tx.events && tx.events.NFTCreated) {
        const newTokenId = tx.events.NFTCreated.returnValues.tokenId;
        setTokenId(newTokenId);
        setTransactionStatus("NFT created successfully!");
      } else {
        setTransactionStatus("NFT created successfully!");
      }
    } catch (error) {
      console.error("Error creating NFT:", error);
      setTransactionStatus("NFT creation failed. See console for details.");
    }
    setLoadingCreate(false);
  };

  const handleApprove = async () => {
    setLoadingApprove(true);
    setApprovalStatus("");
    try {
      console.log(
        `Approving NFT with token ID ${approvalTokenId} to address ${toAddress} from account ${account}`
      );

      const trimmedAddress = toAddress.trim();
      console.log("Trimmed To Address:", trimmedAddress);

      if (!web3.utils.isAddress(trimmedAddress)) {
        throw new Error("Invalid address");
      }

      if (approvalTokenId === "" || isNaN(approvalTokenId) || approvalTokenId < 0) {
        throw new Error("Invalid token ID");
      }

      const tx = await nftContract.methods
        .approve(trimmedAddress, approvalTokenId)
        .send({ from: account });
      console.log("Transaction receipt:", tx);
      setApprovalStatus(
        `Approval successful! Transaction hash: ${tx.transactionHash}`
      );
    } catch (error) {
      console.error("Error approving NFT:", error);
      setApprovalStatus("Approval failed. See console for details.");
    }
    setLoadingApprove(false);
  };

  // SVG Icons
  const SparklesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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

  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );

  const Spinner = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"/>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );

  const styles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
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
    .copy-button {
      transition: all 0.2s ease;
    }
    .copy-button:hover {
      background: rgba(102, 126, 234, 0.2);
    }
    .copy-button:active {
      transform: scale(0.95);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '3rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#fff', marginRight: '1rem' }}>
                <SparklesIcon />
              </span>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#fff',
                margin: 0
              }}>
                NFT Management Studio
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', margin: 0 }}>
              Create and manage your digital assets with ease
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {/* Create NFT Card */}
            <div className="card-hover" style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '2rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <SparklesIcon />
                  <h2 style={{ margin: '0 0 0 1rem', fontSize: '1.8rem' }}>Create NFT</h2>
                </div>
                <p style={{ margin: 0, opacity: 0.9 }}>Mint your unique digital asset</p>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Token URI
                  </label>
                  <input
                    type="text"
                    value={tokenURI}
                    placeholder="ipfs://your-metadata-hash"
                    onChange={(e) => setTokenURI(e.target.value)}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #e0e0e0',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    Enter the IPFS URI for your NFT metadata
                  </div>
                </div>

                <button 
                  onClick={handleCreateNFT}
                  disabled={loadingCreate || !tokenURI}
                  className="button-hover"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: loadingCreate || !tokenURI ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: loadingCreate || !tokenURI ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loadingCreate ? (
                    <>
                      <Spinner />
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Create NFT
                    </>
                  )}
                </button>

                {transactionStatus && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    background: transactionStatus.includes("failed") ? '#fee' : '#efe',
                    border: `2px solid ${transactionStatus.includes("failed") ? '#fcc' : '#cfc'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ 
                        marginRight: '0.75rem', 
                        marginTop: '0.125rem',
                        color: transactionStatus.includes("failed") ? '#c33' : '#3c3'
                      }}>
                        {transactionStatus.includes("failed") ? <AlertCircleIcon /> : <CheckCircleIcon />}
                      </span>
                      <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        color: transactionStatus.includes("failed") ? '#c33' : '#3c3'
                      }}>
                        {transactionStatus}
                      </div>
                    </div>
                    
                    {tokenId && (
                      <>
                        {/* Token ID */}
                        <div style={{
                          marginBottom: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '0.5rem',
                          border: '2px solid #ddd'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <strong style={{ fontSize: '0.85rem', color: '#666' }}>Token ID</strong>
                            <button
                              onClick={() => copyToClipboard(tokenId.toString(), 'token')}
                              className="copy-button"
                              style={{
                                background: copiedToken ? '#4ade80' : 'rgba(102, 126, 234, 0.1)',
                                border: 'none',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: copiedToken ? '#166534' : '#667eea'
                              }}
                            >
                              {copiedToken ? (
                                <>
                                  <CheckCircleIcon />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <CopyIcon />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <div style={{ 
                            fontFamily: 'monospace',
                            fontSize: '1.1rem',
                            color: '#667eea',
                            fontWeight: '700',
                            wordBreak: 'break-all'
                          }}>
                            {tokenId.toString()}
                          </div>
                        </div>

                        {/* Transaction Hash */}
                        {transactionHash && (
                          <div style={{
                            marginBottom: '0.75rem',
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            border: '2px solid #ddd'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              marginBottom: '0.5rem'
                            }}>
                              <strong style={{ fontSize: '0.85rem', color: '#666' }}>Transaction Hash</strong>
                              <button
                                onClick={() => copyToClipboard(transactionHash, 'tx')}
                                className="copy-button"
                                style={{
                                  background: copiedTx ? '#4ade80' : 'rgba(102, 126, 234, 0.1)',
                                  border: 'none',
                                  padding: '0.4rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  color: copiedTx ? '#166534' : '#667eea'
                                }}
                              >
                                {copiedTx ? (
                                  <>
                                    <CheckCircleIcon />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <CopyIcon />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                            <div style={{ 
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              color: '#667eea',
                              wordBreak: 'break-all'
                            }}>
                              {transactionHash}
                            </div>
                          </div>
                        )}

                        {/* Use in Approval Button */}
                        <button
                          onClick={useTokenIdInApproval}
                          className="button-hover"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          Use in Approval
                          <ArrowRightIcon />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Approve NFT Card */}
            <div className="card-hover" style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '2rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <ShieldIcon />
                  <h2 style={{ margin: '0 0 0 1rem', fontSize: '1.8rem' }}>Approve NFT</h2>
                </div>
                <p style={{ margin: 0, opacity: 0.9 }}>Grant marketplace permissions</p>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Marketplace Address
                  </label>
                  <input
                    type="text"
                    value={toAddress}
                    placeholder="0x..."
                    onChange={(e) => setToAddress(e.target.value)}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #e0e0e0',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    Address that will be approved to transfer your NFT
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Token ID
                  </label>
                  <input
                    type="number"
                    value={approvalTokenId}
                    placeholder="Enter token ID"
                    onChange={(e) => setApprovalTokenId(e.target.value)}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #e0e0e0',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    The ID of the NFT you want to approve
                  </div>
                </div>

                <button 
                  onClick={handleApprove}
                  disabled={loadingApprove || !toAddress || !approvalTokenId}
                  className="button-hover"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: loadingApprove || !toAddress || !approvalTokenId ? '#ccc' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: loadingApprove || !toAddress || !approvalTokenId ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loadingApprove ? (
                    <>
                      <Spinner />
                      Approving...
                    </>
                  ) : (
                    <>
                      <span>🛡️</span>
                      Approve Transfer
                    </>
                  )}
                </button>

                {approvalStatus && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: approvalStatus.includes("failed") ? '#fee' : '#efe',
                    border: `2px solid ${approvalStatus.includes("failed") ? '#fcc' : '#cfc'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ 
                        marginRight: '0.75rem', 
                        marginTop: '0.125rem',
                        color: approvalStatus.includes("failed") ? '#c33' : '#3c3'
                      }}>
                        {approvalStatus.includes("failed") ? <AlertCircleIcon /> : <CheckCircleIcon />}
                      </span>
                      <div style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: '500',
                        color: approvalStatus.includes("failed") ? '#c33' : '#3c3'
                      }}>
                        {approvalStatus}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            padding: '2rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333' }}>
              How It Works
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  padding: '1rem',
                  marginRight: '1rem',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <SparklesIcon />
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333', marginTop: 0 }}>
                    Create NFT
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                    Mint a new NFT by providing its metadata URI. The token will be created and assigned to your wallet. Copy the Token ID to use in the approval section.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '50%',
                  padding: '1rem',
                  marginRight: '1rem',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <ShieldIcon />
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333', marginTop: 0 }}>
                    Approve NFT
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                    Grant permission to a marketplace or another address to transfer your NFT on your behalf. Use the Token ID from the creation step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNFT;