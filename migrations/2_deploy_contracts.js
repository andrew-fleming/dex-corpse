const MockDai = artifacts.require('MockDai');
const DexquisiteToken = artifacts.require('DexquisiteToken')
const DexFarm = artifacts.require('DexFarm')
const WordNFT = artifacts.require('WordNFT')

module.exports = async function (deployer, network, accounts) {

  //deploy mockDai token
  await deployer.deploy(MockDai, '1000000000000000000000')
  const mockDai = await MockDai.deployed()

  //deploy dexquisiteToken
  await deployer.deploy(DexquisiteToken, '50000000000000000000000')
  const dexquisiteToken = await DexquisiteToken.deployed()

  //deploy dexFarm
  await deployer.deploy(DexFarm, MockDai.address, DexquisiteToken.address)
  const dexFarm = await DexFarm.deployed()

  //deploy wordNFT
  await deployer.deploy(WordNFT, DexquisiteToken.address)
  const wordNFT = await WordNFT.deployed()
};