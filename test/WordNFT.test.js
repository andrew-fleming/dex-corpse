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

contract('WordNFT', ([owner, investor, brokeInvestor]) => {
    let dexquisiteToken, wordNFT

    before(async() => {
        dexquisiteToken = await DexquisiteToken.new(tokens('100000'))
        wordNFT = await WordNFT.new(dexquisiteToken.address)

        //transfer tokens to wordNFT
        await dexquisiteToken.transfer(wordNFT.address, tokens('100'))

        //transfer dxq to investor
        await dexquisiteToken.transfer(investor, tokens('25000'))
    })

    describe('WordNFT Token deployment', async() => {
        it('has a name', async() => {
            const name = await wordNFT.name()
            assert.equal(name, 'Word')
        })

        it('has a symbol', async() => {
            const symbol = await wordNFT.symbol()
            assert.equal(symbol, 'WORD')
        })

        it('wordNFT has dxq tokens', async() => {
            const balance = await dexquisiteToken.balanceOf(wordNFT.address)
            assert.equal(balance.toString(), tokens('100'))
        })
    })

    describe('dxq/wordNFTs', async() => {
        let result

        it('accepts dxq payments', async() => {
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('25000'))
        })

        it('mints and accepts payments correctly', async() => {
            //approval and mint
            await dexquisiteToken.approve(wordNFT.address, tokens('250'), {from: investor})
            await wordNFT.cClassMint('the', {from: investor})

            //check supply
            result = await wordNFT.totalSupply()
            assert.equal(result.toString(), '1')

            //check contract balance
            result = await dexquisiteToken.balanceOf(wordNFT.address)
            assert.equal(result.toString(), tokens('350'))

            //check investor dqx balance
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('24750'))
        })

        it('should mint all classes for their respective cost', async() => {
            //b class word
            await dexquisiteToken.approve(wordNFT.address, tokens('1000'), {from: investor})
            await wordNFT.bClassMint('waffles', {from: investor})

            //a class word
            await dexquisiteToken.approve(wordNFT.address, tokens('2500'), {from: investor})
            await wordNFT.aClassMint('apoplexy', {from: investor})

            //check supply
            result = await wordNFT.totalSupply()
            assert.equal(result.toString(), '3')
        })

        it('should revert mint calls from users without necessary funds', async() => {
            //check balance of account[3]
            result = await dexquisiteToken.balanceOf(brokeInvestor)
            assert.equal(result.toString(), tokens('0'))

            //broke investor should be denied
            await dexquisiteToken.approve(wordNFT.address, tokens('250'), {from: brokeInvestor})
            await wordNFT.cClassMint('hat', {from: brokeInvestor}).should.be.rejected

            //insufficient approval should be denied the mint
            await dexquisiteToken.approve(wordNFT.address, tokens('250'), {from: investor})
            await wordNFT.aClassMint('reticent', {from: investor}).should.be.rejected
        })
    })

    
})






/*
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

    describe('indexing', async() => {
        it('lists the words', async() => {
            await wordNFT.mint('world')
            const totalSupply = await wordNFT.totalSupply()

            let word
            let result = []

            for(var i = 0; i < totalSupply; i++){
                word = await wordNFT.words(i)
                result.push(word)
            }

            let expected = ['hodl', 'hello', 'world']
            assert.equal(result.join(','), expected.join(','))
        })
    })

    describe('dxq payments for nfts', async() => {
        it('accepts payment and mints nft', async() => {
            let result
            
            //check dxq balance of investor
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('500'))

            //check dxq balance of contract
            result = await dexquisiteToken.balanceOf(wordNFT.address)
            assert.equal(result.toString(), tokens('100'))

            //check approval and mint
            await dexquisiteToken.approve(wordNFT.address, tokens('50'), {from: investor})
            await wordNFT.mintClassA('waffles', tokens('50'), {from: investor})

            //check investor new balance
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('450'))

            //check wordNFT new balance
            result = await dexquisiteToken.balanceOf(wordNFT.address)
            assert.equal(result.toString(), tokens('150'))
        })
    })

*/