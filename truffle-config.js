module.exports = {
  networks: {
    localhost: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      gas: 10000000,  // Set the gas limit higher to match the block limit
      gasPrice: 20000000000,  // Optional gas price
    },
  },
  compilers: {
    solc: {
      version: "0.8.13",  // Ensure you're using the correct version of Solidity
    },
  },
};
