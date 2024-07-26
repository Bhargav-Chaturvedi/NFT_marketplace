require('dotenv').config();
const { MNEMONIC, PROJECT_ID } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

console.log('Mnemonic:', MNEMONIC);
console.log('Project ID:', PROJECT_ID);

module.exports = {
  contracts_build_directory: "./client/src/contracts",
  networks: {
    sepolia: {
      provider: () => {
        const providerURL = `wss://eth-sepolia.g.alchemy.com/v2/${PROJECT_ID}`;
        console.log('Provider URL:', providerURL);
        return new HDWalletProvider(MNEMONIC, providerURL);
      },
      network_id: '11155111', // Sepolia's network id
      gas: 6000000,           // Increase gas limit to 6,000,000
      gasPrice: 50000000000,  // Gas price (50 gwei)
      confirmations: 2,       // Number of confirmations to wait between deployments
      timeoutBlocks: 500,     // Number of blocks to wait before timing out
      skipDryRun: true        // Skip dry run before migrations? (default: false for public nets)
    },
  },
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },
};
