const DexFarm = artifacts.require('DexFarm')

module.exports = async(callback) => {
    let dexFarm = await DexFarm.deployed()

    await dexFarm.issueTokens()
    console.log('Tokens issued')

    callback()
}