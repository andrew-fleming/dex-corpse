const DexquisiteToken = artifacts.require("DexquisiteToken");
const MockDai = artifacts.require('MockDai')

module.exports = async function (deployer, network, accounts) {
    //deploy 100,000 Mock Dai tokens
  await deployer.deploy(MockDai, '100000000000000000000000')
  const daiToken = await daiToken.deployed()

  //deploy 10,000,000 DXQ tokens
  await deployer.deploy(DexquisiteToken, '10000000000000000000000000')
  const dexquisiteToken = await dexquisiteToken.deployed()
};