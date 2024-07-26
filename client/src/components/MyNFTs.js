import React, { useState } from 'react';
import { Alert, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const MyNFTs = ({ web3, marketplaceContract, nftContract }) => {
  const [account, setAccount] = useState('');
  const [userNFTs, setUserNFTs] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState('');

  // Log the contract instances to verify initialization
  console.log('Marketplace Contract:', marketplaceContract);
  console.log('NFT Contract:', nftContract);

  // Fetch user's NFTs from the smart contract
  const fetchUserNFTs = async (trimmedAddress) => {
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
    }
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

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">My NFTs</h1>
      <Form onSubmit={handleFetchNFTs} className="mb-4">
        <Form.Group controlId="account" className="mb-3">
          <Form.Label>Account Address</Form.Label>
          <Form.Control
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Enter your account address"
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Find NFTs
        </Button>
      </Form>
      {transactionStatus && (
        <Alert variant="danger" className="mt-3">
          {transactionStatus}
        </Alert>
      )}
      <Row>
        {userNFTs.length === 0 ? (
          <Col>
            <p className="text-center">No NFTs found for this account.</p>
          </Col>
        ) : (
          userNFTs.map((nft, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card style={{ border: "2px solid #3498db", borderRadius: "10px", padding: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
                <Card.Img variant="top" src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} style={{ borderRadius: "10px" }} />
                <Card.Body>
                  <Card.Title>Item ID: {nft.itemId.toString()}</Card.Title>
                  <Card.Text>
                    Token ID: {nft.tokenId.toString()}
                    <br />
                    Owner: {nft.owner}
                    <br />
                    NFT URL: <a href={nft.tokenURI} target="_blank" rel="noopener noreferrer">{nft.tokenURI}</a>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default MyNFTs;
