import React, { useState } from "react";
import { Alert, Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const SellNFT = ({ web3, marketplaceContract, account }) => {
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketItem, setMarketItem] = useState(null);

  const handleSellNFT = async () => {
    setLoading(true);
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

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <h1>Sell NFT</h1>
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleSellNFT();
            }}>
              <Form.Group controlId="nftContractAddress" className="mb-3">
                <Form.Label>NFT Contract Address</Form.Label>
                <Form.Control
                  type="text"
                  value={nftContractAddress}
                  placeholder="Enter NFT contract address"
                  onChange={(e) => setNftContractAddress(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="tokenId" className="mb-3">
                <Form.Label>Token ID</Form.Label>
                <Form.Control
                  type="number"
                  value={tokenId}
                  placeholder="Enter token ID"
                  onChange={(e) => setTokenId(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="price" className="mb-3">
                <Form.Label>Price (in ETH)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.0001"
                  value={price}
                  placeholder="Enter price in ETH"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Listing..." : "List NFT"}
              </Button>
            </Form>
            {transactionStatus && (
              <Alert
                className="mt-3"
                variant={
                  transactionStatus.includes("failed") ? "danger" : "success"
                }
              >
                {transactionStatus}
              </Alert>
            )}
            {marketItem && (
              <div className="mt-3">
                <h4>Market Item Details:</h4>
                <p>
                  <strong>Item ID:</strong> {marketItem.itemId.toString()}
                </p>
                <p>
                  <strong>Seller Address:</strong> {marketItem.seller}
                </p>
                <p>
                  <strong>Price (ETH):</strong> {marketItem.price}
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SellNFT;
