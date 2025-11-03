import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Web3 from "web3";
import Navbar from "./components/Navbar";
import MyNFTs from "./components/MyNFTs";
import CreateNFT from "./components/CreateNFT";
import SellNFT from "./components/SellNFT";
import PurchaseNFT from "./components/PurchaseNFT";
import NFT from "./contracts/NFT.json";
import Marketplace from "./contracts/Marketplace.json";
import { Container, Row, Col, Alert, Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [nftAddress, setNftAddress] = useState(null);
  const [marketplaceAddress, setMarketplaceAddress] = useState(null);
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const init = async () => {
    const warningsList = [];
    let web3Instance;

    try {
      // Prefer injected provider if available, otherwise use a public/read-only RPC
      if (window.ethereum) {
        web3Instance = new Web3(window.ethereum);
      } else {
        const publicRpcUrl =
          process.env.REACT_APP_PUBLIC_RPC_URL ||
          // Reasonable default public RPC; replace with your project RPC for reliability
          "https://rpc.ankr.com/eth_sepolia";
        const provider = new Web3.providers.HttpProvider(publicRpcUrl);
        web3Instance = new Web3(provider);
      }

      setWeb3(web3Instance);

      // Do NOT force-connect on load; just read any existing accounts
      let fetchedAccounts = [];
      try {
        fetchedAccounts = await web3Instance.eth.getAccounts();
      } catch (_) {
        fetchedAccounts = [];
      }
      setAccounts(fetchedAccounts);
      setAccount(fetchedAccounts[0] || null);

      // ✅ Hardcode your deployed contract addresses
      const nftAddress = "0x19D791b89E653AAEA09332e6503c76F1EF2fAb44";
      const marketplaceAddress = "0x6fcc1453319D9627d96f91eF1177ea9B7325Ca34";

      // Always initialize contracts so addresses are visible even if wallet is not connected
      const nft = new web3Instance.eth.Contract(NFT.abi, nftAddress);
      const marketplace = new web3Instance.eth.Contract(Marketplace.abi, marketplaceAddress);

      setNftContract(nft);
      setMarketplaceContract(marketplace);
      setNftAddress(nftAddress);
      setMarketplaceAddress(marketplaceAddress);
    } catch (error) {
      console.error("Error initializing app:", error);
      warningsList.push({
        type: 'danger',
        title: 'Initialization Error',
        message: error.message,
      });
    }

    setWarnings(warningsList);
    setIsLoading(false);
  };

  init();
}, []);

 // React to MetaMask account / network changes without page refresh
 useEffect(() => {
  if (!window.ethereum) return;

  const handleAccountsChanged = (nextAccounts) => {
    setAccounts(nextAccounts || []);
    setAccount((nextAccounts && nextAccounts[0]) || null);
  };

  const handleChainChanged = () => {
    // Re-bind web3 to the injected provider so reads use the new network
    try {
      const nextWeb3 = new Web3(window.ethereum);
      setWeb3(nextWeb3);
    } catch (_) {}
  };

  const handleDisconnect = () => {
    handleAccountsChanged([]);
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('chainChanged', handleChainChanged);
  window.ethereum.on('disconnect', handleDisconnect);

  return () => {
    if (!window.ethereum) return;
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
    window.ethereum.removeListener('disconnect', handleDisconnect);
  };
 }, []);

 const [copied, setCopied] = useState("");

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500); // Reset after 1.5 sec
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const handleAccountChange = (event) => {
    setAccount(event.target.value);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWarnings([{ type: 'warning', title: 'Wallet not found', message: 'Install MetaMask to connect.' }]);
      return;
    }
    try {
      const nextAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(nextAccounts || []);
      setAccount((nextAccounts && nextAccounts[0]) || null);
    } catch (err) {
      setWarnings([{ type: 'danger', title: 'Connection rejected', message: err.message }]);
    }
  };

  const disconnectWallet = () => {
    // MetaMask doesn't support programmatic disconnect. We clear local state.
    setAccounts([]);
    setAccount(null);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar
          accounts={accounts}
          account={account}
          handleAccountChange={handleAccountChange}
          onConnectWallet={connectWallet}
          onDisconnectWallet={disconnectWallet}
        />

        <Container className="mt-5 mb-5">
          {/* Warning Messages */}
          {warnings.length > 0 && (
            <Row className="mb-4">
              <Col>
                {warnings.map((warning, index) => (
                  <Alert
                    key={index}
                    variant={warning.type}
                    className="aesthetic-alert"
                  >
                    <div className="d-flex align-items-center">
                      <div className="alert-icon me-3">
                        {warning.type === "danger" && "⚠️"}
                        {warning.type === "warning" && "⚡"}
                        {warning.type === "info" && "ℹ️"}
                      </div>
                      <div>
                        <Alert.Heading className="mb-1">
                          {warning.title}
                        </Alert.Heading>
                        <p className="mb-0">{warning.message}</p>
                      </div>
                    </div>
                  </Alert>
                ))}
              </Col>
            </Row>
          )}

          {/* Contract Addresses */}
          <Row className="mb-4">
            <Col>
              <Card className="contract-card shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-3">
                    <span className="title-icon">📝</span> Contract Information
                  </Card.Title>
                  <Row>
                     <Col md={6}>
        <div className="contract-info">
          <strong>NFT Contract:</strong>
          <div className="contract-address d-flex align-items-center gap-2">
            {nftAddress ? (
              <>
                <code>{nftAddress}</code>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleCopy(nftAddress, "nft")}
                >
                  📋
                </Button>
                {copied === "nft" && (
                  <span className="text-success small">Copied!</span>
                )}
              </>
            ) : (
              <span className="text-muted">Not deployed</span>
            )}
          </div>
        </div>
      </Col>

      <Col md={6}>
        <div className="contract-info">
          <strong>Marketplace Contract:</strong>
          <div className="contract-address d-flex align-items-center gap-2">
            {marketplaceAddress ? (
              <>
                <code>{marketplaceAddress}</code>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() =>
                    handleCopy(marketplaceAddress, "marketplace")
                  }
                >
                  📋
                </Button>
                {copied === "marketplace" && (
                  <span className="text-success small">Copied!</span>
                )}
              </>
            ) : (
              <span className="text-muted">Not deployed</span>
            )}
          </div>
        </div>
      </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Content */}
          <Row>
            <Col>
              {isLoading ? (
                <div className="loading-container text-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Initializing NFT Marketplace...</p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<Navigate to="/my-nfts" />} />
                  <Route
                    path="/my-nfts"
                    element={
                      <MyNFTs
                        web3={web3}
                        nftContract={nftContract}
                        marketplaceContract={marketplaceContract}
                        account={account}
                      />
                    }
                  />
                  <Route
                    path="/create-nft"
                    element={
                      <CreateNFT
                        web3={web3}
                        nftContract={nftContract}
                        account={account}
                      />
                    }
                  />
                  <Route
                    path="/sell-nft"
                    element={
                      <SellNFT
                        web3={web3}
                        nftContract={nftContract}
                        marketplaceContract={marketplaceContract}
                        account={account}
                      />
                    }
                  />
                  <Route
                    path="/purchase-nft"
                    element={
                      <PurchaseNFT
                        web3={web3}
                        marketplaceContract={marketplaceContract}
                        account={account}
                      />
                    }
                  />
                </Routes>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
};

export default App;
