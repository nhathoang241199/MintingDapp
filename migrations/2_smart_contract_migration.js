const SmartContract = artifacts.require("SmartContract");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, 'Alpha Wolf Card', 'AWC', 'https://raw.githubusercontent.com/nhathoang241199/NFT-demo/master/Card/');
};
