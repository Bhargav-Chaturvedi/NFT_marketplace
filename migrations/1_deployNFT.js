const NFT = artifacts.require("NFT");

module.exports = async function (deployer) {
  await deployer.deploy(NFT);
};
