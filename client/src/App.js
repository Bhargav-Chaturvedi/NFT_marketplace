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

      // ✅ Initialize Web3
      if (window.ethereum) {
        web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
          warningsList.push({
            type: "warning",
            title: "Wallet Connection",
            message:
              "Wallet connection denied. Please connect your wallet to interact with NFTs.",
          });
        }
      } else if (window.web3) {
        web3Instance = new Web3(window.web3.currentProvider);
      } else {
        const provider = new Web3.providers.HttpProvider(
          "https://eth-sepolia.g.alchemy.com/v2/LHwg7AgqTPwWyAGADjmo-ybadURIEy12"
        );
        web3Instance = new Web3(provider);
        warningsList.push({
          type: "info",
          title: "No Wallet Detected",
          message:
            "No Web3 wallet detected. Using Alchemy Sepolia provider. Please install MetaMask for full functionality.",
        });
      }

      setWeb3(web3Instance);

      // ✅ Listen to account and network changes
      if (window.ethereum) {
        const handleAccountsChanged = (newAccounts) => {
          setAccounts(newAccounts);
          setAccount(newAccounts[0]);
          console.log("🔁 Account changed:", newAccounts[0]);
        };

        const handleChainChanged = () => {
          console.log("🔁 Network changed, reloading...");
          window.location.reload();
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        // 🧹 Cleanup listeners on unmount
        return () => {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
      }

      try {
        // ✅ Hardcoded Sepolia contract addresses
        const NFT_ADDRESS = "0x19D791b89E653AAEA09332e6503c76F1EF2fAb44";
        const MARKETPLACE_ADDRESS = "0x6fcc1453319D9627d96f91eF1177ea9B7325Ca34";

        // ✅ Create contract instances
        const nft = new web3Instance.eth.Contract(NFT.abi, NFT_ADDRESS);
        const marketplace = new web3Instance.eth.Contract(
          Marketplace.abi,
          MARKETPLACE_ADDRESS
        );

        setNftContract(nft);
        setMarketplaceContract(marketplace);
        setNftAddress(NFT_ADDRESS);
        setMarketplaceAddress(MARKETPLACE_ADDRESS);

        // ✅ Load accounts
        const accs = await web3Instance.eth.getAccounts();
        setAccounts(accs);
        setAccount(accs[0]);

        if (accs.length === 0) {
          warningsList.push({
            type: "warning",
            title: "No Account Found",
            message: "No accounts detected. Please unlock your wallet.",
          });
        }
      } catch (error) {
        warningsList.push({
          type: "danger",
          title: "Initialization Error",
          message: `Failed to initialize contracts: ${error.message}`,
        });
      }

      setWarnings(warningsList);
      setIsLoading(false);
    };

    init();
  }, []);

  const handleAccountChange = (event) => {
    setAccount(event.target.value);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar
          accounts={accounts}
          account={account}
          handleAccountChange={handleAccountChange}
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
                        <div className="contract-address">
                          {nftAddress ? (
                            <code>{nftAddress}</code>
                          ) : (
                            <span className="text-muted">Not deployed</span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="contract-info">
                        <strong>Marketplace Contract:</strong>
                        <div className="contract-address">
                          {marketplaceAddress ? (
                            <code>{marketplaceAddress}</code>
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
