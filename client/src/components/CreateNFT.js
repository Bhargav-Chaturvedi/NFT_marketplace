import React, { useState } from "react";
import { Alert, Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const CreateNFT = ({ web3, nftContract, marketplaceContract, account }) => {
  const [tokenURI, setTokenURI] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [approvalTokenId, setApprovalTokenId] = useState(""); // Separate state for approval token ID
  const [transactionStatus, setTransactionStatus] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const handleCreateNFT = async () => {
    setLoadingCreate(true);
    try {
      const tx = await nftContract.methods
        .createNFT(tokenURI)
        .send({ from: account });
      console.log("Transaction receipt:", tx); // Log the transaction receipt
      if (tx.events && tx.events.NFTCreated) {
        const newTokenId = tx.events.NFTCreated.returnValues.tokenId;
        setTokenId(newTokenId);
        setTransactionStatus(
          `NFT created! Transaction hash: ${tx.transactionHash}`
        );
      } else {
        setTransactionStatus(
          "NFT creation failed. NFTCreated event not found."
        );
      }
    } catch (error) {
      console.error("Error creating NFT:", error);
      setTransactionStatus("NFT creation failed. See console for details.");
    }
    setLoadingCreate(false);
  };

  const handleApprove = async () => {
    setLoadingApprove(true);
    try {
      console.log(
        `Approving NFT with token ID ${approvalTokenId} to address ${toAddress} from account ${account}`
      );

      // Trim any leading or trailing spaces from the address
      const trimmedAddress = toAddress.trim();
      console.log("Trimmed To Address:", trimmedAddress);

      // Additional checks and logging before calling approve
      console.log("Parameters:");
      console.log("Token ID:", approvalTokenId);
      console.log("To Address:", trimmedAddress);
      console.log("Account:", account);

      // Check if trimmedAddress is valid
      if (!web3.utils.isAddress(trimmedAddress)) {
        throw new Error("Invalid address");
      }

      // Check if tokenId is valid
      if (approvalTokenId === "" || isNaN(approvalTokenId) || approvalTokenId < 0) {
        throw new Error("Invalid token ID");
      }

      const tx = await nftContract.methods
        .approve(trimmedAddress, approvalTokenId)
        .send({ from: account });
      console.log("Transaction receipt:", tx); // Log the transaction receipt
      setApprovalStatus(
        `Approval successful! Transaction hash: ${tx.transactionHash}`
      );
    } catch (error) {
      console.error("Error approving NFT:", error);
      setApprovalStatus("Approval failed. See console for details.");
    }
    setLoadingApprove(false);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card className="p-4 mb-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <h2>Create NFT</h2>
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleCreateNFT();
            }}>
              <Form.Group controlId="tokenURI" className="mb-3">
                <Form.Label>Token URI</Form.Label>
                <Form.Control
                  type="text"
                  value={tokenURI}
                  placeholder="IPFS address"
                  onChange={(e) => setTokenURI(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" disabled={loadingCreate}>
                {loadingCreate ? "Creating..." : "Create NFT"}
              </Button>
            </Form>
            {transactionStatus && (
              <Alert
                className="mt-3"
                variant={transactionStatus.includes("failed") ? "danger" : "success"}
              >
                {transactionStatus}
                {tokenId && (
                  <div>
                    <strong>Token ID:</strong> {tokenId.toString()}
                  </div>
                )}
              </Alert>
            )}
          </Card>
        </Col>
        <Col>
          <Card className="p-4 mb-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <h2>Approve NFT</h2>
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleApprove();
            }}>
              <Form.Group controlId="toAddress" className="mb-3">
                <Form.Label>Address to Approve</Form.Label>
                <Form.Control
                  type="text"
                  value={toAddress}
                  placeholder="Address of the Marketplace"
                  onChange={(e) => setToAddress(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="approvalTokenId" className="mb-3">
                <Form.Label>Token ID</Form.Label>
                <Form.Control
                  type="number"
                  value={approvalTokenId}
                  placeholder="Token Id"
                  onChange={(e) => setApprovalTokenId(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" disabled={loadingApprove}>
                {loadingApprove ? "Approving..." : "Approve"}
              </Button>
            </Form>
            {approvalStatus && (
              <Alert
                className="mt-3"
                variant={approvalStatus.includes("failed") ? "danger" : "success"}
              >
                {approvalStatus}
              </Alert>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateNFT;
