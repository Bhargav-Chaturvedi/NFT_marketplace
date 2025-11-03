const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  try {
   await deployer.deploy(Marketplace);
    console.log('Marketplace deployed successfully');
  } catch (error) {
    console.error('Marketplace Deployment failed:', error);
  }
};
