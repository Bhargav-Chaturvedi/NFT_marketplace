// SEPOLIA TESTNET 

// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Web3 from 'web3';
// import Navbar from './components/Navbar';
// import MyNFTs from './components/MyNFTs';
// import CreateNFT from './components/CreateNFT';
// import SellNFT from './components/SellNFT';
// import PurchaseNFT from './components/PurchaseNFT';
// import NFT from './contracts/NFT.json';
// import Marketplace from './contracts/Marketplace.json';
// import { Container, Row, Col, Alert } from 'react-bootstrap';

// const App = () => {
//   const [web3, setWeb3] = useState(null);
//   const [nftContract, setNftContract] = useState(null);
//   const [marketplaceContract, setMarketplaceContract] = useState(null);
//   const [nftAddress, setNftAddress] = useState(null);
//   const [marketplaceAddress, setMarketplaceAddress] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [accounts, setAccounts] = useState([]);

//   useEffect(() => {
//     const init = async () => {
//       let web3Instance;
//       if (window.ethereum) {
//         web3Instance = new Web3(window.ethereum);
//         try {
//           await window.ethereum.request({ method: 'eth_requestAccounts' });
//         } catch (error) {
//           console.error('User denied account access');
//         }
//       } else if (window.web3) {
//         web3Instance = new Web3(window.web3.currentProvider);
//       } else {
//         const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
//         web3Instance = new Web3(provider);
//       }
//       setWeb3(web3Instance);

//       const networkId = await web3Instance.eth.net.getId();
//       const nftNetworkData = NFT.networks[networkId];
//       const marketplaceNetworkData = Marketplace.networks[networkId];

//       if (nftNetworkData && marketplaceNetworkData) {
//         const nft = new web3Instance.eth.Contract(NFT.abi, nftNetworkData.address);
//         const marketplace = new web3Instance.eth.Contract(Marketplace.abi, marketplaceNetworkData.address);
//         setNftContract(nft);
//         setMarketplaceContract(marketplace);
//         setNftAddress(nftNetworkData.address);
//         setMarketplaceAddress(marketplaceNetworkData.address);

//         const accounts = await web3Instance.eth.getAccounts();
//         setAccounts(accounts);
//         setAccount(accounts[0]);
//       } else {
//         alert('Contracts not deployed to detected network.');
//       }
//     };

//     init();
//   }, []);

//   const handleAccountChange = (event) => {
//     setAccount(event.target.value);
//   };

//   return (
//     <Router>
//       <Navbar accounts={accounts} account={account} handleAccountChange={handleAccountChange} />
//       <Container className="mt-4">
//         <Row>
//           <Col>
//             <h2>Contract Addresses</h2>
//             <Alert variant="info">
//               <p><strong>NFT Contract:</strong> {nftAddress ? nftAddress : 'Not deployed'}</p>
//               <p><strong>Marketplace Contract:</strong> {marketplaceAddress ? marketplaceAddress : 'Not deployed'}</p>
//             </Alert>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <Routes>
//               <Route path="/" element={<Navigate to="/my-nfts" />} />
//               <Route path="/my-nfts" element={<MyNFTs web3={web3} nftContract={nftContract} marketplaceContract={marketplaceContract} account={account} />} />
//               <Route path="/create-nft" element={<CreateNFT web3={web3} nftContract={nftContract} account={account} />} />
//               <Route path="/sell-nft" element={<SellNFT web3={web3} nftContract={nftContract} marketplaceContract={marketplaceContract} account={account} />} />
//               <Route path="/purchase-nft" element={<PurchaseNFT web3={web3} marketplaceContract={marketplaceContract} account={account} />} />
//             </Routes>
//           </Col>
//         </Row>
//       </Container>
//     </Router>
//   );
// };

// export default App;

// LOCALHOST 
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Web3 from 'web3';
import Navbar from './components/Navbar';
import MyNFTs from './components/MyNFTs';
import CreateNFT from './components/CreateNFT';
import SellNFT from './components/SellNFT';
import PurchaseNFT from './components/PurchaseNFT';
import NFT from './contracts/NFT.json';
import Marketplace from './contracts/Marketplace.json';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [nftAddress, setNftAddress] = useState(null);
  const [marketplaceAddress, setMarketplaceAddress] = useState(null);
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const init = async () => {
      let web3Instance;

      // Connect to Truffle local blockchain
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      const networkId = await web3Instance.eth.net.getId();
      const nftNetworkData = NFT.networks[networkId];
      const marketplaceNetworkData = Marketplace.networks[networkId];

      if (nftNetworkData && marketplaceNetworkData) {
        const nft = new web3Instance.eth.Contract(NFT.abi, nftNetworkData.address);
        const marketplace = new web3Instance.eth.Contract(Marketplace.abi, marketplaceNetworkData.address);
        setNftContract(nft);
        setMarketplaceContract(marketplace);
        setNftAddress(nftNetworkData.address);
        setMarketplaceAddress(marketplaceNetworkData.address);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        setAccount(accounts[0]);
      } else {
        alert('Contracts not deployed to the detected network.');
      }
    };

    init();
  }, []);

  const handleAccountChange = (event) => {
    setAccount(event.target.value);
  };

  return (
    <Router>
      <Navbar accounts={accounts} account={account} handleAccountChange={handleAccountChange} />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Contract Addresses</h2>
            <Alert variant="info">
              <p><strong>NFT Contract:</strong> {nftAddress ? nftAddress : 'Not deployed'}</p>
              <p><strong>Marketplace Contract:</strong> {marketplaceAddress ? marketplaceAddress : 'Not deployed'}</p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Navigate to="/my-nfts" />} />
              <Route path="/my-nfts" element={<MyNFTs web3={web3} nftContract={nftContract} marketplaceContract={marketplaceContract} account={account} />} />
              <Route path="/create-nft" element={<CreateNFT web3={web3} nftContract={nftContract} account={account} />} />
              <Route path="/sell-nft" element={<SellNFT web3={web3} nftContract={nftContract} marketplaceContract={marketplaceContract} account={account} />} />
              <Route path="/purchase-nft" element={<PurchaseNFT web3={web3} marketplaceContract={marketplaceContract} account={account} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
};

export default App;
