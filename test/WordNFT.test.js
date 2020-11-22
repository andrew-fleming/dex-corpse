const { assert } = require('chai')
const { default: Web3 } = require('web3')

const DexquisiteToken = artifacts.require('DexquisiteToken')
const WordNFT = artifacts.require('WordNFT')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n){
    return web3.utils.toWei(n, 'ether')
}

contract('WordNFT', ([owner, investor]) => {
    let dexquisiteToken, wordNFT

    before(async() => {
        dexquisiteToken = await DexquisiteToken.new(tokens('10000'))
        wordNFT = await WordNFT.new(dexquisiteToken.address)

        //transfer tokens to wordNFT
        await dexquisiteToken.transfer(wordNFT.address, tokens('100'))

        //transfer dxq to investor
        await dexquisiteToken.transfer(investor, tokens('500'))
    })

    describe('WordNFT Token deployment', async() => {
        it('has a name', async() => {
            const name = await wordNFT.name()
            assert.equal(name, 'Word')
        })

        it('wordNFT has tokens', async() => {
            const balance = await dexquisiteToken.balanceOf(wordNFT.address)
            assert.equal(balance.toString(), tokens('100'))
        })
    })

    describe('WordNFT minting', async() => {
        it('creates a new token', async() => {
            const result = await wordNFT.mint('hodl')

            //check total supply
            const totalSupply = await wordNFT.totalSupply()
            assert.equal(totalSupply, 1)
        })

        it('will not create the same word', async() => {
            await wordNFT.mint('hello')
            await wordNFT.mint('hello').should.be.rejected
        })
        
    })
})