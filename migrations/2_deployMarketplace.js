const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Marketplace, { gas: 10000000, gasPrice: 100000000000 });
  } catch (error) {
    console.error('Marketplace Deployment failed:', error);
  }
};
